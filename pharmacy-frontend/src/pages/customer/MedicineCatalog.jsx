import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Search, Filter, ShoppingCart, Info, Loader2, Pill } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MedicineCatalog() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [addingToCart, setAddingToCart] = useState(null);
  const [filter, setFilter] = useState('all'); // all, otc, prescription
  const { user } = useAuth();

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        fetchMedicines();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      let url = '/medicines';
      if (filter === 'otc') url = '/medicines/otc';
      const res = await API.get(url);
      setMedicines(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/medicines/search?q=${searchQuery}`);
      setMedicines(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (medicineId) => {
    try {
      setAddingToCart(medicineId);
      await API.post('/cart', { medicineId, quantity: 1 });
      // Toast notification would go here
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const filteredMedicines = medicines.filter(m => {
    if (filter === 'all') return true;
    if (filter === 'otc') return !m.prescriptionRequired;
    if (filter === 'prescription') return m.prescriptionRequired;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Medicine Catalog</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Browse our extensive collection of medicines</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl text-sm focus:ring-2 focus:ring-teal-500/50 outline-none"
            />
          </div>
          <div className="flex bg-[var(--bg-dark)] p-1 rounded-xl border border-[var(--border)]">
            {['all', 'otc', 'prescription'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  filter === f ? 'bg-teal-500 text-white shadow-lg' : 'text-[var(--text-muted)] hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
        </div>
      ) : filteredMedicines.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl border border-[var(--border)]">
          <Pill className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-white mb-1">No medicines found</h3>
          <p className="text-[var(--text-muted)] text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedicines.map((medicine) => (
            <div key={medicine.id} className="glass rounded-xl overflow-hidden border border-[var(--border)] hover:border-teal-500/30 transition-all group flex flex-col h-full animate-fadeIn">
              <div className="p-5 flex-1 relative">
                {medicine.prescriptionRequired && (
                  <span className="absolute top-4 right-4 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Rx Required</span>
                )}
                <div className="w-16 h-16 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Pill className="w-8 h-8 text-teal-400" />
                </div>
                <h3 className="font-semibold text-lg text-white leading-tight mb-1">{medicine.brandName}</h3>
                <p className="text-xs text-[var(--text-muted)] mb-3">{medicine.genericName} • {medicine.dosage}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs bg-white/5 px-2 py-1 rounded text-[var(--text-secondary)]">{medicine.category}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2" title={medicine.description}>
                  {medicine.description}
                </p>
              </div>
              
              <div className="p-5 border-t border-[var(--border)] bg-[var(--bg-card)] mt-auto">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-0.5">Price</p>
                    <p className="text-xl font-bold text-white">₹{medicine.price}</p>
                  </div>
                  {medicine.stock <= 10 && medicine.stock > 0 && (
                    <span className="text-xs text-amber-400 font-medium">Only {medicine.stock} left</span>
                  )}
                  {medicine.stock === 0 && (
                    <span className="text-xs text-red-400 font-medium">Out of stock</span>
                  )}
                </div>
                
                <button
                  onClick={() => addToCart(medicine.id)}
                  disabled={medicine.stock === 0 || addingToCart === medicine.id}
                  className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed 
                    bg-teal-500 hover:bg-teal-400 text-white shadow-lg shadow-teal-500/20"
                >
                  {addingToCart === medicine.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" /> 
                      {medicine.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
