import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roles, setRoles] = useState({}); // временные роли перед сохранением
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  console.log({ token });

  const fetchUsers = async () => {
    if (!token) return;

    try {
      const res = await api.get("/Users/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  const saveRole = async (userId) => {
    const role = roles[userId];
    if (!role) return;

    try {
      await api.put(
        `/Users/ch_role/${userId}/${role}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Role updated successfully");
      fetchUsers();
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update role");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  // 🔒 если не админ — не показываем таблицу
  if (!user || user.role !== "admin") {
    return (
      <div className="text-center text-red-600 mt-10 text-lg">
        ⛔ Access denied — Admin only
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <input
        type="text"
        placeholder="Search user..."
        className="border p-2 rounded-full w-1/4 mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="w-full text-sm text-center rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-900 uppercase bg-gray-50">
          <tr className="bg-blue-300">
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Avatar</th>
            <th className="px-6 py-3">Username</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Current Role</th>
            <th className="px-6 py-3">Role Change</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr
              key={u.id}
              className="text-center odd:bg-white even:bg-blue-50 border-b border-gray-200"
            >
              <td className="px-6 py-3">{u.id}</td>
              <td className="px-6 py-3">
                <img
                  src={
                    u.user_image
                      ? `${API_BASE_URL}${u.user_image}`
                      : `${API_BASE_URL}/static/images/avatar/default_avatar.png`
                  }
                  alt="User avatar"
                  className="w-20 h-20 rounded-full object-cover border-4 border-green-500"
                />
              </td>
              <td className="px-6 py-3">{u.username}</td>
              <td className="px-6 py-3">{u.email_address}</td>
              <td className="px-6 py-3">{u.us_role}</td>
              <td className="px-6 py-3">
                <select
                  className="border p-1 rounded-full"
                  value={roles[u.id] || u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                >
                  <option value="1">Admin</option>
                  <option value="2">Courier</option>
                  <option value="3">Manager</option>
                  <option value="4">User</option>
                </select>
              </td>
              <td className="px-6 py-3">
                <button
                  onClick={() => saveRole(u.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-full cursor-pointer hover:bg-blue-400"
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
