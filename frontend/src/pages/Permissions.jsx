import { Plus, Save, Shield, Users, X } from 'lucide-react';
import { useState } from 'react';
import { api } from '../api/client.js';
import { FormError } from '../components/FormError.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useApi } from '../hooks/useApi.js';

/* ── general page-wise permission labels ─────────────────────────── */
const adminPermissions = {
  dashboard: 'Dashboard Access',
  projects: 'Projects Management',
  tasks: 'Tasks Management',
  profile: 'Profile Access',
  users: 'Users Management',
  permissions: 'Permissions Management',
};

const memberPermissions = {
  dashboard: 'Dashboard Access',
  projects: 'Projects Access',
  tasks: 'Tasks Access',
  profile: 'Profile Access',
  users: 'Users Access',
  permissions: 'Permissions Access',
};

const tabMeta = [
  { key: 'ADMIN', label: 'Admin', icon: Shield, permMap: adminPermissions },
  { key: 'MEMBER', label: 'Member', icon: Users, permMap: memberPermissions },
];

/* ═══════════════════════════════════════════════════════════════════════
   Main Permissions Page
   ═══════════════════════════════════════════════════════════════════════ */
export function Permissions() {
  const { isAdmin } = useAuth();
  const { data, loading, error, reload } = useApi(
    async () => (await api.get('/permissions')).data,
    []
  );
  const [activeTab, setActiveTab] = useState('ADMIN');
  const [saving, setSaving] = useState(false);

  if (!isAdmin) return <div className="form-error">Only admins can manage role permissions.</div>;
  if (loading) return <div className="loading">Loading permissions…</div>;
  if (error) return <FormError error={error} />;

  /* find the data entry that matches the active tab role */
  const activeRole = data.find((d) => d.role === activeTab);
  const currentTab = tabMeta.find((t) => t.key === activeTab);

  const handleToggle = async (key, currentVal) => {
    if (activeTab !== 'MEMBER') return; // only member toggles are editable
    setSaving(true);
    try {
      const updatedPermissions = { ...activeRole.permissions, [key]: !currentVal };
      await api.patch(`/permissions/${activeTab}`, { permissions: updatedPermissions });
      await reload();
    } catch (e) {
      console.error('Failed to update permission', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page">
      {/* heading */}
      <div className="page-heading">
        <div>
          <h1>Roles &amp; Permissions</h1>
          <p>
            {activeTab === 'MEMBER'
              ? 'Manage permissions for the Member role. Changes are saved instantly.'
              : 'Admin permissions are fixed for security.'}
          </p>
        </div>
      </div>

      {/* role tab switcher */}
      <div className="role-tabs" style={{ marginBottom: '1.2rem' }}>
        {tabMeta.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              className={`role-tab-btn${activeTab === t.key ? ' active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              <Icon size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* permission toggles — horizontal, enabled only for Member */}
      {activeRole ? (
        <div className="panel" style={{ opacity: saving ? 0.7 : 1, pointerEvents: saving ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
          <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {currentTab?.label} Page Access
          </p>
          <div className="perm-toggle-grid">
            {Object.entries(currentTab?.permMap ?? {}).map(([key, label]) => {
              const checked = activeTab === 'ADMIN' ? true : (activeRole.permissions?.[key] ?? false);
              const isEditable = activeTab === 'MEMBER';
              return (
                <div key={key} className={`perm-toggle-card${isEditable ? ' editable' : ''}`}>
                  <label className="toggle-row" style={{ cursor: isEditable ? 'pointer' : 'default' }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={!isEditable}
                      onChange={() => isEditable && handleToggle(key, checked)}
                    />
                    <span className={`toggle-track${checked ? ' checked' : ''}`} />
                    <span className="perm-toggle-label">{label}</span>
                  </label>
                </div>
              );
            })}
          </div>
          <small style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem', color: '#738093' }}>
            {saving ? 'Updating...' : <><Save size={13} /> {activeTab === 'MEMBER' ? 'Changes saved instantly' : 'Fixed permissions'}</>}
          </small>
        </div>
      ) : (
        <div className="empty">No permission data found for {activeTab}.</div>
      )}
    </section>
  );
}
