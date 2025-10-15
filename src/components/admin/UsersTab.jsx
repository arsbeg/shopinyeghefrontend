import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roles, setRoles] = useState({}); // временные роли перед сохранением

  const fetchUsers = async () => {
    try {
      const res = await api.get("/Users/all");
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
      await api.post(`/Users/ch_role/${userId}/${role}`);
      alert("Role updated successfully");
      fetchUsers();
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update role");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <input
        type="text"
        placeholder="Search user..."
        className="border p-2 rounded w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr key={u.id} className="text-center">
              <td className="border p-2">{u.id}</td>
              <td className="border p-2">{u.username}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">
                <select
                  className="border p-1 rounded"
                  value={roles[u.id] || u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                >
                  <option value="1">Admin</option>
                  <option value="2">Manager</option>
                  <option value="3">Courier</option>
                  <option value="4">User</option>
                </select>
              </td>
              <td className="border p-2">
                <button
                  onClick={() => saveRole(u.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
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
