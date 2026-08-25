import React, { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { getUsersDB, deleteUser } from "../services/store.js";
import ConfirmModal from "../components/ConfirmModal.jsx";

export default function AdminUsersSection() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await getUsersDB();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = !q ? users : users.filter(u => `${u.username || ''} ${u.email || ''}`.toLowerCase().includes(q));

  const confirmDelete = async () => {
    if (confirmTarget) {
      try {
        await deleteUser(confirmTarget.id || confirmTarget._id);
        setUsers(users.filter(u => (u.id || u._id) !== (confirmTarget.id || confirmTarget._id)));
      } catch (err) {
        alert(err.message || "Failed to delete user");
      }
    }
    setConfirmTarget(null);
  };

  return (
    <div className="card form-card admin-block">
      <div className="admin-block-head">
        <p className="eyebrow" style={{ margin: 0 }}>{filtered.length} USER{filtered.length === 1 ? "" : "S"}</p>
        <div className="admin-search">
          <Search size={14} />
          <input placeholder="Search users..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
      </div>
      <div className="admin-userlist">
        {loading ? (
          <p className="admin-empty">Loading users...</p>
        ) : filtered.length === 0 ? (
          <p className="admin-empty">No users found.</p>
        ) : (
          filtered.map(u => (
            <div className="admin-user-row" key={u.id || u._id}>
              <span className="user-avatar">{(u.username || u.name || "?").trim().charAt(0).toUpperCase()}</span>
              <div className="admin-user-info">
                <strong>{u.username || u.name}</strong>
                <small>{u.email || "No email on file"}</small>
              </div>
              <span className="pkg-tag">{u.role || u.package || "—"}</span>
              <button type="button" className="icon-btn" onClick={() => setConfirmTarget(u)} aria-label={`Delete ${u.username}`}>
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
      {confirmTarget && (
        <ConfirmModal 
          title="Delete this user?" 
          message={`Are you sure you want to delete ${confirmTarget.username || confirmTarget.name}? This action cannot be undone.`} 
          confirmLabel="DELETE USER" 
          onConfirm={confirmDelete} 
          onCancel={() => setConfirmTarget(null)} 
        />
      )}
    </div>
  );
}