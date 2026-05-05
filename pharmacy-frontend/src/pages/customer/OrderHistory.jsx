import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { Package, Clock, ChevronRight, Loader2, MapPin } from 'lucide-react';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      VERIFICATION_PENDING: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
      APPROVED: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
      PROCESSING: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
      OUT_FOR_DELIVERY: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
      PICKED_UP: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
      DELIVERED: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
      REJECTED: 'text-red-400 bg-red-400/10 border-red-400/20',
    };
    return colors[status] || 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
          <Package className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Order History</h1>
          <p className="text-[var(--text-muted)] text-sm">Track and manage your recent orders</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-[var(--border)]">
          <Package className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold text-white mb-2">No orders found</h2>
          <p className="text-[var(--text-muted)] mb-6">You haven't placed any orders yet.</p>
          <Link to="/customer/medicines" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-medium transition-all">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link 
              key={order.id} 
              to={`/customer/orders/${order.id}`}
              className="block glass rounded-xl border border-[var(--border)] hover:border-teal-500/30 transition-all group overflow-hidden animate-fadeIn"
            >
              <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--bg-card)] border-b border-[var(--border)]">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg text-white">Order #{order.id}</h3>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-[var(--text-muted)] mb-0.5">Total Amount</p>
                    <p className="font-bold text-teal-400">₹{order.totalAmount}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-teal-500/10 group-hover:text-teal-400 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="p-5 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--text-muted)] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white mb-1">Delivery to</p>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{order.deliveryAddress}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
