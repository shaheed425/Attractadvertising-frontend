import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Star,
  CheckCircle2,
  RefreshCw,
  Upload,
  User,
  Building,
  Quote,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';

export const DEFAULT_TESTIMONIALS = [
  {
    id: 't-1',
    _id: 't-1',
    clientName: 'Rahul Varma',
    companyName: 'Malabar Gold & Diamonds',
    designation: 'Regional Marketing Head',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    reviewText:
      'Attract Advertising’s walking billboard screens brought unparalleled footfall to our flagship store launch in Kochi! The high-brightness LED backpacks stopped crowds in their tracks.',
    isFeatured: true,
  },
  {
    id: 't-2',
    _id: 't-2',
    clientName: 'Ananya Nair',
    companyName: 'Kalyan Silks',
    designation: 'Brand Campaign Director',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    reviewText:
      'The prime evening 6 PM rush hour deployment gave us 10x higher engagement compared to static hoardings. The live video proof of execution was transparent and impressive!',
    isFeatured: true,
  },
  {
    id: 't-3',
    _id: 't-3',
    clientName: 'Firoz Khan',
    companyName: 'Lulu Hypermarket Activation',
    designation: 'Event Operations Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    reviewText:
      'Scheduled walking billboard backpack screens allowed us to target high-density pedestrian corridors seamlessly. Highly recommended for premium brand visibility!',
    isFeatured: true,
  },
];

export const getStoredTestimonials = () => {
  try {
    const local = localStorage.getItem('attract_testimonials');
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('LocalStorage testimonials read error:', e);
  }
  return DEFAULT_TESTIMONIALS;
};

export const saveStoredTestimonials = (list) => {
  try {
    localStorage.setItem('attract_testimonials', JSON.stringify(list));
  } catch (e) {
    console.warn('LocalStorage testimonials save error:', e);
  }
};

