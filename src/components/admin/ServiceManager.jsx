import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, X, CheckSquare, Layers } from 'lucide-react';

export default function ServiceManager() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    isPremium: false,
    details: []
  });

  const addDetailRow = () => {
    setFormData({
      ...formData,
      details: [...formData.details, { label: '', content: '' }]
    });
  };

  const removeDetailRow = (index) => {
    const newDetails = [...formData.details];
    newDetails.splice(index, 1);
    setFormData({ ...formData, details: newDetails });
  };

  const updateDetailRow = (index, field, value) => {
    const newDetails = [...formData.details];
    newDetails[index][field] = value;
    setFormData({ ...formData, details: newDetails });
  };

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/services`);
      console.log('Services Fetched:', data);
      setItems(data);
    } catch (err) {
      console.error('Error fetching services:', err);
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
        await axios.put(`${API_URL}/api/services/${editingId}`, formData, config);
      } else {
        await axios.post(`${API_URL}/api/services`, formData, config);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', description: '', price: '', isPremium: false, details: [] });
      fetchItems();
    } catch (err) {
      console.error('Service Submit Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this service package?')) {
      await axios.delete(`${API_URL}/api/services/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchItems();
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      description: item.description,
      price: item.price,
      isPremium: item.isPremium,
      details: item.details || []
    });
    setShowForm(true);
  };

  return (
    <div className="p-4 md:p-10 relative min-h-screen bg-black">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-white mb-2 uppercase tracking-tight">Service Protocols</h1>
          <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-1">Configure your agency's product tiers and base pricing.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', description: '', price: '', isPremium: false, details: [] });
            setShowForm(true);
          }}
          className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#5B49AD] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.05] active:scale-[0.95] transition-all shadow-[0_0_30px_rgba(91,73,173,0.3)]"
        >
          <Plus size={20} strokeWidth={3} /> New Package
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            data-lenis-prevent 
            className="bg-black border border-white/10 p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] w-full max-w-xl relative shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
          >
            <button onClick={() => setShowForm(false)} className="absolute right-6 top-6 md:right-10 md:top-10 text-white/20 hover:text-white transition-colors"><X size={24} className="md:w-8 md:h-8" /></button>
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-display font-black text-white tracking-tight uppercase">{editingId ? 'Modify Offering' : 'Engineer Service'}</h2>
              <div className="h-1 w-12 bg-white mx-auto mt-4 rounded-full opacity-30" />
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white opacity-40 ml-2">Service Identity</label>
                <input 
                  type="text" placeholder="e.g. The Strategic Push" required 
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-white outline-none font-bold placeholder:text-white/10 shadow-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white opacity-40 ml-2">Scope of Mission</label>
                <textarea 
                  placeholder="Primary objective and deliverables..." required rows="4"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-white outline-none resize-none font-medium placeholder:text-white/10 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white opacity-40 ml-2">Base Investment</label>
                  <input 
                    type="text" placeholder="e.g. ₹5,000+"  
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-white outline-none font-black shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white opacity-40 ml-2">Clearance Level</label>
                  <label className="flex items-center justify-between gap-3 cursor-pointer bg-white/5 h-[68px] rounded-2xl border border-white/10 px-6 select-none group hover:bg-white/10 transition-all shadow-sm">
                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors">Elite Status</span>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={formData.isPremium} 
                        onChange={e => setFormData({...formData, isPremium: e.target.checked})}
                      />
                      <div className="w-12 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/40 peer-checked:after:bg-white after:border-white/10 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5B49AD]"></div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-white opacity-40 text-[10px] font-black uppercase tracking-widest">Included Assets</h3>
                  <button type="button" onClick={addDetailRow} className="text-white hover:opacity-60 transition-all flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                    <Plus size={14} strokeWidth={3} /> Add Point
                  </button>
                </div>
                <div className="flex flex-col gap-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {formData.details.map((detail, index) => (
                    <div key={index} className="flex gap-4 items-start bg-white/5 p-5 rounded-2xl border border-white/10 relative group transition-all">
                      <div className="flex-1 space-y-3">
                        <input 
                          type="text" placeholder="Point Label" 
                          value={detail.label} onChange={e => updateDetailRow(index, 'label', e.target.value)}
                          className="w-full bg-transparent border-b border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] outline-none focus:border-white"
                        />
                        <textarea 
                          placeholder="Technical Brief" rows="2"
                          value={detail.content} onChange={e => updateDetailRow(index, 'content', e.target.value)}
                          className="w-full bg-transparent text-white/40 text-xs outline-none resize-none font-medium h-12"
                        />
                      </div>
                      <button type="button" onClick={() => removeDetailRow(index)} className="text-red-500/20 hover:text-red-500 transition-colors p-2"><Trash2 size={18} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-6 bg-[#5B49AD] text-white font-black uppercase tracking-[0.2em] rounded-[2rem] hover:shadow-[0_0_50px_rgba(91,73,173,0.4)] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 shadow-[0_0_30px_rgba(91,73,173,0.3)]">
                {loading ? 'Syncing...' : (editingId ? 'Refine Protocol' : 'Deploy Protocol')}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 mt-12 relative z-10">
        {items.map(item => (
          <div key={item._id} className={`bg-white/5 backdrop-blur-3xl border rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 flex flex-col justify-between group transition-all duration-700 shadow-2xl ${item.isPremium ? 'border-white/20 bg-white/10' : 'border-white/10 hover:border-white/20'}`}>
            <div className="space-y-8">
              <div className="flex items-start justify-between">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 shadow-lg ${item.isPremium ? 'bg-[#5B49AD] text-white border-primary shadow-[0_0_20px_rgba(91,73,173,0.3)]' : 'bg-white/5 text-white border-white/10 shadow-xl'}`}>
                  {item.isPremium ? <Layers size={32} /> : <CheckSquare size={28} />}
                </div>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <button onClick={() => handleEdit(item)} className="p-4 bg-[#5B49AD] text-white rounded-xl shadow-lg hover:scale-110 active:scale-90 transition-all" title="Edit Protocol"><Edit2 size={20} /></button>
                  <button onClick={() => handleDelete(item._id)} className="p-4 bg-red-500/10 text-red-500 rounded-xl shadow-lg hover:bg-red-500 hover:text-white hover:scale-110 active:scale-90 transition-all" title="Retire Protocol"><Trash2 size={20} /></button>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="font-display font-black text-white text-3xl tracking-tight uppercase leading-none">
                    {item.title}
                  </h3>
                  {item.isPremium && <span className="text-[10px] bg-[#5B49AD] text-white px-4 py-1.5 rounded-full uppercase font-black tracking-widest shadow-[0_0_15px_rgba(91,73,173,0.3)]">Elite Service</span>}
                </div>
                <p className="text-white/40 text-lg mt-6 font-medium leading-relaxed italic border-l-4 border-white/10 pl-6 border-b border-white/5 pb-2">"{item.description}"</p>
              </div>
            </div>

            <div className="mt-14 flex items-center justify-between border-t border-white/10 pt-10">
               <div className="text-4xl font-display font-black text-white tracking-tighter italic">
                 <span className="text-white opacity-40 mr-1"></span>{item.price}
               </div>
               <div className="flex flex-col items-end">
                 <div className="text-[10px] text-white opacity-40 font-black uppercase tracking-[0.3em] mb-1">Architecture</div>
                 <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Protocol Active v1.02</div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
