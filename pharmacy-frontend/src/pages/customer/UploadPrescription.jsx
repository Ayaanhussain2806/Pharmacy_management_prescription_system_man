import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Upload, FileText, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

export default function UploadPrescription() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({ doctorName: '', patientName: '' });

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await API.get('/prescriptions');
      setPrescriptions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    if (formData.doctorName) data.append('doctorName', formData.doctorName);
    if (formData.patientName) data.append('patientName', formData.patientName);

    try {
      await API.post('/prescriptions/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFile(null);
      setFormData({ doctorName: '', patientName: '' });
      fetchPrescriptions();
      // Toast notification would go here
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload');
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'APPROVED': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'REJECTED': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Upload Form */}
      <div className="lg:col-span-1">
        <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden sticky top-24">
          <div className="p-6 border-b border-[var(--border)] bg-[var(--bg-card)]">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-teal-400" /> New Prescription
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">Upload image or PDF</p>
          </div>
          
          <form onSubmit={handleUpload} className="p-6 space-y-4">
            <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center hover:border-teal-500/50 hover:bg-teal-500/5 transition-all cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*,.pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              <div className="w-12 h-12 rounded-full bg-[var(--bg-card)] flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6 text-[var(--text-secondary)]" />
              </div>
              <p className="text-sm font-medium text-white mb-1">
                {file ? file.name : 'Click or drag file here'}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Max file size: 10MB
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Doctor's Name (Optional)</label>
              <input
                type="text"
                value={formData.doctorName}
                onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                className="w-full px-4 py-2.5 bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl text-sm text-white focus:ring-2 focus:ring-teal-500/50 outline-none"
                placeholder="Dr. John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Patient's Name (Optional)</label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                className="w-full px-4 py-2.5 bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl text-sm text-white focus:ring-2 focus:ring-teal-500/50 outline-none"
                placeholder="Your Name"
              />
            </div>

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full py-3 mt-2 rounded-xl flex items-center justify-center gap-2 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-teal-500 hover:bg-teal-400 shadow-lg shadow-teal-500/20"
            >
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Upload & Submit'}
            </button>
          </form>
        </div>
      </div>

      {/* Prescription List */}
      <div className="lg:col-span-2">
        <h2 className="text-xl font-bold text-white mb-6">Your Prescriptions</h2>
        
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>
        ) : prescriptions.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center border border-[var(--border)]">
            <FileText className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-1">No prescriptions found</h3>
            <p className="text-[var(--text-muted)] text-sm">Upload a prescription to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((rx) => (
              <div key={rx.id} className="glass rounded-xl p-5 border border-[var(--border)] flex flex-col sm:flex-row gap-4 sm:items-center justify-between animate-fadeIn">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--bg-dark)] flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{rx.fileName}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
                      <span>Uploaded: {new Date(rx.createdAt).toLocaleDateString()}</span>
                      {rx.doctorName && <span>Dr. {rx.doctorName}</span>}
                    </div>
                    {rx.status === 'REJECTED' && rx.rejectionReason && (
                      <p className="text-xs text-red-400 mt-2 bg-red-500/10 p-2 rounded">Reason: {rx.rejectionReason}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-dark)] border border-[var(--border)] self-start sm:self-auto">
                  {getStatusIcon(rx.status)}
                  <span className={`text-sm font-medium ${
                    rx.status === 'APPROVED' ? 'text-emerald-400' : 
                    rx.status === 'REJECTED' ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {rx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