export default function TestimonialManager() {
  const [testimonials, setTestimonials] = useState(getStoredTestimonials());
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notice, setNotice] = useState({ type: '', msg: '' });

  const [formData, setFormData] = useState({
    clientName: '',
    companyName: '',
    designation: '',
    avatar: '',
    rating: 5,
    reviewText: '',
    isFeatured: true,
  });

  const token = localStorage.getItem('adminToken');
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const showNotice = (msg, type = 'success') => {
    setNotice({ type, msg });
    setTimeout(() => setNotice({ type: '', msg: '' }), 4000);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    setTestimonials(getStoredTestimonials());
    try {
      const { data } = await axios.get(`${API_URL}/api/testimonials`);
      if (Array.isArray(data) && data.length > 0) {
        setTestimonials(data);
        saveStoredTestimonials(data);
      }
    } catch (err) {
      console.warn('Backend testimonials API offline, using local storage:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    if (!formData.clientName || !formData.reviewText) {
      return showNotice('Please fill in Client Name and Review Text.', 'error');
    }

    let updatedList;
    if (editingItem) {
      const updatedObj = { ...editingItem, ...formData };
      updatedList = testimonials.map((t) => (t.id === editingItem.id || t._id === editingItem._id ? updatedObj : t));
      
      // Update backend if _id exists
      if (editingItem._id && editingItem._id.length > 10) {
        try {
          await axios.put(`${API_URL}/api/testimonials/${editingItem._id}`, formData, authHeaders);
        } catch (err) {
          console.warn('Backend update error:', err);
        }
      }
    } else {
      const newObj = {
        id: `t-${Date.now()}`,
        _id: `t-${Date.now()}`,
        ...formData,
      };
      updatedList = [newObj, ...testimonials];

      try {
        await axios.post(`${API_URL}/api/testimonials`, formData, authHeaders);
      } catch (err) {
        console.warn('Backend post error:', err);
      }
    }

    setTestimonials(updatedList);
    saveStoredTestimonials(updatedList);
    showNotice(editingItem ? 'Testimonial updated successfully!' : 'New testimonial added successfully!');
    resetForm();
  };

  const handleDelete = async (item) => {
    const targetId = item._id || item.id;
    if (window.confirm(`Delete testimonial from "${item.clientName}"?`)) {
      const filtered = testimonials.filter((t) => (t._id ? t._id !== targetId : t.id !== targetId));
      setTestimonials(filtered);
      saveStoredTestimonials(filtered);

      if (item._id && item._id.length > 10) {
        try {
          await axios.delete(`${API_URL}/api/testimonials/${item._id}`, authHeaders);
        } catch (err) {
          console.warn('Backend delete error:', err);
        }
      }
      showNotice('Testimonial deleted.');
    }
  };

  const handleToggleFeatured = (item) => {
    const updated = testimonials.map((t) => {
      if ((t._id && t._id === item._id) || (t.id && t.id === item.id)) {
        return { ...t, isFeatured: !t.isFeatured };
      }
      return t;
    });
    setTestimonials(updated);
    saveStoredTestimonials(updated);
    showNotice(`Updated visibility for ${item.clientName}.`);
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData({
      clientName: item.clientName || '',
      companyName: item.companyName || '',
      designation: item.designation || '',
      avatar: item.avatar || '',
      rating: item.rating || 5,
      reviewText: item.reviewText || '',
      isFeatured: item.isFeatured !== undefined ? item.isFeatured : true,
    });
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      clientName: '',
      companyName: '',
      designation: '',
      avatar: '',
      rating: 5,
      reviewText: '',
      isFeatured: true,
    });
    setIsFormOpen(false);
  };

  return (
    <div className="p-4 md:p-8 relative min-h-full space-y-8 font-body">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight flex items-center gap-3">
            <MessageSquare className="text-[#5B49AD]" /> Testimonials Control
          </h1>
          <p className="text-white/40 font-medium text-sm md:text-base">
            Manage Client Reviews, Endorsements & Homepage Auto-Scroll Showcase.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTestimonials}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase text-white hover:bg-white/10 transition-all shadow-md"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Reload
          </button>
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="tech-button !bg-[#5B49AD] !text-white px-6 py-2.5 uppercase text-xs tracking-wider font-bold shadow-[0_0_20px_rgba(91,73,173,0.4)] flex items-center gap-2"
          >
            <Plus size={16} /> Add Testimonial
          </button>
        </div>
      </div>

      {/* Notice Alert */}
      {notice.msg && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 relative z-10 ${
            notice.type === 'error'
              ? 'bg-red-500/20 border border-red-500/30 text-red-400'
              : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
          }`}
        >
          <CheckCircle2 size={16} /> {notice.msg}
        </div>
      )}

      {/* Modal / Form Overlay */}
      {isFormOpen && (
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-2xl space-y-6 relative z-10 animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold text-white uppercase flex items-center gap-2">
              <Quote className="text-[#5B49AD]" /> {editingItem ? 'Edit Client Testimonial' : 'Add New Client Testimonial'}
            </h3>
            <button
              onClick={resetForm}
              className="px-3 py-1 bg-white/10 text-white/60 hover:text-white rounded-xl text-xs uppercase font-bold"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveForm} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Client Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Varma"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-xs focus:outline-none focus:border-[#5B49AD]"
                />
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Company / Brand Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Malabar Gold & Diamonds"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-xs focus:outline-none focus:border-[#5B49AD]"
                />
              </div>

              {/* Designation / Role */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Role / Designation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Regional Marketing Head"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-xs focus:outline-none focus:border-[#5B49AD]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Star Rating Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Star Rating (1 - 5)
                </label>
                <div className="flex items-center gap-2 bg-black/60 border border-white/10 p-3 rounded-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        size={20}
                        className={star <= formData.rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-amber-400 ml-2">{formData.rating} Stars</span>
                </div>
              </div>

              {/* Avatar Upload / URL */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Client Avatar Photo URL (or Upload File)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or upload image"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-3 text-white text-xs font-mono focus:outline-none focus:border-[#5B49AD]"
                  />
                  <label className="px-4 py-3 bg-white/10 border border-white/10 text-white rounded-2xl text-xs font-bold uppercase hover:bg-white/20 transition-all shrink-0 cursor-pointer flex items-center gap-1.5">
                    <Upload size={14} /> Upload
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Testimonial Quote Text */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                Review Quote Text *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Enter client testimonial review quote..."
                value={formData.reviewText}
                onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                className="w-full bg-black/60 border border-white/10 rounded-2xl p-5 text-white text-xs focus:outline-none focus:border-[#5B49AD] leading-relaxed"
              />
            </div>

            {/* Submit & Reset Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-white/5 border border-white/10 text-white/60 rounded-xl text-xs font-bold uppercase hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="tech-button !bg-[#5B49AD] !text-white px-8 py-3.5 uppercase text-xs tracking-wider font-bold shadow-lg"
              >
                {editingItem ? 'Update Testimonial' : 'Save Testimonial'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {testimonials.map((item) => (
          <div
            key={item.id || item._id}
            className={`bg-white/5 backdrop-blur-3xl border p-6 md:p-8 rounded-[2.5rem] shadow-2xl flex flex-col justify-between space-y-6 transition-all duration-300 relative overflow-hidden ${
              item.isFeatured ? 'border-white/15' : 'border-white/5 opacity-60'
            }`}
          >
            <div className="space-y-4">
              {/* Rating & Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleFeatured(item)}
                    className={`p-2 rounded-xl text-xs font-bold uppercase transition-all ${
                      item.isFeatured
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/5 text-white/40 hover:text-white'
                    }`}
                    title={item.isFeatured ? 'Featured (Visible on Homepage)' : 'Hidden from Homepage'}
                  >
                    {item.isFeatured ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>

                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>

                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs text-white/80 leading-relaxed font-medium italic">"{item.reviewText}"</p>
            </div>

            {/* Client Profile Footer */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <img
                src={
                  item.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt={item.clientName}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#5B49AD]"
              />
              <div className="truncate">
                <h4 className="text-sm font-bold text-white uppercase truncate">{item.clientName}</h4>
                <p className="text-[10px] text-[#5B49AD] font-bold uppercase tracking-wider truncate">
                  {item.companyName || 'Verified Client'}
                </p>
                {item.designation && <p className="text-[9px] text-white/40 truncate">{item.designation}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
