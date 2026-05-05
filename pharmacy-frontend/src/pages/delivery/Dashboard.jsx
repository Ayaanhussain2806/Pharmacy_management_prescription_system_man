import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Truck, MapPin, Package, Key, CheckCircle, Loader2, User } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeOrders, setActiveOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  
  const [otpModal, setOtpModal] = useState({ show: false, orderId: null, otp: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const [activeRes, allRes] = await Promise.all([
        API.get('/delivery/orders/active'),
        API.get('/delivery/orders')
      ]);
      setActiveOrders(activeRes.data);
      setAllOrders(allRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePickup = async (id) => {
    try {
      setActionLoading(`pickup-${id}`);
      await API.put(`/delivery/orders/${id}/pickup`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeliver = async (e) => {
    e.preventDefault();
    if (!otpModal.otp) return;
    
    try {
      setActionLoading(`deliver-${otpModal.orderId}`);
      await API.put(`/delivery/orders/${otpModal.orderId}/deliver`, { otp: otpModal.otp });
      setOtpModal({ show: false, orderId: null, otp: '' });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid OTP or failed delivery');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>;

  const deliveredCount = allOrders.filter(o => o.status === 'DELIVERED').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Delivery Dashboard</h1>
          <p className="text-[var(--text-muted)] text-sm">Welcome back, {user?.name}</p>
        </div>
        <div className="flex gap-4">
          <div className="glass rounded-xl px-4 py-2 border border-[var(--border)] text-center">
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Active Deliveries</p>
            <p className="text-xl font-bold text-teal-400">{activeOrders.length}</p>
          </div>
          <div className="glass rounded-xl px-4 py-2 border border-[var(--border)] text-center">
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Total Delivered</p>
            <p className="text-xl font-bold text-emerald-400">{deliveredCount}</p>
          </div>
        </div>
      </div>

      {/* Active Deliveries */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-teal-400" /> Current Assignments
        </h2>

        {activeOrders.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center border border-[var(--border)]">
            <p className="text-[var(--text-muted)]">No active deliveries assigned right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeOrders.map(order => (
              <div key={order.id} className="glass rounded-xl border border-[var(--border)] overflow-hidden flex flex-col animate-fadeIn">
                <div className="p-5 border-b border-[var(--border)] flex justify-between items-start bg-[var(--bg-card)]">
                  <div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 inline-block ${
                      order.status === 'OUT_FOR_DELIVERY' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <h3 className="font-bold text-white">Order #{order.id}</h3>
                    <p className="text-xs text-[var(--text-muted)]">₹{order.totalAmount} • {order.items?.length || 0} items</p>
                  </div>
                </div>

                <div className="p-5 flex-1 space-y-4">
                  <div className="flex gap-3">
                    <User className="w-5 h-5 text-[var(--text-secondary)] shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">{order.customerName || `Customer ID: ${order.userId}`}</p>
                      {order.customerPhone && <p className="text-xs text-[var(--text-muted)]">{order.customerPhone}</p>}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 bg-[var(--bg-dark)] p-3 rounded-lg border border-[var(--border)]">
                    <MapPin className="w-5 h-5 text-teal-400 shrink-0" />
                    <p className="text-sm text-white">{order.deliveryAddress}</p>
                  </div>
                </div>

                <div className="p-5 border-t border-[var(--border)] bg-[var(--bg-card)] mt-auto">
                  {order.status === 'OUT_FOR_DELIVERY' ? (
                    <button
                      onClick={() => handlePickup(order.id)}
                      disabled={actionLoading === `pickup-${order.id}`}
                      className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-white transition-all disabled:opacity-50"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <><Package className="w-4 h-4" /> Mark Picked Up</>}
                    </button>
                  ) : (
                    <button
                      onClick={() => setOtpModal({ show: true, orderId: order.id, otp: '' })}
                      className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold bg-teal-500 hover:bg-teal-400 text-white transition-all shadow-lg shadow-teal-500/20"
                    >
                      <CheckCircle className="w-4 h-4" /> Deliver Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* OTP Modal */}
      {otpModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass rounded-2xl p-6 w-full max-w-sm border border-[var(--border)] shadow-2xl animate-slideIn">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto mb-3">
                <Key className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Verify Delivery</h3>
              <p className="text-sm text-[var(--text-muted)] mt-1">Ask the customer for their 6-digit OTP</p>
            </div>

            <form onSubmit={handleDeliver}>
              <div className="mb-6">
                <input
                  type="text"
                  maxLength="6"
                  required
                  value={otpModal.otp}
                  onChange={(e) => setOtpModal({...otpModal, otp: e.target.value.replace(/\D/g, '')})}
                  className="w-full px-4 py-3 bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl text-2xl tracking-[0.5em] text-center font-mono text-white focus:ring-2 focus:ring-teal-500/50 outline-none"
                  placeholder="000000"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOtpModal({ show: false, orderId: null, otp: '' })}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-dark)] border border-[var(--border)] hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={otpModal.otp.length !== 6 || actionLoading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-teal-500 hover:bg-teal-400 text-white transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
