import { Download, Edit2, Plus, Trash2, UsersRound, X } from 'lucide-react';
import { useState } from 'react';
import { api } from '../api/client.js';
import { EmptyState } from '../components/EmptyState.jsx';
import { FormError } from '../components/FormError.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useApi } from '../hooks/useApi.js';

const csvEscape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

function EditUserModal({ user, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.patch(`/users/${user.id}`, form);
      onUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal-box stack-form" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="modal-header">
          <h2>Edit User</h2>
          <button type="button" className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <FormError error={error} />
        <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
        <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
        <label>Role<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option>MEMBER</option>
          <option>ADMIN</option>
        </select></label>
        <div className="modal-footer">
          <button type="button" className="ghost-btn-dark" onClick={onClose}>Cancel</button>
          <button className="primary-button" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
}

export function Users() {
  const { isAdmin, user: currentUser } = useAuth();
  const { data: users, loading, error, reload } = useApi(async () => (await api.get('/users')).data, []);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [formError, setFormError] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  if (!isAdmin) return <div className="form-error">Only admins can manage users.</div>;
  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <FormError error={error} />;

  const createUser = async (event) => {
    event.preventDefault();
    setFormError('');
    try {
      await api.post('/users', form);
      setForm({ name: '', email: '', password: '', role: 'MEMBER' });
      reload();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not create user');
    }
  };

  const deleteUser = async (target) => {
    if (!confirm(`Delete ${target.name}? This will remove their project memberships and assigned references.`)) return;
    await api.delete(`/users/${target.id}`);
    reload();
  };

  const toggleStatus = async (target) => {
    await api.patch(`/users/${target.id}/status`, { isActive: !target.isActive });
    reload();
  };

  const exportUsers = () => {
    const header = ['Name', 'Email', 'Role', 'Status', 'Created At'];
    const rows = users.map((item) => [
      item.name,
      item.email,
      item.role,
      item.isActive ? 'Active' : 'Inactive',
      item.createdAt ? new Date(item.createdAt).toLocaleString() : ''
    ]);
    const csv = [header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'team-task-manager-users.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="page split-page">
      <div>
        <div className="page-heading">
          <div>
            <h1>Users</h1>
            <p>Create members, view all system users, export the list, and manage accounts.</p>
          </div>
          <button className="primary-button" onClick={exportUsers}><Download size={18} /> Export</button>
        </div>
        {!users?.length && <EmptyState title="No users found" text="Created users will appear here." />}
        <section className="panel">
          <div className="users-table">
            <div className="users-header">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Status</span>
              <span>Created</span>
              <span>Actions</span>
            </div>
            {users?.map((item) => (
              <div className="users-row" key={item.id}>
                <strong>{item.name}</strong>
                <span className="email-cell">{item.email}</span>
                <StatusBadge value={item.role} />
                <button
                  className={`status-toggle ${item.isActive ? 'is-active' : 'is-inactive'}`}
                  disabled={item.id === currentUser.id}
                  onClick={() => toggleStatus(item)}
                  type="button"
                >
                  {item.isActive ? 'Active' : 'Inactive'}
                </button>
                <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</span>
                <div className="row-actions">
                  <button className="ghost-button" onClick={() => setEditingUser(item)} title="Edit user" style={{ padding: '0.4rem', minHeight: 'auto', background: '#f1f5f9', color: '#475569' }}>
                    <Edit2 size={16} />
                  </button>
                  <button className="danger-icon-button" disabled={item.id === currentUser.id} onClick={() => deleteUser(item)} title="Delete user" style={{ marginLeft: '0.4rem' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <form className="side-form" onSubmit={createUser}>
        <h2><UsersRound size={20} /> Create User</h2>
        <FormError error={formError} />
        <label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
        <label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
        <label>Password<input type="password" minLength="8" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
        <label>Role<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
          <option>MEMBER</option>
          <option>ADMIN</option>
        </select></label>
        <button className="primary-button"><Plus size={18} /> Add user</button>
      </form>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdated={() => { setEditingUser(null); reload(); }}
        />
      )}
    </section>
  );
}
