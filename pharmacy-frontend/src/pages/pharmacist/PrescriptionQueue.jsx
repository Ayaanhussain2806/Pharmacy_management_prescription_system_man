import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { CheckCircle, XCircle, FileText, Loader2, RefreshCw } from 'lucide-react';

export default function PrescriptionQueue() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);

  useEffect(() => {
    fetchPendingPrescriptions();
  }, []);

  const fetchPendingPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/prescriptions/pending');
      setPrescriptions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await API.put(`/admin/prescriptions/${id}/approve`);
      setPrescriptions(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectReason) return;
    
    try {
      setActionLoading(showRejectModal);
      await API.put(`/admin/prescriptions/${showRejectModal}/reject`, { reason: rejectReason });
      setPrescriptions(prev => prev.filter(p => p.id !== showRejectModal));
      setShowRejectModal(null);
      setRejectReason('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  const handleOcr = async (id) => {
      try {
          setActionLoading(`ocr-${id}`);
          const res = await API.post(`/prescriptions/${id}/ocr`);
          const text = res.data.data.extractedText;
          setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, extractedText: text } : p));
      } catch (err) {
          alert('OCR failed');
      } finally {
          setActionLoading(null);
      }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Prescription Queue</h1>
          <p className="text-[var(--text-muted)] text-sm">{prescriptions.length} pending verifications</p>
        </div>
        <button onClick={fetchPendingPrescriptions} className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] hover:bg-white/5 text-[var(--text-secondary)]">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {prescriptions.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-[var(--border)]">
          <CheckCircle className="w-16 h-16 text-emerald-500/50 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">All caught up!</h2>
          <p className="text-[var(--text-muted)]">There are no pending prescriptions to review.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {prescriptions.map((rx) => (
            <div key={rx.id} className="glass rounded-xl border border-[var(--border)] overflow-hidden animate-fadeIn">
              <div className="p-4 sm:p-6 flex flex-col md:flex-row gap-6">
                {/* File Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{rx.fileName}</h3>
                      <p className="text-xs text-[var(--text-muted)]">Uploaded: {new Date(rx.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-[var(--bg-dark)] p-3 rounded-lg border border-[var(--border)]">
                      <p className="text-xs text-[var(--text-muted)] mb-1">Patient Name</p>
                      <p className="text-sm text-white font-medium">{rx.patientName || 'Not provided'}</p>
                    </div>
                    <div className="bg-[var(--bg-dark)] p-3 rounded-lg border border-[var(--border)]">
                      <p className="text-xs text-[var(--text-muted)] mb-1">Doctor Name</p>
                      <p className="text-sm text-white font-medium">{rx.doctorName ? `Dr. ${rx.doctorName}` : 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="bg-[var(--bg-dark)] p-3 rounded-lg border border-[var(--border)]">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-[var(--text-muted)]">Extracted Text (OCR)</p>
                        <button 
                          onClick={() => handleOcr(rx.id)}
                          disabled={actionLoading === `ocr-${rx.id}`}
                          className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded hover:bg-indigo-500/30 transition flex items-center gap-1"
                        >
                          {actionLoading === `ocr-${rx.id}` ? <Loader2 className="w-3 h-3 animate-spin"/> : null}
                          Run AI Scan
                        </button>
                      </div>
                      <p className="text-sm text-white font-mono whitespace-pre-wrap">
                          {rx.extractedText || 'No text extracted yet. Run AI scan.'}
                      </p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="w-full md:w-64 flex flex-col justify-center gap-3 shrink-0 border-t md:border-t-0 md:border-l border-[var(--border)] pt-4 md:pt-0 md:pl-6">
                  <a 
                    href={`/uploads/${rx.filePath.split('/').pop()}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold bg-[var(--bg-dark)] border border-[var(--border)] text-white hover:bg-white/5 transition-all"
                  >
                    View Document
                  </a>
                  
                  <button
                    onClick={() => handleApprove(rx.id)}
                    disabled={actionLoading === rx.id}
                    className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                  >
                    {actionLoading === rx.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Approve</>}
                  </button>
                  
                  <button
                    onClick={() => setShowRejectModal(rx.id)}
                    disabled={actionLoading === rx.id}
                    className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass rounded-2xl p-6 w-full max-w-md border border-[var(--border)] shadow-2xl animate-slideIn">
            <h3 className="text-lg font-bold text-white mb-4">Reject Prescription</h3>
            <form onSubmit={handleReject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Reason for rejection</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-dark)] border border-[var(--border)] rounded-xl text-white text-sm focus:ring-2 focus:ring-red-500/50 outline-none resize-none h-24"
                  placeholder="e.g., Image is blurry, missing doctor signature..."
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(null)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === showRejectModal}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-400 text-white transition-colors flex items-center gap-2"
                >
                  {actionLoading === showRejectModal ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
