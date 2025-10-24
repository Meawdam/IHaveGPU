const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const session = require("express-session");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");

env.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

// File upload setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const upload = multer({ storage });
app.use("/upload", express.static(path.join(__dirname, "upload")));

// Database connection
const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

con.connect((err) => {
  if (err) {
    console.error("Cannot connect to database!!!", err.message);
  } else {
    console.log("Connected to database successfully");
  }
});

// ======= Routes =======

// --- Home ---
app.get("/", (req, res) => {
  res.send(process.env.DB_NAME);
});

// --- Auth ---
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const [existingUser] = await con
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0)
      return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await con
      .promise()
      .query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [
        username,
        email,
        hashedPassword,
      ]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const [users] = await con
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    req.session.user = {
      id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    res
      .status(200)
      .json({ message: "Login successful", user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logout successful", loggedIn: false });
  });
});

// --- Users ---
app.get("/user", (req, res) => {
  if (req.session.user) {
    res.status(200).json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

app.get("/users", async (req, res) => {
  try {
    const [rows] = await con
      .promise()
      .query(
        "SELECT user_id, username, email, role, create_at AS created_at FROM users ORDER BY user_id ASC"
      );
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

app.put("/users/:id/role", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!["admin", "customer"].includes(role))
    return res.status(400).json({ message: "Invalid role" });

  try {
    const [result] = await con
      .promise()
      .query("UPDATE users SET role = ? WHERE user_id = ?", [role, id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Role updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

app.delete("/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (userId === req.session.user.id) {
    return res.status(400).json({ message: "Cannot delete yourself" });
  }

  try {
    await con.promise().beginTransaction();
    const [orders] = await con
      .promise()
      .query("SELECT order_id FROM orders WHERE user_id = ?", [userId]);
    const orderIds = orders.map(o => o.order_id);
    if (orderIds.length > 0) {
      const placeholders = orderIds.map(() => "?").join(",");
      await con.promise().query(`DELETE FROM order_items WHERE order_id IN (${placeholders})`, orderIds);
      await con.promise().query(`DELETE FROM orders WHERE order_id IN (${placeholders})`, orderIds);
    }
    await con.promise().query("DELETE FROM cart WHERE user_id = ?", [userId]);
    await con.promise().query("DELETE FROM reviews WHERE user_id = ?", [userId]);

    const [result] = await con.promise().query("DELETE FROM users WHERE user_id = ?", [userId]);
    if (result.affectedRows === 0) {
      await con.promise().rollback();
      return res.status(404).json({ message: "User not found" });
    }

    await con.promise().commit();
    res.status(200).json({ message: "User and related data deleted successfully" });
  } catch (err) {
    await con.promise().rollback();
    console.error("Delete user error:", err.sqlMessage || err.message);
    res.status(500).json({ message: "Database error" });
  }
});
// --- Profile ---
app.get("/profile", async (req, res) => {
  try {
    const [rows] = await con
      .promise()
      .query("SELECT user_id, username, email FROM users WHERE user_id = ?", [
        req.session.user.id,
      ]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

app.put("/profile", async (req, res) => {
  const { username, email } = req.body;
  try {
    await con
      .promise()
      .query("UPDATE users SET username = ?, email = ? WHERE user_id = ?", [
        username,
        email,
        req.session.user.id,
      ]);
    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// --- Products ---
app.get("/products", (req, res) => {
  con.query("SELECT * FROM products", (error, result) => {
    if (error) return res.status(500).json({ message: error.message });
    res.status(200).json(result);
  });
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await con.promise().query(
      `SELECT p.*, c.category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.category_id
       WHERE product_id = ?`,
      [id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Product not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

app.post("/products", upload.single("image"), async (req, res) => {
  try {
    const { product_name, price, stock, category_id, brand, description } =
      req.body;
    const image_url = req.file ? `/upload/${req.file.filename}` : null;
    await con
      .promise()
      .query(
        "INSERT INTO products (product_name, price, stock, category_id, brand, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [product_name, price, stock, category_id, brand, description, image_url]
      );
    res.status(201).json({ message: "Product added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

app.put("/products/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { product_name, price, stock, category_id, description } = req.body;

  try {
    let image_url = req.file ? `/upload/${req.file.filename}` : null;

    if (!image_url) {
      const [rows] = await con
        .promise()
        .query("SELECT image_url FROM products WHERE product_id = ?", [id]);
      if (rows.length > 0) image_url = rows[0].image_url;
    }

    await con
      .promise()
      .query(
        "UPDATE products SET product_name=?, price=?, stock=?, category_id=?, description=?, image_url=? WHERE product_id=?",
        [product_name, price, stock, category_id, description, image_url, id]
      );

    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await con
      .promise()
      .query("DELETE FROM products WHERE product_id = ?", [id]);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- Categories ---
app.get("/category", async (req, res) => {
  try {
    const [rows] = await con
      .promise()
      .query("SELECT * FROM categories ORDER BY category_id DESC");
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// --- Cart ---
app.get("/cart", async (req, res) => {
  try {
    const userId = req.session.user.id;
    const [rows] = await con.promise().query(
      `SELECT c.cart_id, c.quantity, p.product_id, p.product_name, p.price, p.image_url
       FROM cart c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.user_id = ?`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

app.post("/cart", async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ message: "Please login first" });

    const { product_id, quantity } = req.body;
    if (!product_id || !quantity)
      return res
        .status(400)
        .json({ message: "Product ID and quantity required" });

    const [productRows] = await con
      .promise()
      .query("SELECT stock FROM products WHERE product_id = ?", [product_id]);

    if (!productRows[0])
      return res.status(404).json({ message: "Product not found" });

    if (productRows[0].stock < quantity)
      return res.status(400).json({ message: "Not enough stock" });

    const [existing] = await con
      .promise()
      .query("SELECT * FROM cart WHERE user_id = ? AND product_id = ?", [
        userId,
        product_id,
      ]);

    if (existing.length > 0) {
      const newQuantity = existing[0].quantity + quantity;
      if (newQuantity > productRows[0].stock)
        return res.status(400).json({ message: "Cannot add more than stock" });

      await con
        .promise()
        .query("UPDATE cart SET quantity = ? WHERE cart_id = ?", [
          newQuantity,
          existing[0].cart_id,
        ]);
      return res.json({
        message: "Cart updated successfully",
        cart_id: existing[0].cart_id,
      });
    }

    const [result] = await con
      .promise()
      .query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [userId, product_id, quantity]
      );

    res
      .status(201)
      .json({ message: "Product added to cart", cart_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Add to cart failed" });
  }
});

app.put("/cart/:id", async (req, res) => {
  try {
    const cartId = req.params.id;
    let quantity = parseInt(req.body.quantity);
    if (isNaN(quantity) || quantity < 1) quantity = 1;

    const [productRows] = await con.promise().query(
      `SELECT p.stock 
         FROM cart c 
         JOIN products p ON c.product_id = p.product_id 
         WHERE c.cart_id = ?`,
      [cartId]
    );

    if (!productRows[0])
      return res.status(404).json({ message: "Cart item not found" });

    const stock = productRows[0].stock;
    if (quantity > stock)
      return res
        .status(400)
        .json({ message: `Cannot exceed stock (${stock})` });

    await con
      .promise()
      .query("UPDATE cart SET quantity = ? WHERE cart_id = ?", [
        quantity,
        cartId,
      ]);

    res.json({ message: "Quantity updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update quantity" });
  }
});

app.delete("/cart/:id", async (req, res) => {
  try {
    const cartId = req.params.id;
    const [result] = await con
      .promise()
      .query("DELETE FROM cart WHERE cart_id = ?", [cartId]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Cart item not found" });

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove item" });
  }
});

// --- Orders ---
app.post("/orders", async (req, res) => {
  const userId = req.session.user.id;
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ message: "Cart is empty" });

  try {
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const [orderResult] = await con
      .promise()
      .query("INSERT INTO orders (user_id, total_price) VALUES (?, ?)", [
        userId,
        totalPrice,
      ]);
    const orderId = orderResult.insertId;

    for (const item of items) {
      await con
        .promise()
        .query(
          "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
          [orderId, item.product_id, item.quantity, item.price]
        );
    }

    const cartIds = items.map((i) => i.cart_id).filter((id) => id != null);
    if (cartIds.length > 0) {
      const placeholders = cartIds.map(() => "?").join(",");
      await con
        .promise()
        .query(`DELETE FROM cart WHERE cart_id IN (${placeholders})`, cartIds);
    }

    res.json({ message: "Order placed successfully", orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Checkout failed" });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const [orders] = await con.promise().query(
      `SELECT o.order_id, o.user_id, u.username, o.total_price, o.status, o.create_at
       FROM orders o
       JOIN users u ON o.user_id = u.user_id
       ORDER BY o.create_at DESC`
    );

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const [items] = await con.promise().query(
          `SELECT oi.order_item_id, p.product_name, oi.quantity, oi.price
           FROM order_items oi
           JOIN products p ON oi.product_id = p.product_id
           WHERE oi.order_id = ?`,
          [order.order_id]
        );
        return { ...order, items };
      })
    );

    res.json(ordersWithItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

app.put("/orders/:id/status", async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const validStatuses = ["pending", "completed", "cancelled"];
  if (!validStatuses.includes(status))
    return res.status(400).json({ message: "Invalid status" });

  try {
    // อัปเดตสถานะของคำสั่งซื้อ
    await con
      .promise()
      .query("UPDATE orders SET status = ? WHERE order_id = ?", [
        status,
        orderId,
      ]);

    if (status === "completed") {
      const [items] = await con
        .promise()
        .query(
          `SELECT product_id, quantity FROM order_items WHERE order_id = ?`,
          [orderId]
        );

      for (const item of items) {
        await con
          .promise()
          .query(
            "UPDATE products SET stock = stock - ? WHERE product_id = ? AND stock >= ?",
            [item.quantity, item.product_id, item.quantity]
          );
      }
    }

    res.json({ message: `Order status updated to ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

app.put("/orders/:id/cancel", async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.session.user.id;

    const [orders] = await con
      .promise()
      .query("SELECT * FROM orders WHERE order_id = ? AND user_id = ?", [
        orderId,
        userId,
      ]);

    if (orders.length === 0)
      return res.status(404).json({ message: "Order not found" });

    const order = orders[0];
    if (order.status !== "pending")
      return res.status(400).json({ message: "Cannot cancel this order" });

    await con
      .promise()
      .query("UPDATE orders SET status = 'cancelled' WHERE order_id = ?", [
        orderId,
      ]);

    res.json({ message: "Order cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cancel order" });
  }
});

app.delete("/orders/:id", async (req, res) => {
  const orderId = req.params.id;

  try {
    await con
      .promise()
      .query("DELETE FROM order_items WHERE order_id = ?", [orderId]);
    await con
      .promise()
      .query("DELETE FROM orders WHERE order_id = ?", [orderId]);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete order" });
  }
});

app.get("/stats", async (req, res) => {
  try {
    const [ordersResult] = await con
      .promise()
      .query(
        "SELECT COUNT(*) AS totalOrders, IFNULL(SUM(total_price),0) AS totalRevenue FROM orders WHERE status = 'completed'"
      );

    const [usersResult] = await con
      .promise()
      .query("SELECT COUNT(*) AS totalUsers FROM users");

    const [productsResult] = await con
      .promise()
      .query("SELECT COUNT(*) AS totalProducts FROM products");

    res.json({
      totalOrders: ordersResult[0].totalOrders,
      totalRevenue: ordersResult[0].totalRevenue,
      totalUsers: usersResult[0].totalUsers,
      totalProducts: productsResult[0].totalProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/admin/order-stats", async (req, res) => {
  try {
    const [pending] = await con.promise().query(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'pending'"
    );
    const [completed] = await con.promise().query(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'completed'"
    );
    const [cancelled] = await con.promise().query(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'cancelled'"
    );

    res.json({
      pending: pending[0].count,
      completed: completed[0].count,
      cancelled: cancelled[0].count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch order stats" });
  }
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
