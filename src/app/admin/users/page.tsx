"use client";

import { useEffect, useState } from "react";

type User = {
  uid: string;
  email: string;
  creationTime: string;
  role?: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("super_admin");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email || !password) return;

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess("User created successfully!");
        setEmail("");
        setPassword("");
        setRole("super_admin");
        fetchUsers();
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDelete = async (uid: string) => {
    if (confirm("Are you sure you want to delete this admin user?")) {
      try {
        const res = await fetch(`/api/users?uid=${uid}`, { method: "DELETE" });
        const data = await res.json();
        if (data.error) {
          alert(data.error);
        } else {
          fetchUsers();
        }
      } catch (error: any) {
        alert("Failed to delete user");
      }
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-on-surface">Admin Users Management</h2>
      
      <div className="mb-8 rounded-xl border border-primary/20 bg-surface p-6">
        <h3 className="mb-4 text-lg font-semibold text-on-surface">Create New Admin User</h3>
        {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
        {success && <div className="mb-4 text-sm text-green-500">{success}</div>}
        <form onSubmit={handleCreate} className="flex flex-col gap-4 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="flex-1 rounded-lg border border-primary/20 bg-background px-4 py-2 text-sm text-on-surface outline-none focus:border-primary"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="flex-1 rounded-lg border border-primary/20 bg-background px-4 py-2 text-sm text-on-surface outline-none focus:border-primary"
            required
            minLength={6}
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="flex-1 rounded-lg border border-primary/20 bg-background px-4 py-2 text-sm text-on-surface outline-none focus:border-primary"
            style={{ colorScheme: 'dark' }}
          >
            <option value="super_admin" className="bg-white text-black">Super Admin</option>
            <option value="staff" className="bg-white text-black">Staff (Limited Access)</option>
          </select>
          <button type="submit" className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-btn-primary hover:bg-primary/90">
            Create User
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-primary/20 bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-primary/20 bg-background text-on-surface-muted">
            <tr>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Created At</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-on-surface-muted">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-on-surface-muted">
                  No admin users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.uid} className="hover:bg-primary/5">
                  <td className="px-6 py-4 font-medium text-on-surface">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded px-2 py-1 text-xs font-bold ${
                      user.role === 'super_admin' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      {user.role === 'super_admin' ? 'Super Admin' : 'Staff'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-muted">
                    {new Date(user.creationTime).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(user.uid)}
                      className="text-xs font-medium text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



