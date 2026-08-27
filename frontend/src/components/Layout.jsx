import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Receipt, PieChart, Tags, LogOut } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          e-Utilities
        </div>
        <nav className="nav-links">
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/expenses" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Receipt size={20} /> Expenses
          </NavLink>
          <NavLink to="/categories" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Tags size={20} /> Categories
          </NavLink>
          <NavLink to="/reports" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <PieChart size={20} /> Reports
          </NavLink>
        </nav>
        
        <div style={{ marginTop: 'auto' }}>
          <div className="nav-link" onClick={logout} style={{ cursor: 'pointer', color: 'var(--danger)' }}>
            <LogOut size={20} /> Logout
          </div>
        </div>
      </aside>
      
      <main className="main-content">
        <header className="page-header">
          <h2>Welcome back, {user.name}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user.name.charAt(0)}
            </div>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
