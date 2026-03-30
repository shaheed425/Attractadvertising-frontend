import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { motion } from 'framer-motion';
import { Plus, Trash2, Upload, X } from 'lucide-react';

export default function LogoManager() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    clientName: '',
    logoUrl: ''
  });

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/logos`);
      console.log('Logo Data Fetched:', data);
      setItems(data);
    } catch (err) {
      console.error('Error fetching logos:', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    const uploadData = new FormData();
    uploadData.append('media', file);

    try {
      setLoading(true);
      const { data } = await axios.post(`${API_URL}/api/upload`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, logoUrl: data }));
    } catch (err) {
      console.error('Logo Upload Error:', err);
      alert(err.response?.data?.message || err.message || 'Logo Upload Failed. Check file type/size.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Onboarding Partner with Payload:', formData);

    if (!formData.logoUrl || formData.logoUrl.trim() === '') {
      alert('CRITICAL: Logo URL is missing. Please re-upload the partner logo.');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/logos`, formData, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });
      setShowForm(false);
      setImagePreview(null);
      setFormData({ clientName: '', logoUrl: '' });
      fetchItems();
    } catch (err) {
      console.error('Logo Submit Error:', err);
      alert(err.response?.data?.message || 'Error deploying logo');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Remove this partner logo?')) {
      await axios.delete(`${API_URL}/api/logos/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchItems();
    }
  };

  return (
    <div className="p-8 relative min-h-screen bg-black">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      
      <div className="flex justify-between items-center mb-12 relative z-10">
        <div>
          <h1 className="text-4xl font-display font-black text-white mb-2 uppercase tracking-tight">Partner Network</h1>
          <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-1">Manage high-profile client logos for the main marquee.</p>
        </div>
        <button 
          onClick={() => { setShowForm(true); setImagePreview(null); }}
          className="flex items-center gap-3 bg-[#5B49AD] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.05] active:scale-[0.95] transition-all shadow-[0_0_30px_rgba(91,73,173,0.3)]"
        >
          <Plus size={20} strokeWidth={3} /> Add Partner
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            data-lenis-prevent 
            className="bg-black border border-white/10 p-12 rounded-[3.5rem] w-full max-w-lg relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <button onClick={() => setShowForm(false)} className="absolute right-10 top-10 text-white/20 hover:text-white transition-colors"><X size={32} /></button>
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-display font-black text-white tracking-tight uppercase">Onboard Partner</h2>
              <div className="h-1 w-12 bg-white mx-auto mt-4 rounded-full opacity-30" />
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white opacity-40 ml-2">Client Identification</label>
                <input 
                  type="text" placeholder="Corporate Entity Name" required 
                  value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-white outline-none placeholder:text-white/10 font-bold shadow-sm"
                />
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white opacity-40 ml-2">Logo Asset</label>
                {(imagePreview || formData.logoUrl) && (
                  <div className="w-full h-40 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 p-8 shadow-inner overflow-hidden">
                    <img src={imagePreview || (formData.logoUrl?.startsWith('http') ? formData.logoUrl : `${API_URL}${formData.logoUrl}`)} className="max-w-full max-h-full object-contain grayscale opacity-60 invert" alt="Preview" />
                  </div>
                )}
                
                <div className="border-2 border-dashed border-white/10 bg-white/5 rounded-[2rem] p-10 flex flex-col items-center gap-4 hover:border-white/50 transition-all cursor-pointer group relative">
                   {loading ? (
                    <div className="flex items-center gap-4 text-white font-black text-xs uppercase tracking-widest">
                      <div className="w-5 h-5 border-3 border-current border-t-transparent rounded-full animate-spin" />
                      Syncing...
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-sm group-hover:scale-110 transition-transform">
                        <Upload size={24} className="text-white/20 group-hover:text-white transition-colors" />
                      </div>
                      <label className="cursor-pointer text-center">
                        <span className="text-sm font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Select SVG/PNG</span>
                        <p className="text-[10px] font-bold text-white/20 mt-1">High-Res Assets Preferred</p>
                        <input type="file" onChange={handleFileChange} className="hidden" />
                      </label>
                    </>
                  )}
                </div>
              </div>

              <button type="submit" disabled={loading} className="py-6 bg-[#5B49AD] text-white font-black uppercase tracking-widest rounded-2xl hover:shadow-[0_0_50px_rgba(91,73,173,0.4)] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 shadow-[0_0_30px_rgba(91,73,173,0.3)]">
                Confirm Deployment
              </button>
            </form>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 relative z-10">
        {items.map(item => (
          <div key={item._id} className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center gap-8 group relative hover:shadow-2xl transition-all duration-700">
            <button 
              onClick={() => handleDelete(item._id)}
              className="absolute top-6 right-6 p-3 bg-red-500/10 text-red-500 rounded-xl opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-lg"
              title="Remove Partner"
            >
              <Trash2 size={18} />
            </button>
            <div className="w-28 h-28 flex items-center justify-center p-2">
              <img src={item.logoUrl?.startsWith('http') ? item.logoUrl : `${API_URL}${item.logoUrl}`} alt={item.clientName} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-1000 opacity-40 group-hover:opacity-100 scale-90 group-hover:scale-110 invert" />
            </div>
            <div className="w-full pt-6 border-t border-white/10">
              <p className="text-white opacity-40 text-[10px] uppercase font-black tracking-[0.3em] text-center leading-none">{item.clientName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
