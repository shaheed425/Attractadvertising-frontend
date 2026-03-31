import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Upload } from 'lucide-react';

export default function TeamManager() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    imageUrl: ''
  });

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/employees`);
      setItems(data);
    } catch (err) {
      console.error('Error fetching team:', err);
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
      setFormData(prev => ({ ...prev, imageUrl: data }));
    } catch (err) {
      console.error('Upload Error:', err);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    };

    try {
      setLoading(true);
      if (editingId) {
        await axios.put(`${API_URL}/api/employees/${editingId}`, formData, config);
      } else {
        await axios.post(`${API_URL}/api/employees`, formData, config);
      }
      setShowForm(false);
      setEditingId(null);
      setImagePreview(null);
      setFormData({ name: '', role: '', imageUrl: '' });
      fetchItems();
    } catch (err) {
      console.error('Team Submit Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Remove this team member?')) {
      await axios.delete(`${API_URL}/api/employees/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchItems();
    }
  };

  return (
    <div className="p-4 md:p-10 relative min-h-screen bg-black">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-white mb-2 uppercase tracking-tight">Team Roster</h1>
          <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-1">Manage the creative minds behind Attract Advertising.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', role: '', imageUrl: '' });
            setImagePreview(null);
            setShowForm(true);
          }}
          className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#5B49AD] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.05] active:scale-[0.95] transition-all shadow-[0_0_30px_rgba(91,73,173,0.3)]"
        >
          <Plus size={20} strokeWidth={3} /> Onboard Member
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            data-lenis-prevent 
            className="bg-black border border-white/10 p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] w-full max-w-xl relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <button onClick={() => setShowForm(false)} className="absolute right-6 top-6 md:right-10 md:top-10 text-white/20 hover:text-white transition-colors"><X size={24} className="md:w-8 md:h-8" /></button>
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-display font-black text-white tracking-tight uppercase">{editingId ? 'Update Identity' : 'Commission Agent'}</h2>
              <div className="h-1 w-12 bg-white mx-auto mt-4 rounded-full opacity-30" />
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white opacity-40 ml-2">Agent Name</label>
                <input 
                  type="text" placeholder="Full Name" required 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-white outline-none font-bold shadow-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white opacity-40 ml-2">Designation</label>
                <input 
                  type="text" placeholder="e.g. Creative Lead" required 
                  value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-white outline-none font-bold shadow-sm"
                />
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white opacity-40 ml-2">Neural Profile Asset</label>
                {(imagePreview || formData.imageUrl) && (
                  <div className="w-full h-56 bg-white/5 rounded-[2rem] overflow-hidden border border-white/10 shadow-inner">
                    <img src={imagePreview || (formData.imageUrl?.startsWith('http') ? formData.imageUrl : `${API_URL}${formData.imageUrl}`)} className="w-full h-full object-cover grayscale brightness-90" alt="Preview" />
                  </div>
                )}
                
                <div className="border-2 border-dashed border-white/10 bg-white/5 rounded-[2rem] p-10 flex flex-col items-center gap-4 hover:border-white/50 transition-all cursor-pointer group relative">
                   {loading ? (
                    <div className="flex items-center gap-4 text-white font-black text-xs uppercase tracking-widest">
                      <div className="w-5 h-5 border-3 border-current border-t-transparent rounded-full animate-spin" />
                      Uploading Neural Data...
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-sm group-hover:scale-110 transition-transform">
                        <Upload size={24} className="text-white/20 group-hover:text-white transition-colors" />
                      </div>
                      <label className="cursor-pointer text-center">
                        <span className="text-sm font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Select Identity Asset</span>
                        <p className="text-[10px] font-bold text-white/20 mt-1">RAW / JPG / PNG (Max 5MB)</p>
                        <input type="file" onChange={handleFileChange} className="hidden" />
                      </label>
                    </>
                  )}
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-6 bg-[#5B49AD] text-white font-black uppercase tracking-widest rounded-2xl hover:shadow-[0_0_50px_rgba(91,73,173,0.4)] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 shadow-[0_0_30px_rgba(91,73,173,0.3)]">
                {loading ? 'Processing...' : (editingId ? 'Update Roster' : 'Finalize Onboarding')}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mt-12 relative z-10">
        {items.map(item => (
          <div key={item._id} className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 flex flex-col items-center text-center group transition-all duration-700 shadow-2xl">
            <div className="relative w-full aspect-[3/4] rounded-[2rem] overflow-hidden mb-8 shadow-2xl">
              <img 
                src={item.imageUrl?.startsWith('http') ? item.imageUrl : `${API_URL}${item.imageUrl}`} 
                className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 scale-100 group-hover:scale-110" 
                alt={item.name} 
              />
              <div className="absolute top-6 right-6 flex gap-3 opacity-0 translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                <button onClick={() => { setEditingId(item._id); setFormData(item); setShowForm(true); }} className="w-12 h-12 bg-[#5B49AD] text-white rounded-xl shadow-lg hover:scale-110 active:scale-90 transition-all flex items-center justify-center"><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(item._id)} className="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl shadow-lg hover:bg-red-500 hover:text-white hover:scale-110 active:scale-90 transition-all flex items-center justify-center"><Trash2 size={18} /></button>
              </div>
            </div>
            <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">{item.name}</h3>
            <div className="flex items-center gap-3 mt-4">
              <div className="h-px w-6 bg-white opacity-20" />
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">{item.role}</p>
              <div className="h-px w-6 bg-white opacity-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
