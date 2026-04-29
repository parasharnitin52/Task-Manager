import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormError } from '../components/FormError.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-copy">
          <CheckCircle2 size={32} />
          <h1>Team Task Manager</h1>
          <p>Plan projects, assign work, and keep overdue tasks visible across the team.</p>
        </div>
        <form className="auth-form" onSubmit={submit}>
          <h2>Log in</h2>
          <FormError error={error} />
          <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
          <button className="primary-button">Log in</button>
          <p>New here? <Link to="/signup">Create an account</Link></p>
        </form>
      </section>
    </main>
  );
}
