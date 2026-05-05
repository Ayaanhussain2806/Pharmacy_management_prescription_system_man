import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Package, User, MapPin, Truck, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, agentsRes] = await Promise.all([
        API.get('/admin/orders'),
        API.get('/admin/delivery-agents')
      ]);
      setOrders(ordersRes.data);
      setAgents(agentsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoading(`approve-${id}`);
      const res = await API.put(`/admin/orders/${id}/approve`);
      setOrders(orders.map(o => o.id === id ? res.data.data : o));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAssignAgent = async (orderId, agentId) => {
    if (!agentId) return;
    try {
      setActionLoading(`assign-${orderId}`);
      const res = await API.post(`/admin/orders/${orderId}/assign-agent`, { agentId: parseInt(agentId) });
      setOrders(orders.map(o => o.id === orderId ? res.data.data : o));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign agent');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Order Management</h1>
        <p className="text-[var(--text-muted)] text-sm">Process orders and assign deliveries</p>
      </div>

      <div className="glass rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[var(--text-secondary)]">
            <thead className="bg-[var(--bg-card)] text-white text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Delivery</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">#{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-white">{order.customerName || `User ID: ${order.userId}`}</span>
                      <span className="text-xs mt-0.5 truncate max-w-[200px]" title={order.deliveryAddress}>{order.deliveryAddress}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-teal-400 font-medium">₹{order.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider status-${order.status.toLowerCase()}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {order.status === 'PROCESSING' || order.status === 'APPROVED' ? (
                      <select
                        onChange={(e) => handleAssignAgent(order.id, e.target.value)}
                        value={order.agentId || ''}
                        disabled={actionLoading === `assign-${order.id}`}
                        className="w-full min-w-[140px] px-3 py-1.5 bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg text-xs text-white focus:ring-2 focus:ring-teal-500 outline-none"
                      >
                        <option value="">Assign Agent...</option>
                        {agents.map(a => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                    ) : order.agentId ? (
                      <span className="flex items-center gap-1 text-xs text-white bg-[var(--bg-dark)] px-3 py-1.5 rounded-lg border border-[var(--border)]">
                        <Truck className="w-3.5 h-3.5 text-purple-400" />
                        {agents.find(a => a.id === order.agentId)?.name || `Agent #${order.agentId}`}
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)]">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {order.status === 'VERIFICATION_PENDING' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(order.id)}
                          disabled={actionLoading === `approve-${order.id}`}
                          className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-md transition-colors"
                          title="Approve Order"
                        >
                          {actionLoading === `approve-${order.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-[var(--text-muted)]">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
