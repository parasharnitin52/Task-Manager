import { Save, Trash2, UserCheck, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { FormError } from '../components/FormError.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useApi } from '../hooks/useApi.js';

export function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const projectApi = useApi(async () => (await api.get(`/projects/${id}`)).data, [id]);
  const usersApi = useApi(async () => (await api.get('/users?role=MEMBER')).data, []);
  const [member, setMember] = useState({ userId: '', role: 'MEMBER' });
  const [task, setTask] = useState({ title: '', description: '', assigneeIds: [], progress: 0, dueDate: '' });
  const [error, setError] = useState('');

  if (projectApi.loading) return <div className="loading">Loading project...</div>;
  if (projectApi.error) return <div className="form-error">{projectApi.error}</div>;

  const project = projectApi.data;
  const canManage = isAdmin;

  const addMember = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await api.post(`/projects/${id}/members`, member);
      setMember({ userId: '', role: 'MEMBER' });
      projectApi.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add member');
    }
  };

  const createTask = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await api.post('/tasks', {
        ...task,
        projectId: id,
        dueDate: task.dueDate || null
      });
      setTask({ title: '', description: '', assigneeIds: [], progress: 0, dueDate: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create task');
    }
  };

  const deleteProject = async () => {
    if (!confirm('Delete this project and all its tasks?')) return;
    await api.delete(`/projects/${id}`);
    navigate('/projects');
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>{project.name}</h1>
          <p>{project.description || 'No description yet.'}</p>
        </div>
        <StatusBadge value={project.status} />
      </div>
      <FormError error={error} />
      <div className="detail-grid">
        <section className="panel">
          <h2><UserCheck size={18} /> Project Members</h2>
          <div className="member-list">
            {project.members.map((item) => (
              <div className={`member-row ${item.id === user.id ? 'current-member' : ''}`} key={item.id}>
                <div><strong>{item.name}</strong><small>{item.email}</small></div>
                <StatusBadge value={item.role} />
              </div>
            ))}
          </div>
          {canManage && (
            <form className="inline-form" onSubmit={addMember}>
              <select value={member.userId} onChange={(e) => setMember({ ...member, userId: e.target.value })} required>
                <option value="">Select user</option>
                {usersApi.data?.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.email})</option>)}
              </select>
              <button className="icon-button" title="Add member"><UserPlus size={18} /></button>
            </form>
          )}
        </section>
        {canManage && (
          <section className="panel">
            <h2>Create Task</h2>
            <form className="stack-form" onSubmit={createTask}>
              <label>Title<input value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} required /></label>
              <label>Description<textarea value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })} /></label>
              <fieldset className="member-picker">
                <legend>Assign to members</legend>
                {project.assignableMembers.map((item) => (
                  <label className="check-row" key={item.id}>
                    <input
                      type="checkbox"
                      checked={task.assigneeIds.includes(item.id)}
                      onChange={(event) => {
                        const assigneeIds = event.target.checked
                          ? [...task.assigneeIds, item.id]
                          : task.assigneeIds.filter((memberId) => memberId !== item.id);
                        setTask({ ...task, assigneeIds });
                      }}
                    />
                    <span>{item.name}</span>
                    <small>{item.email}</small>
                  </label>
                ))}
              </fieldset>
              <label>Task percentage<input type="number" min="0" max="100" value={task.progress} onChange={(e) => setTask({ ...task, progress: Number(e.target.value) })} /></label>
              <label>Due date<input type="date" value={task.dueDate} onChange={(e) => setTask({ ...task, dueDate: e.target.value })} /></label>
              <button className="primary-button"><Save size={18} /> Save task</button>
            </form>
          </section>
        )}
      </div>
      {canManage && (
        <button className="danger-button" onClick={deleteProject}><Trash2 size={18} /> Delete project</button>
      )}
    </section>
  );
}
