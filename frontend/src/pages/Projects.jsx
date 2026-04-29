import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { EmptyState } from '../components/EmptyState.jsx';
import { FormError } from '../components/FormError.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../context/AuthContext.jsx';

export function Projects() {
  const { isAdmin } = useAuth();
  const { data: projects, loading, error, reload } = useApi(async () => (await api.get('/projects')).data, []);
  const [form, setForm] = useState({ name: '', description: '', dueDate: '' });
  const [formError, setFormError] = useState('');

  const createProject = async (event) => {
    event.preventDefault();
    setFormError('');
    try {
      await api.post('/projects', { ...form, dueDate: form.dueDate || null });
      setForm({ name: '', description: '', dueDate: '' });
      reload();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not create project');
    }
  };

  return (
    <section className={`page ${isAdmin ? 'split-page' : ''}`}>
      <div>
        <div className="page-heading">
          <div>
            <h1>Projects</h1>
            <p>Create team spaces and track completion by task status.</p>
          </div>
        </div>
        {loading && <div className="loading">Loading projects...</div>}
        {error && <div className="form-error">{error}</div>}
        {!loading && !projects?.length && <EmptyState title="No projects yet" text="Create the first project to start assigning tasks." />}
        <div className="project-list">
          {projects?.map((project) => (
            <Link className="project-item" to={`/projects/${project.id}`} key={project.id}>
              <div>
                <strong>{project.name}</strong>
                <small>{project.ownerName} · {project.taskCount} tasks</small>
              </div>
              <div className="progress">
                <span style={{ width: `${project.taskCount ? (project.doneCount / project.taskCount) * 100 : 0}%` }} />
              </div>
              <StatusBadge value={project.status} />
            </Link>
          ))}
        </div>
      </div>
      {isAdmin && (
        <form className="side-form" onSubmit={createProject}>
          <h2><Plus size={20} /> New Project</h2>
          <FormError error={formError} />
          <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
          <label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <label>Due date<input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></label>
          <button className="primary-button">Create project</button>
        </form>
      )}
    </section>
  );
}
