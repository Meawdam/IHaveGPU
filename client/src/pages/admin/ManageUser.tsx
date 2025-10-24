import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaUser, FaTrash, FaUserShield } from "react-icons/fa";

type User = {
  user_id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
};

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users", {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to fetch users",
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (user_id: number, newRole: string) => {
    try {
      await axios.put(
        `http://localhost:3000/users/${user_id}/role`,
        { role: newRole },
        { withCredentials: true }
      );

      Swal.fire({
        icon: "success",
        title: `Role updated to ${newRole}`,
        showConfirmButton: false,
        timer: 1500,
      });

      fetchUsers();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed to update role",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const deleteUser = async (user_id: number) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(
            `http://localhost:3000/users/${user_id}`,
            { withCredentials: true }
          );

          Swal.fire({
            icon: "success",
            title: res.data.message || "User deleted",
            showConfirmButton: false,
            timer: 1500,
          });

          setUsers((prev) => prev.filter((u) => u.user_id !== user_id));
        } catch (err: any) {
          console.error("Delete user failed:", err);
          Swal.fire({
            icon: "error",
            title: err.response?.data?.message || "Failed to delete user",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Loading users...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center mt-10 text-gray-600">
        <FaUser size={40} className="mb-2" />
        <p>No users found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">User ID</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Joined</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.user_id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3 font-medium">#{user.user_id}</td>
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 capitalize">
                  {user.role === "admin" ? (
                    <span className="text-red-600 font-semibold">Admin</span>
                  ) : (
                    <span className="text-gray-700">{user.role}</span>
                  )}
                </td>
                <td className="p-3 text-gray-600">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 flex justify-center space-x-2">
                  {user.role !== "admin" ? (
                    <button
                      onClick={() => changeRole(user.user_id, "admin")}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center"
                    >
                      <FaUserShield className="mr-1" /> Make Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => changeRole(user.user_id, "user")}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Revoke Admin
                    </button>
                  )}
                  <button
                    onClick={() => deleteUser(user.user_id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
