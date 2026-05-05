import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import { Package, Activity, Clock, FileText, ChevronRight, ShoppingBag } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, prescriptionsRes] = await Promise.all([
          API.get('/orders'),
          API.get('/prescriptions')
        ]);
        setOrders(ordersRes.data.slice(0, 3)); // Latest 3 orders
        setPrescriptions(prescriptionsRes.data.slice(0, 3)); // Latest 3 prescriptions
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="glass rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
        <h1 className="text-2xl font-bold text-white mb-2 relative z-10">Welcome back, {user?.name}! 👋</h1>
        <p className="text-[var(--text-secondary)] relative z-10">Here's an overview of your health journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass rounded-xl p-6 border border-[var(--border)] hover:border-teal-500/30 transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-teal-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Browse Pharmacy</h3>
              <p className="text-sm text-[var(--text-muted)]">Order medicines & health products</p>
            </div>
          </div>
          <Link to="/customer/medicines" className="flex items-center text-teal-400 text-sm font-medium hover:text-teal-300">
            Shop now <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="glass rounded-xl p-6 border border-[var(--border)] hover:border-indigo-500/30 transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Upload Prescription</h3>
              <p className="text-sm text-[var(--text-muted)]">Get expert pharmacist review</p>
            </div>
          </div>
          <Link to="/customer/prescriptions" className="flex items-center text-indigo-400 text-sm font-medium hover:text-indigo-300">
            Upload now <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="glass rounded-xl p-6 border border-[var(--border)] hover:border-amber-500/30 transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Track Orders</h3>
              <p className="text-sm text-[var(--text-muted)]">View real-time delivery status</p>
            </div>
          </div>
          <Link to="/customer/orders" className="flex items-center text-amber-400 text-sm font-medium hover:text-amber-300">
            View history <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="glass rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="p-5 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-card)]">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-teal-400" /> Recent Orders
            </h2>
            <Link to="/customer/orders" className="text-sm text-teal-400 hover:underline">View All</Link>
          </div>
          <div className="p-5">
            {orders.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] text-center py-4">No recent orders found.</p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div>
                      <p className="font-medium text-white">Order #{order.id}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">₹{order.totalAmount} • {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider status-${order.status.toLowerCase()}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="glass rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="p-5 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-card)]">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" /> Recent Prescriptions
            </h2>
            <Link to="/customer/prescriptions" className="text-sm text-teal-400 hover:underline">View All</Link>
          </div>
          <div className="p-5">
            {prescriptions.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] text-center py-4">No recent prescriptions found.</p>
            ) : (
              <div className="space-y-4">
                {prescriptions.map(rx => (
                  <div key={rx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm max-w-[150px] truncate">{rx.fileName}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">Dr. {rx.doctorName || 'Unknown'}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider status-${rx.status.toLowerCase()}`}>
                      {rx.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
