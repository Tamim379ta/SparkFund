"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiTrash2, FiUsers, FiX, FiAlertTriangle } from "react-icons/fi";

const roles = ["supporter", "creator", "admin"];

function ConfirmModal({ open, onConfirm, onCancel, name }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center">
            <FiAlertTriangle className="text-red-400 text-lg" />
          </div>
          <h2 className="text-text font-bold text-lg">Delete User</h2>
        </div>
        <p className="text-muted text-sm mb-6">
          Are you sure you want to delete <span className="text-text font-semibold">{name}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-white/10 text-muted py-2.5 rounded-full text-sm hover:text-text transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white font-semibold py-2.5 rounded-full text-sm hover:opacity-90 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [updatingRole, setUpdatingRole] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null, name: "" });

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

  const handleDeleteClick = (id, name) => {
    setConfirmModal({ open: true, id, name });
  };

  const handleDeleteConfirm = async () => {
    const id = confirmModal.id;
    setConfirmModal({ open: false, id: null, name: "" });
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
      <ConfirmModal
        open={confirmModal.open}
        name={confirmModal.name}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmModal({ open: false, id: null, name: "" })}
      />

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
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-muted text-xs font-medium uppercase tracking-wider">
            <div className="col-span-4">User</div>
            <div className="col-span-2">Credits</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-2">Joined</div>
            <div className="col-span-1">Action</div>
          </div>

          <div className="divide-y divide-white/5">
            {users.map((user) => (
              <div key={user._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/2 transition">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-text font-medium text-sm truncate">{user.name}</p>
                    <p className="text-muted text-xs truncate">{user.email}</p>
                  </div>
                </div>

                <div className="col-span-2">
                  <span className="text-primary font-semibold text-sm">{user.credits ?? 0}</span>
                  <span className="text-muted text-xs ml-1">credits</span>
                </div>

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

                <div className="col-span-2">
                  <p className="text-muted text-xs">
                    {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </div>

                <div className="col-span-1">
                  <button
                    onClick={() => handleDeleteClick(user._id.toString(), user.name)}
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