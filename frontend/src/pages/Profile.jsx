import { KeyRound, Save } from 'lucide-react';
import { useState } from 'react';
import { api } from '../api/client.js';
import { FormError } from '../components/FormError.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const saveProfile = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      const { data } = await api.patch('/users/me/profile', profile);
      updateUser(data.user);
      setMessage('Profile updated.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile');
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.patch('/users/me/password', passwords);
      setPasswords({ currentPassword: '', newPassword: '' });
      setMessage('Password changed.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not change password');
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>My Profile</h1>
          <p>Basic account information and password settings.</p>
        </div>
      </div>
      <FormError error={error} />
      {message && <div className="success-message">{message}</div>}
      <div className="detail-grid">
        <form className="panel stack-form" onSubmit={saveProfile}>
          <h2><Save size={18} /> Basic Information</h2>
          <label>Name<input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required /></label>
          <label>Email<input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} required /></label>
          <label>Role<input value={user?.role || ''} disabled /></label>
          <button className="primary-button"><Save size={18} /> Save profile</button>
        </form>
        <form className="panel stack-form" onSubmit={changePassword}>
          <h2><KeyRound size={18} /> Change Password</h2>
          <label>Current password<input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required /></label>
          <label>New password<input type="password" minLength="8" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required /></label>
          <button className="primary-button"><KeyRound size={18} /> Update password</button>
        </form>
      </div>
    </section>
  );
}
