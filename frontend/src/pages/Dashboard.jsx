import { AlertTriangle, CheckCircle2, Clock3, FolderKanban, ListTodo } from 'lucide-react';
import { api } from '../api/client.js';
import { EmptyState } from '../components/EmptyState.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../context/AuthContext.jsx';

export function Dashboard() {
  const { isAdmin } = useAuth();
  const { data, loading, error } = useApi(async () => (await api.get('/dashboard')).data, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="form-error">{error}</div>;

  const stats = data.stats;
  const cards = [
    ['Projects', stats.projectCount, FolderKanban],
    [isAdmin ? 'All tasks' : 'My tasks', stats.taskCount, ListTodo],
    ['In progress', stats.inProgressCount, Clock3],
    ['Done', stats.doneCount, CheckCircle2],
    ['Overdue', stats.overdueCount, AlertTriangle],
    ['Due today', stats.dueTodayCount, Clock3]
  ];

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Current workload, completion, and overdue pressure.</p>
        </div>
      </div>
      <div className="stats-grid">
        {cards.map(([label, value, Icon]) => (
          <article className="stat" key={label}>
            <Icon size={22} />
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
      <section className="panel">
        <h2>Overdue Tasks</h2>
        {!data.overdueTasks.length ? (
          <EmptyState title="No overdue tasks" text="Everything due before today is either done or not assigned yet." />
        ) : (
          <div className="table">
            {data.overdueTasks.map((task) => (
              <div className="table-row" key={task.id}>
                <div><strong>{task.title}</strong> {' '}<small>{task.projectName}</small></div>
                <span>{task.assigneeName || 'Unassigned'}</span>
                <span>{task.dueDate}</span>
                <StatusBadge value={task.status} />
              </div>
            ))}
          </div>
        )}
      </section>
      {isAdmin && Boolean(data.distribution?.length) && (
        <section className="panel panel-gap">
          <h2>Task Distribution</h2>
          <div className="table">
            {data.distribution.map((item) => (
              <div className="table-row" key={item.userId}>
                <div><strong>{item.name}</strong> {' '}<small>{item.email}</small></div>
                <span>{item.total} total</span>
                <span>{item.inProgress} active</span>
                <span>{item.done} done</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
