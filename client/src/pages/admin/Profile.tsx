import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminSettings = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/profile", {
          withCredentials: true,
        });
        setUsername(res.data.username);
        setEmail(res.data.email);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Failed to fetch profile",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };
    fetchProfile();
  }, []);

const updateProfile = async () => {
  try {
    await axios.put(
      "http://localhost:3000/profile",
      { username, email },
      { withCredentials: true }
    );
    window.dispatchEvent(new CustomEvent("usernameUpdated", { detail: username }));

    Swal.fire({
      icon: "success",
      title: "Profile updated successfully",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Update failed",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-10">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Admin Settings
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <button
            onClick={updateProfile}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded-md transition-colors duration-200"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
