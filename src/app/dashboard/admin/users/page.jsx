"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiTrash2, FiUsers } from "react-icons/fi";

const roles = ["supporter", "creator", "admin"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [updatingRole, setUpdatingRole] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setUsers((prev) => prev.filter((u) => u._id.toString() !== id));
      toast.success("User deleted!");
    } catch (err) {
      toast.error(err.message || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const handleRoleChange = async (id, role) => {
    setUpdatingRole(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setUsers((prev) => prev.map((u) => (u._id.toString() === id ? { ...u, role } : u)));
      toast.success("Role updated!");
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setUpdatingRole(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Manage Users</h1>
        <p className="text-muted text-sm mt-1">{users.length} total users</p>
      </div>

      {users.length === 0 ? (
        <div className="bg-surface border border-white/5 rounded-2xl p-12 text-center">
          <FiUsers className="text-muted text-5xl mx-auto mb-4" />
          <p className="text-text font-semibold">No users found</p>
        </div>
      ) : (
        <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-muted text-xs font-medium uppercase tracking-wider">
            <div className="col-span-4">User</div>
            <div className="col-span-2">Credits</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-2">Joined</div>
            <div className="col-span-1">Action</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/5">
            {users.map((user) => (
              <div key={user._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/2 transition">
                {/* User Info */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-text font-medium text-sm truncate">{user.name}</p>
                    <p className="text-muted text-xs truncate">{user.email}</p>
                  </div>
                </div>

                {/* Credits */}
                <div className="col-span-2">
                  <span className="text-primary font-semibold text-sm">{user.credits ?? 0}</span>
                  <span className="text-muted text-xs ml-1">credits</span>
                </div>

                {/* Role Dropdown */}
                <div className="col-span-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id.toString(), e.target.value)}
                    disabled={updatingRole === user._id.toString()}
                    className="bg-background border border-white/10 hover:border-primary/50 focus:border-primary rounded-xl px-3 py-1.5 text-text text-xs outline-none transition-all disabled:opacity-50 capitalize"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {/* Joined */}
                <div className="col-span-2">
                  <p className="text-muted text-xs">
                    {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </div>

                {/* Delete */}
                <div className="col-span-1">
                  <button
                    onClick={() => handleDelete(user._id.toString())}
                    disabled={deleting === user._id.toString()}
                    className="text-red-400 hover:bg-red-400/10 p-2 rounded-xl transition disabled:opacity-50"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}