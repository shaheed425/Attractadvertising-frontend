import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Upload, X } from 'lucide-react';

export default function PortfolioManager() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    metrics: '',
    imageUrl: '',
    details: '',
    order: 0
  });

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/portfolios`);
      console.log('Portfolio Data Fetched:', data);
      setItems(data);
    } catch (err) {
      console.error('Error fetching portfolios:', err);
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
      alert(err.response?.data?.message || err.message || 'Asset Upload Failed. Check file type/size.');
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

    console.log('Deploying with Payload:', formData);

    if (!formData.imageUrl || formData.imageUrl.trim() === '') {
      alert('CRITICAL: Image URL is missing. Please re-upload your image before deploying.');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/portfolios/${editingId}`, formData, config);
      } else {
        await axios.post(`${API_URL}/api/portfolios`, formData, config);
      }
      setShowForm(false);
      setEditingId(null);
      setImagePreview(null);
      setFormData({ title: '', client: '', metrics: '', imageUrl: '', details: '', order: 0 });
      fetchItems();
    } catch (err) {
      console.error('Submit Error:', err);
      alert(err.response?.data?.message || 'Error deploying work');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      await axios.delete(`${API_URL}/api/portfolios/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchItems();
    }
  };

  return (
    <div className="p-4 md:p-8 relative min-h-screen bg-black">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">Portfolio Archive</h1>
          <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-2">Manage your agency case studies</p>
        </div>
        <button 
          onClick={() => { setShowForm(true); setEditingId(null); setImagePreview(null); }}
          className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#5B49AD] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.05] active:scale-[0.95] transition-all shadow-[0_0_30px_rgba(91,73,173,0.3)]"
        >
          <Plus size={20} /> Add New Work
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            data-lenis-prevent 
            className="bg-black border border-white/10 p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
          >
            <button onClick={() => setShowForm(false)} className="absolute right-8 top-8 text-white/20 hover:text-white transition-colors"><X size={28} /></button>
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">{editingId ? 'Refine Work' : 'Deploy New Work'}</h2>
              <div className="h-1 w-12 bg-white mx-auto mt-4 rounded-full opacity-30" />
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white opacity-40 ml-2">Project Identity</label>
                <input 
                  type="text" placeholder="Project Title" required 
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-white outline-none font-medium placeholder:text-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white opacity-40 ml-2">Client</label>
                <input 
                  type="text" placeholder="Client Name" required 
                  value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-white outline-none font-medium placeholder:text-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white opacity-40 ml-2">Growth Metric</label>
                <input 
                  type="text" placeholder="e.g. 100% Boost" 
                  value={formData.metrics} onChange={e => setFormData({...formData, metrics: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-white outline-none font-medium placeholder:text-white/10"
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white opacity-40 ml-2">Case Study Narrative</label>
                <textarea 
                  placeholder="Describe the mission objective and results..." 
                  rows="4"
                  value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-white outline-none resize-none font-medium placeholder:text-white/10"
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white opacity-20 ml-2">Visual Asset</label>
                <div className="flex flex-col gap-4">
                  {(imagePreview || formData.imageUrl) && (
                    <div className="relative w-full h-40 md:h-56 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-white/10 shadow-lg">
                      <img src={imagePreview || (formData.imageUrl?.startsWith('http') ? formData.imageUrl : `${API_URL}${formData.imageUrl}`)} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-white/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-black/40 backdrop-blur-md rounded-full">Active Preview</span>
                      </div>
                    </div>
                  )}
                  <div className="border-2 border-dashed border-white/10 bg-white/5 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-10 flex flex-col items-center gap-4 hover:border-white/50 transition-all group cursor-pointer text-center">
                    {loading ? (
                      <div className="flex items-center gap-4 text-white">
                        <div className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin" />
                        <span className="font-black uppercase tracking-widest text-xs">Syncing Asset...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-sm group-hover:scale-110 transition-transform">
                           <Upload size={20} className="text-white/20 group-hover:text-white transition-colors" />
                        </div>
                        <label className="cursor-pointer text-center">
                          <span className="text-xs md:text-sm font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Select Studio Asset</span>
                          <p className="text-[10px] font-bold text-white/20 mt-1">RAW / JPG / PNG (Max 5MB)</p>
                          <input type="file" onChange={handleFileChange} className="hidden" />
                        </label>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="md:col-span-2 py-4 md:py-6 bg-[#5B49AD] text-white font-black uppercase tracking-widest rounded-[1.5rem] md:rounded-[2rem] hover:shadow-[0_0_50px_rgba(91,73,173,0.4)] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 shadow-[0_0_30px_rgba(91,73,173,0.3)]">
                {editingId ? 'Refine Deployment' : 'Launch to Archive'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12 relative z-10">
        {items.map(item => (
          <div key={item._id} className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-700">
            <div className="aspect-[4/5] relative overflow-hidden">
              <img src={item.imageUrl?.startsWith('http') ? item.imageUrl : `${API_URL}${item.imageUrl}`} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-6 backdrop-blur-sm">
                <button 
                  onClick={() => {
                    setEditingId(item._id);
                    setFormData(item);
                    setImagePreview(null);
                    setShowForm(true);
                  }}
                  className="w-16 h-16 bg-[#5B49AD] text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-[0_0_20px_rgba(91,73,173,0.3)]"
                  title="Edit Asset"
                >
                  <Edit2 size={24} />
                </button>
                <button 
                  onClick={() => handleDelete(item._id)}
                  className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-xl"
                  title="Remove Asset"
                >
                  <Trash2 size={24} />
                </button>
              </div>
              <div className="absolute top-6 right-6 px-4 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/20">
                <span className="text-white text-[10px] font-black tracking-widest uppercase">#{item.order || '0'}</span>
              </div>
            </div>
            <div className="p-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-8 bg-white rounded-full opacity-40" />
                <span className="text-white text-[10px] font-black uppercase tracking-widest">{item.client}</span>
              </div>
              <h3 className="font-display font-black text-white text-2xl mb-6 tracking-tight uppercase leading-none">{item.title}</h3>
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">{item.metrics || 'Performance Optimized'}</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
