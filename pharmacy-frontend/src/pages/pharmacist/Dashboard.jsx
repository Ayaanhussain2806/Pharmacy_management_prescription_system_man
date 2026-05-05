import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Activity, ClipboardList, Package, Users, AlertTriangle, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/admin/dashboard');
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Pharmacist Dashboard</h1>
        <p className="text-[var(--text-muted)] text-sm">Overview of pharmacy operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Pending Prescriptions" 
          value={stats?.pendingPrescriptions} 
          icon={ClipboardList} 
          color="indigo" 
          link="/admin/prescriptions"
        />
        <StatCard 
          title="Total Orders" 
          value={stats?.totalOrders} 
          icon={Package} 
          color="teal" 
          link="/admin/orders"
        />
        <StatCard 
          title="Low Stock Items" 
          value={stats?.lowStockMedicines} 
          icon={AlertTriangle} 
          color="amber" 
          link="/admin/inventory"
        />
        <StatCard 
          title="Delivery Agents" 
          value={stats?.deliveryAgents} 
          icon={Users} 
          color="blue" 
          link="#"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
             <div className="p-6 border-b border-[var(--border)] bg-[var(--bg-card)]">
               <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
             </div>
             <div className="p-6 grid grid-cols-2 gap-4">
                 <Link to="/admin/prescriptions" className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors text-center group">
                    <ClipboardList className="w-8 h-8 text-indigo-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-white">Review Rx</span>
                 </Link>
                 <Link to="/admin/orders" className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 transition-colors text-center group">
                    <Package className="w-8 h-8 text-teal-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-white">Manage Orders</span>
                 </Link>
                 <Link to="/admin/inventory" className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors text-center group col-span-2">
                    <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-white">Restock Inventory</span>
                 </Link>
             </div>
          </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, link }) {
  const colors = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    teal: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <Link to={link} className="glass rounded-2xl p-6 border border-[var(--border)] hover:border-[var(--text-secondary)] transition-all group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[var(--text-muted)] text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value || 0}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colors[color]} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Link>
  );
}
