import { UsersRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormError } from '../components/FormError.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-copy teal">
          <UsersRound size={32} />
          <h1>Create admin access</h1>
          <p>Public registration creates an Admin account. Team members are added later from the Users page.</p>
        </div>
        <form className="auth-form" onSubmit={submit}>
          <h2>Sign up</h2>
          <FormError error={error} />
          <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
          <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label>Password<input type="password" minLength="8" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
          <button className="primary-button">Create account</button>
          <p>Already have an account? <Link to="/login">Log in</Link></p>
        </form>
      </section>
    </main>
  );
}
