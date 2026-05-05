import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import API from '../../api/axios';
import {
  LayoutDashboard, Pill, ShoppingCart, ClipboardList, Upload,
  Package, Users, Warehouse, Truck, Bell, LogOut, Menu, X,
  ChevronRight
} from 'lucide-react';

const navItems = {
  CUSTOMER: [
    { path: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/customer/medicines', label: 'Medicines', icon: Pill },
    { path: '/customer/cart', label: 'Cart', icon: ShoppingCart },
    { path: '/customer/orders', label: 'My Orders', icon: ClipboardList },
    { path: '/customer/prescriptions', label: 'Prescriptions', icon: Upload },
  ],
  PHARMACIST: [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/prescriptions', label: 'Prescriptions', icon: ClipboardList },
    { path: '/admin/orders', label: 'Orders', icon: Package },
    { path: '/admin/inventory', label: 'Inventory', icon: Warehouse },
  ],
  DELIVERY_AGENT: [
    { path: '/delivery/dashboard', label: 'Dashboard', icon: Truck },
  ],
};

export default function Layout({ role }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const items = navItems[role] || [];

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) { /* silent */ }
  };

  const markAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) { /* silent */ }
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-dark)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full glass border-r border-[var(--border)]">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-[var(--border)]">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">MedVault</h1>
              <p className="text-xs text-[var(--text-muted)]">Pharmacy System</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {items.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                      : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-teal-400' : 'text-[var(--text-muted)] group-hover:text-white'}`} />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-[var(--border)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-[var(--text-muted)] truncate">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
            <button onClick={logout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass border-b border-[var(--border)]">
          <div className="flex items-center justify-between px-4 lg:px-8 py-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-white/5">
              <Menu className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>

            <div className="flex-1" />

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto glass rounded-xl shadow-2xl border border-[var(--border)] animate-fadeIn">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-teal-400 hover:text-teal-300">Mark all read</button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-sm text-[var(--text-muted)] text-center">No notifications</p>
                  ) : (
                    notifications.slice(0, 10).map(n => (
                      <div key={n.id} className={`px-4 py-3 border-b border-[var(--border)] last:border-0 ${!n.read ? 'bg-teal-500/5' : ''}`}>
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 gradient-mesh">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
