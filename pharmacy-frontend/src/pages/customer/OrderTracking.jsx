import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/axios';
import { Package, Clock, CheckCircle, Truck, FileText, Loader2, ArrowLeft, Key } from 'lucide-react';

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>;
  }

  if (!order) {
    return <div className="text-center py-20 text-[var(--text-muted)]">Order not found</div>;
  }

  const steps = [
    { key: 'placed', label: 'Order Placed', icon: Package, done: true },
    { key: 'verified', label: 'Verified', icon: FileText, done: ['APPROVED', 'PROCESSING', 'OUT_FOR_DELIVERY', 'PICKED_UP', 'DELIVERED'].includes(order.status) },
    { key: 'processing', label: 'Processing', icon: Clock, done: ['PROCESSING', 'OUT_FOR_DELIVERY', 'PICKED_UP', 'DELIVERED'].includes(order.status) },
    { key: 'shipping', label: 'Out for Delivery', icon: Truck, done: ['OUT_FOR_DELIVERY', 'PICKED_UP', 'DELIVERED'].includes(order.status) },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle, done: order.status === 'DELIVERED' }
  ];

  if (order.status === 'REJECTED') {
    steps[1] = { key: 'rejected', label: 'Verification Failed', icon: FileText, done: true, failed: true };
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/customer/orders" className="inline-flex items-center text-sm text-[var(--text-muted)] hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Orders
      </Link>

      <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-[var(--border)] bg-[var(--bg-card)]">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Order #{order.id}</h1>
              <p className="text-sm text-[var(--text-muted)]">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            {order.otp && order.status !== 'DELIVERED' && order.status !== 'REJECTED' && (
              <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-3 text-center">
                <p className="text-xs text-teal-400 font-medium uppercase tracking-wide mb-1 flex items-center justify-center gap-1">
                  <Key className="w-3.5 h-3.5" /> Delivery OTP
                </p>
                <p className="text-2xl font-mono font-bold text-white tracking-widest">{order.otp}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tracker */}
        <div className="p-6 md:p-10 border-b border-[var(--border)]">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 md:left-[50%] top-0 bottom-0 md:top-6 md:bottom-auto md:w-full md:h-1 bg-[var(--border)] -translate-x-1/2 md:translate-x-0 rounded-full" />
            
            <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCurrent = step.done && (!steps[index + 1]?.done);
                
                let colorClass = 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-muted)]';
                if (step.failed) colorClass = 'bg-red-500/10 border-red-500 text-red-400';
                else if (isCurrent) colorClass = 'bg-teal-500 text-white border-teal-500 ring-4 ring-teal-500/20';
                else if (step.done) colorClass = 'bg-teal-500 text-white border-teal-500';

                return (
                  <div key={step.key} className="flex md:flex-col items-center gap-4 md:gap-3 z-10 w-full md:w-1/5">
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-500 ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="md:text-center">
                      <p className={`font-medium ${step.done ? 'text-white' : 'text-[var(--text-muted)]'}`}>{step.label}</p>
                      {step.failed && order.notes && (
                        <p className="text-xs text-red-400 mt-1">{order.notes}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-semibold text-white mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center">
                      <Pill className="w-5 h-5 text-[var(--text-muted)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.medicineName}</p>
                      <p className="text-xs text-[var(--text-muted)]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-white">₹{item.price}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-[var(--border)]">
              <div className="flex justify-between items-center text-lg font-bold text-white">
                <span>Total Amount</span>
                <span className="text-teal-400">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-[var(--bg-dark)]">
            <h3 className="text-lg font-semibold text-white mb-4">Delivery Details</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-[var(--text-muted)] mb-1">Delivery Address</p>
                <p className="text-white font-medium">{order.deliveryAddress}</p>
              </div>
              {order.customerName && (
                <div>
                  <p className="text-[var(--text-muted)] mb-1">Contact Name</p>
                  <p className="text-white font-medium">{order.customerName}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
