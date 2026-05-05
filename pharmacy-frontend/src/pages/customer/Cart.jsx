import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Pill, Loader2, AlertCircle } from 'lucide-react';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState('');
  const [address, setAddress] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    fetchPrescriptions();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get('/cart');
      setCartItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const res = await API.get('/prescriptions');
      // Only approved prescriptions can be used for orders
      setPrescriptions(res.data.filter(p => p.status === 'APPROVED'));
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = async (id, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    
    try {
      await API.put(`/cart/${id}`, { quantity: newQty });
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeItem = async (id) => {
    try {
      await API.delete(`/cart/${id}`);
      setCartItems(items => items.filter(i => i.id !== id));
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    setError('');
    
    if (cartItems.length === 0) return;
    if (!address.trim()) {
      setError('Please enter a delivery address');
      return;
    }

    if (requiresPrescription && !selectedPrescription) {
      setError('A prescription is required for one or more items in your cart');
      return;
    }

    setProcessing(true);
    try {
      const orderReq = {
        deliveryType: 'DELIVERY',
        deliveryAddress: address,
        prescriptionId: selectedPrescription || null,
        // user details will be populated by backend based on token
      };

      await API.post('/orders', orderReq);
      navigate('/customer/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
      setProcessing(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const requiresPrescription = cartItems.some(item => item.prescriptionRequired);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-[var(--border)]">
          <div className="w-20 h-20 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-teal-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Your cart is empty</h2>
          <p className="text-[var(--text-muted)] mb-6">Looks like you haven't added any medicines yet.</p>
          <Link to="/customer/medicines" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-medium transition-all">
            Browse Medicines
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="glass rounded-xl p-4 sm:p-6 border border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 animate-fadeIn">
                <div className="w-16 h-16 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                  <Pill className="w-8 h-8 text-teal-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-white mb-1 truncate">{item.medicineName}</h3>
                  <div className="flex items-center gap-3">
                    <p className="text-teal-400 font-bold">₹{item.price}</p>
                    {item.prescriptionRequired && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        Rx Req
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0">
                  <div className="flex items-center gap-3 bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity, -1)}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity, 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="sm:ml-6 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="glass rounded-xl p-6 border border-[var(--border)] sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Delivery Fee</span>
                  <span>₹40.00</span>
                </div>
                <div className="border-t border-[var(--border)] pt-3 flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span className="text-teal-400">₹{(subtotal + 40).toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Delivery Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl text-white text-sm focus:ring-2 focus:ring-teal-500/50 outline-none resize-none h-24"
                    placeholder="Enter complete delivery address..."
                  />
                </div>

                {requiresPrescription && (
                  <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                    <label className="block text-sm font-medium text-indigo-300 mb-1.5">
                      Prescription Required
                    </label>
                    <p className="text-xs text-[var(--text-muted)] mb-3">
                      One or more items require a prescription. Please select an approved prescription.
                    </p>
                    {prescriptions.length === 0 ? (
                      <Link to="/customer/prescriptions" className="text-xs text-teal-400 hover:underline block">
                        + Upload new prescription
                      </Link>
                    ) : (
                      <select
                        value={selectedPrescription}
                        onChange={(e) => setSelectedPrescription(e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--bg-dark)] border border-indigo-500/30 rounded-lg text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                      >
                        <option value="">Select a prescription...</option>
                        {prescriptions.map(p => (
                          <option key={p.id} value={p.id}>{p.fileName} (Dr. {p.doctorName})</option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleCheckout}
                disabled={processing || (requiresPrescription && !selectedPrescription) || !address}
                className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-teal-500 hover:bg-teal-400 shadow-lg shadow-teal-500/20"
              >
                {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>Checkout <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
