import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { EmptyState } from '../components/EmptyState.jsx';
import { FormError } from '../components/FormError.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useApi } from '../hooks/useApi.js';

const statuses = ['TODO', 'IN_PROGRESS', 'DONE'];

export function Tasks() {
  const { isAdmin } = useAuth();
  const { data: tasks, loading, error, reload } = useApi(async () => (await api.get('/tasks')).data, []);
  const projectsApi = useApi(async () => (await api.get('/projects')).data, []);
  const [selectedProject, setSelectedProject] = useState(null);
  const [task, setTask] = useState({ projectId: '', title: '', description: '', assigneeIds: [], progress: 0, dueDate: '' });
  const [taskError, setTaskError] = useState('');
  const [comments, setComments] = useState({});
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    const loadProject = async () => {
      if (!task.projectId) {
        setSelectedProject(null);
        return;
      }
      const { data } = await api.get(`/projects/${task.projectId}`);
      setSelectedProject(data);
    };

    loadProject();
  }, [task.projectId]);

  const projectMembers = useMemo(() => selectedProject?.assignableMembers ?? [], [selectedProject]);
  const completionPercent = selectedProject?.taskCount
    ? Math.round((selectedProject.doneCount / selectedProject.taskCount) * 100)
    : 0;

  const createTask = async (event) => {
    event.preventDefault();
    setTaskError('');
    try {
      await api.post('/tasks', {
        ...task,
        dueDate: task.dueDate || null
      });
      setTask({ projectId: '', title: '', description: '', assigneeIds: [], progress: 0, dueDate: '' });
      setSelectedProject(null);
      reload();
    } catch (err) {
      setTaskError(err.response?.data?.message || 'Could not create task');
    }
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/tasks/${id}`, { status });
    reload();
  };

  const updateProgress = async (id, progress) => {
    await api.patch(`/tasks/${id}`, { progress });
    reload();
  };

  const loadComments = async (id) => {
    const { data } = await api.get(`/tasks/${id}/comments`);
    setComments((current) => ({ ...current, [id]: data }));
  };

  const addComment = async (event, id) => {
    event.preventDefault();
    const body = drafts[id];
    if (!body?.trim()) return;
    await api.post(`/tasks/${id}/comments`, { body });
    setDrafts((current) => ({ ...current, [id]: '' }));
    loadComments(id);
  };

  return (
    <section className={`page ${isAdmin ? 'split-page' : ''}`}>
      <div>
        <div className="page-heading">
          <div>
            <h1>Tasks</h1>
          </div>
        </div>
        {loading && <div className="loading">Loading tasks...</div>}
        {error && <div className="form-error">{error}</div>}
        {!loading && !tasks?.length && <EmptyState title="No tasks found" text="Tasks will appear here when they are assigned." />}
        <div className="task-board">
          {statuses.map((status) => (
            <section className="task-column" key={status}>
              <h2>{status.replace('_', ' ')}</h2>
              {tasks?.filter((item) => item.status === status).map((item) => (
                <article className="task-card" key={item.id}>
                  <div className="task-card-head">
                    <strong>{item.title}</strong>
                    <StatusBadge value={item.status} />
                  </div>
                  <p>{item.description || 'No description.'}</p>
                  <small>{item.projectName} - {item.assigneeName || 'No assignees'}</small>
                  <div className="task-progress">
                    <div><strong>{item.progress ?? 0}% task complete</strong></div>
                    <div className="progress"><span style={{ width: `${item.progress ?? 0}%` }} /></div>
                  </div>
                  <div className="task-footer">
                    <span>{item.dueDate || 'No due date'}</span>
                    <select value={item.status} onChange={(event) => updateStatus(item.id, event.target.value)}>
                      {statuses.map((statusItem) => <option key={statusItem}>{statusItem}</option>)}
                    </select>
                  </div>
                  <label className="compact-slider">
                    Task %
                    <input type="range" min="0" max="100" value={item.progress ?? 0} onChange={(event) => updateProgress(item.id, Number(event.target.value))} />
                  </label>
                  <details onToggle={(event) => event.currentTarget.open && !comments[item.id] && loadComments(item.id)}>
                    <summary>Comments</summary>
                    <div className="comment-list">
                      {comments[item.id]?.map((comment) => (
                        <p key={comment.id}><strong>{comment.author?.name || 'User'}:</strong> {comment.body}</p>
                      ))}
                    </div>
                    <form className="inline-form" onSubmit={(event) => addComment(event, item.id)}>
                      <input value={drafts[item.id] || ''} onChange={(event) => setDrafts({ ...drafts, [item.id]: event.target.value })} placeholder="Add a comment" />
                      <button className="primary-button">Add</button>
                    </form>
                  </details>
                </article>
              ))}
            </section>
          ))}
        </div>
      </div>
      {
        isAdmin && (
          <form className="side-form" onSubmit={createTask}>
            <h2><Plus size={20} /> Create Task</h2>
            <FormError error={taskError} />
            <label>Project<select value={task.projectId} onChange={(event) => setTask({ ...task, projectId: event.target.value, assigneeIds: [] })} required>
              <option value="">Select project</option>
              {projectsApi.data?.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select></label>
            {selectedProject && (
              <div className="project-completion">
                <div>
                  <strong>{completionPercent}% complete</strong>
                  <small>{selectedProject.doneCount} of {selectedProject.taskCount} tasks done</small>
                </div>
                <div className="progress">
                  <span style={{ width: `${completionPercent}%` }} />
                </div>
              </div>
            )}
            <fieldset className="member-picker" disabled={!task.projectId}>
              <legend>Assign to project members</legend>
              {!task.projectId && <small>Select a project first.</small>}
              {task.projectId && !projectMembers.length && <small>No non-admin members are assigned to this project yet.</small>}
              {projectMembers.map((member) => (
                <label className="check-row" key={member.id}>
                  <input
                    type="checkbox"
                    checked={task.assigneeIds.includes(member.id)}
                    onChange={(event) => {
                      const assigneeIds = event.target.checked
                        ? [...task.assigneeIds, member.id]
                        : task.assigneeIds.filter((id) => id !== member.id);
                      setTask({ ...task, assigneeIds });
                    }}
                  />
                  <span>{member.name}</span>
                  <small>{member.email}</small>
                </label>
              ))}
            </fieldset>
            <label>Title<input value={task.title} onChange={(event) => setTask({ ...task, title: event.target.value })} required /></label>
            <label>Description<textarea value={task.description} onChange={(event) => setTask({ ...task, description: event.target.value })} /></label>
            <label>Due date<input type="date" value={task.dueDate} onChange={(event) => setTask({ ...task, dueDate: event.target.value })} /></label>
            <button className="primary-button"><Plus size={18} /> Create task</button>
          </form>
        )
      }
    </section >
  );
}
