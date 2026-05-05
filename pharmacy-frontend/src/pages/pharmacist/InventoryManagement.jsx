import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Plus, Edit2, Trash2, Search, Loader2, Package } from 'lucide-react';

export default function InventoryManagement() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [currentMed, setCurrentMed] = useState(null);
  const [formData, setFormData] = useState({
    brandName: '', genericName: '', category: '', description: '',
    price: '', stock: '', symptoms: '', prescriptionRequired: false,
    manufacturer: '', dosage: ''
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await API.get('/admin/inventory');
      setMedicines(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (med) => {
    setCurrentMed(med);
    setFormData({
      ...med,
      price: med.price.toString(),
      stock: med.stock.toString()
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setCurrentMed(null);
    setFormData({
      brandName: '', genericName: '', category: '', description: '',
      price: '', stock: '', symptoms: '', prescriptionRequired: false,
      manufacturer: '', dosage: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentMed) {
        await API.put(`/admin/inventory/${currentMed.id}`, formData);
      } else {
        await API.post('/admin/inventory', formData);
      }
      setShowModal(false);
      fetchInventory();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save medicine');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await API.delete(`/admin/inventory/${id}`);
      fetchInventory();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const filteredMedicines = medicines.filter(m => 
    m.brandName.toLowerCase().includes(search.toLowerCase()) || 
    m.genericName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Inventory Management</h1>
          <p className="text-[var(--text-muted)] text-sm">{medicines.length} items in catalog</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl text-sm focus:ring-2 focus:ring-teal-500/50 outline-none text-white"
            />
          </div>
          <button onClick={handleAddNew} className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      <div className="glass rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[var(--text-secondary)]">
            <thead className="bg-[var(--bg-card)] text-white text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Medicine Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Price (₹)</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-center">Type</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredMedicines.map((med) => (
                <tr key={med.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[var(--bg-dark)] flex items-center justify-center border border-[var(--border)]">
                        <Package className="w-4 h-4 text-[var(--text-muted)]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{med.brandName}</p>
                        <p className="text-xs text-[var(--text-muted)]">{med.dosage}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{med.category}</td>
                  <td className="px-6 py-4 text-right text-teal-400 font-medium">{med.price}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                      med.stock === 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                      med.stock <= 10 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {med.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {med.prescriptionRequired ? (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Rx Req</span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-500/10 text-slate-400 border border-slate-500/20">OTC</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(med)} className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(med.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="glass rounded-2xl p-6 w-full max-w-2xl border border-[var(--border)] shadow-2xl my-8">
            <h2 className="text-xl font-bold text-white mb-6">
              {currentMed ? 'Edit Medicine' : 'Add New Medicine'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Brand Name *</label>
                  <input type="text" required value={formData.brandName} onChange={e => setFormData({...formData, brandName: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg text-sm text-white focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Generic Name</label>
                  <input type="text" value={formData.genericName} onChange={e => setFormData({...formData, genericName: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg text-sm text-white focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Category</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg text-sm text-white focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Dosage</label>
                  <input type="text" value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg text-sm text-white focus:ring-2 focus:ring-teal-500 outline-none" placeholder="e.g., 500mg tablet" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Price (₹) *</label>
                  <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg text-sm text-white focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Stock Quantity *</label>
                  <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg text-sm text-white focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg text-sm text-white focus:ring-2 focus:ring-teal-500 outline-none h-20 resize-none" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id="rx" checked={formData.prescriptionRequired} onChange={e => setFormData({...formData, prescriptionRequired: e.target.checked})}
                    className="w-4 h-4 accent-teal-500" />
                  <label htmlFor="rx" className="text-sm text-white">Prescription Required</label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border)]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-white hover:bg-white/5">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium bg-teal-500 hover:bg-teal-400 text-white">Save Medicine</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
