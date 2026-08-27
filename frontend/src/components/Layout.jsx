import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Receipt, 
  Tags, 
  LogOut,
  Menu
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Expenses', path: '/expenses', icon: <Receipt size={20} /> },
    { name: 'Categories', path: '/categories', icon: <Tags size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-800 text-white shadow-xl">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            e-Utilities
          </h1>
          <p className="text-sm text-slate-400 mt-1">Cost Tracker</p>
        </div>
        
        <div className="p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-4">Welcome, {user?.name}</p>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                              (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="mt-auto p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 w-full rounded-lg text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Mobile */}
        <header className="md:hidden bg-slate-800 text-white p-4 flex justify-between items-center shadow-md z-10">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            e-Utilities
          </h1>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu size={24} />
          </button>
        </header>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-800 text-white absolute top-16 left-0 right-0 z-20 shadow-xl border-t border-slate-700">
             <nav className="flex flex-col p-4 space-y-2">
               <div className="pb-2 mb-2 border-b border-slate-700">
                 <p className="text-sm text-slate-300">Signed in as <span className="font-semibold">{user?.name}</span></p>
               </div>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center space-x-3 p-3 text-red-400 hover:bg-slate-700 rounded-lg text-left"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}

        {/* Main scrollable area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
