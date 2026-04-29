import { BarChart3, FolderKanban, KeyRound, ListTodo, LogOut, UserRound, UsersRound } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function Layout() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">TT</span>
          <div>
            <strong>Team Tasks</strong>
            <small>{user?.role}</small>
          </div>
        </div>
        <nav className="nav">
          {user?.permissions?.dashboard !== false && <NavLink to="/dashboard"><BarChart3 size={18} />Dashboard</NavLink>}
          {user?.permissions?.projects !== false && <NavLink to="/projects"><FolderKanban size={18} />Projects</NavLink>}
          {user?.permissions?.tasks !== false && <NavLink to="/tasks"><ListTodo size={18} />Tasks</NavLink>}
          {user?.permissions?.profile !== false && <NavLink to="/profile"><UserRound size={18} />Profile</NavLink>}
          {isAdmin && user?.permissions?.users !== false && <NavLink to="/users"><UsersRound size={18} />Users</NavLink>}
          {isAdmin && user?.permissions?.permissions !== false && <NavLink to="/permissions"><KeyRound size={18} />Permissions</NavLink>}
        </nav>
        <button className="ghost-button logout" onClick={logout}>
          <LogOut size={18} /> Logout
        </button>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <small>Signed in as</small>
            <strong>{user?.name}</strong>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
