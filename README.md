# ⚡ IHaveGPU


## 🧰 Tech Stack  

| Layer | Technology |
|-------|-------------|
| **Frontend** | React, Vite, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Communication** | REST API / WebSocket |
| **Tools** | npm, dotenv, cors, concurrently |

---

## ⚙️ Installation & Setup

### 🧩 1. Clone & Install Dependencies
```bash
# Clone the project
git clone https://github.com/Meawdam/IHaveGPU.git
cd IHaveGPU
code .

# Open two terminals

# 🖥️ Frontend (Terminal 1)
cd client
npm install

# ⚙️ Backend (Terminal 2)
cd server
npm install
```

> 📦 **Note:**  
> ทำเพียงครั้งเดียวตอนติดตั้งโปรเจกต์  
> หากมีโฟลเดอร์ `node_modules` อยู่แล้วใน `client` และ `server` ไม่ต้องติดตั้งซ้ำ  

---

### 🔑 2. Create Environment File (.env)
สร้างไฟล์ชื่อ `.env` ในโฟลเดอร์ `server`  
หากไม่ต้องการสร้างไฟล์ ให้ลบข้อมูลตามที่กำหนดไว้ด้านล่าง แล้วใส่ค่าเองใน `app.js`

```env
# ตัวอย่างเท่านั้น (สามารถใช้ตามนี้เพื่อรันโปรเจกต์ได้)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=""
DB_NAME=ihavegpu   # ใส่ตามชื่อ Database ของตัวเอง

SESSION_SECRET=ILoveCodingMakMak
SERVER_PORT=3000
```

---

### 🔧 3. Configure Server
หากไม่ต้องการสร้างไฟล์ `.env`  
ให้ตั้งค่าโดยตรงใน `app.js` ตามนี้ 👇  

```js
app.use(session({
  secret: "ILoveCoding", // <====== RIGHT HERE
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // session อายุ 1 ชั่วโมง
}));

// 🗄️ Database Configuration
const con = mysql.createConnection({
  host: "localhost",     // <===== RIGHT HERE
  user: "root",          // <===== RIGHT HERE
  password: "",          // <===== RIGHT HERE
  database: "ihavegpu"   // <===== RIGHT HERE (can be any)
});

con.connect(err => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
    return;
  }
  console.log('✅ Connected to MySQL');
});

app.listen(3000, () => { // <===== RIGHT HERE
  console.log("✅ Server is running on port 3000...");
});
```

---

### ▶️ 4. Run the Project
เปิด **สองหน้าต่าง Terminal** แล้วรันตามนี้:

```bash
# 🖥️ Terminal 1 - Frontend

```bash
# ⚙️ Terminal 2 - Backend
cd server
npm start
```

---

> ⚠️ **Important Note:**  
> ต้องรัน **Database Server (เช่น XAMPP / MySQL)** ก่อนเสมอ!  
> และอย่าลืมตรวจสอบว่า server ไม่มี error — ถ้ามีให้ debug ตามหน้างาน  
> อย่าลืมอัพโหลด file sql ด้วยนะจ๊ะ

---

## 🎯 Summary
- ✅ ติดตั้งครบทั้ง frontend และ backend  
- 🔑 ตั้งค่า `.env` หรือแก้ไขค่าโดยตรงใน `app.js`  
- 🧩 แยก terminal สำหรับ frontend / backend  
- ⚙️ ตรวจสอบให้แน่ใจว่า database ทำงานอยู่ก่อน  

---

## 💬 Credits
Project by **Meawdam** ติดต่อในเวลาทำการ **เท่านั้น!!!**

Built with ❤️ using **React + Node.js + MySQL**

