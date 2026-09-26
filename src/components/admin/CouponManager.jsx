import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import {
  Ticket,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  RefreshCw,
  Upload,
  Sparkles,
  Eye,
  EyeOff,
  Calendar,
  IndianRupee,
  Percent,
  AlertCircle,
  Copy,
  Lock,
  Unlock,
  Tag,
  Clock,
  X,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const DEFAULT_COUPONS = [
  {
    id: 'c-1',
    _id: 'c-1',
    title: 'Welcome Launch Special',
    description: 'Get 20% flat discount on your scheduled walking billboard booking campaign.',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
    code: 'WELCOME20',
    discountType: 'Percentage',
    discountPercentage: 20,
    minimumBookingAmount: 4000,
    maximumDiscount: 2000,
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    usageLimit: 100,
    usageCount: 14,
    perCustomerLimit: 1,
    status: 'Active',
    isPublic: true,
  },
  {
    id: 'c-2',
    _id: 'c-2',
    title: 'Festival Prime Offer',
    description: '15% savings for prime evening street advertising campaigns in major districts.',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    code: 'FESTIVE15',
    discountType: 'Percentage',
    discountPercentage: 15,
    minimumBookingAmount: 4000,
    maximumDiscount: 1500,
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    usageLimit: 50,
    usageCount: 8,
    perCustomerLimit: 1,
    status: 'Active',
    isPublic: true,
  },
];

export const getStoredCoupons = () => {
  try {
    const local = localStorage.getItem('attract_coupons');
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('LocalStorage coupons read error:', e);
  }
  return DEFAULT_COUPONS;
};

export const saveStoredCoupons = (list) => {
  try {
    localStorage.setItem('attract_coupons', JSON.stringify(list));
  } catch (e) {
    console.warn('LocalStorage coupons save error:', e);
  }
};

export default function CouponManager() {
  const [coupons, setCoupons] = useState(getStoredCoupons());
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [previewModalCoupon, setPreviewModalCoupon] = useState(null);
  const [notice, setNotice] = useState({ type: '', msg: '' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    code: '',
    discountType: 'Percentage',
    discountPercentage: 20,
    minimumBookingAmount: 0,
    maximumDiscount: 0,
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 0,
    perCustomerLimit: 1,
    status: 'Active',
    isPublic: true,
  });

  const token = localStorage.getItem('adminToken');
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const showNotice = (msg, type = 'success') => {
    setNotice({ type, msg });
    setTimeout(() => setNotice({ type: '', msg: '' }), 4000);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    setCoupons(getStoredCoupons());
    try {
      const { data } = await axios.get(`${API_URL}/api/coupons`, authHeaders);
      if (Array.isArray(data) && data.length > 0) {
        setCoupons(data);
        saveStoredCoupons(data);
      }
    } catch (err) {
      console.warn('Backend coupons API offline, using local storage fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRandomCode = () => {
    const prefixes = ['OFFER', 'PROMO', 'ATTRACT', 'SUPER', 'DEAL', 'VIP'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNumber = Math.floor(10 + Math.random() * 90);
    setFormData((prev) => ({ ...prev, code: `${randomPrefix}${randomNumber}` }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showNotice('Please upload a valid JPG, PNG, or WEBP image file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.code || !formData.discountPercentage) {
      return showNotice('Please fill in Title, Code, and Discount Percentage.', 'error');
    }

    const pct = Number(formData.discountPercentage);
    if (isNaN(pct) || pct < 1 || pct > 100) {
      return showNotice('Discount Percentage must be between 1% and 100%.', 'error');
    }

    const cleanCode = formData.code.trim().toUpperCase();

    // Check unique code locally
    const duplicate = coupons.find(
      (c) => c.code === cleanCode && (editingItem ? c.id !== editingItem.id && c._id !== editingItem._id : true)
    );
    if (duplicate) {
      return showNotice(`Coupon code '${cleanCode}' already exists!`, 'error');
    }

    const payload = {
      ...formData,
      code: cleanCode,
      discountPercentage: pct,
      minimumBookingAmount: Number(formData.minimumBookingAmount) || 0,
      maximumDiscount: Number(formData.maximumDiscount) || 0,
      usageLimit: Number(formData.usageLimit) || 0,
      perCustomerLimit: Number(formData.perCustomerLimit) || 1,
    };

    let updatedList;
    if (editingItem) {
      const updatedObj = { ...editingItem, ...payload };
      updatedList = coupons.map((c) => (c.id === editingItem.id || c._id === editingItem._id ? updatedObj : c));

      if (editingItem._id && editingItem._id.length > 10) {
        try {
          await axios.put(`${API_URL}/api/coupons/${editingItem._id}`, payload, authHeaders);
        } catch (err) {
          console.warn('Backend coupon update error:', err);
        }
      }
    } else {
      const newObj = {
        id: `c-${Date.now()}`,
        _id: `c-${Date.now()}`,
        usageCount: 0,
        ...payload,
      };
      updatedList = [newObj, ...coupons];

      try {
        await axios.post(`${API_URL}/api/coupons`, payload, authHeaders);
      } catch (err) {
        console.warn('Backend coupon create error:', err);
      }
    }

    setCoupons(updatedList);
    saveStoredCoupons(updatedList);
    showNotice(editingItem ? 'Coupon updated successfully!' : 'New coupon created successfully!');
    resetForm();
  };

  const handleDelete = async (item) => {
    const targetId = item._id || item.id;
    if (window.confirm(`Are you sure you want to delete coupon '${item.code}' (${item.title})?`)) {
      const filtered = coupons.filter((c) => (c._id ? c._id !== targetId : c.id !== targetId));
      setCoupons(filtered);
      saveStoredCoupons(filtered);

      if (item._id && item._id.length > 10) {
        try {
          await axios.delete(`${API_URL}/api/coupons/${item._id}`, authHeaders);
        } catch (err) {
          console.warn('Backend coupon delete error:', err);
        }
      }
      showNotice('Coupon deleted successfully.');
    }
  };

  const handleToggleStatus = (item) => {
    const nextStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    const updated = coupons.map((c) => {
      if ((c._id && c._id === item._id) || (c.id && c.id === item.id)) {
        return { ...c, status: nextStatus };
      }
      return c;
    });
    setCoupons(updated);
    saveStoredCoupons(updated);

    if (item._id && item._id.length > 10) {
      axios.put(`${API_URL}/api/coupons/${item._id}`, { status: nextStatus }, authHeaders).catch(console.warn);
    }
    showNotice(`Coupon ${item.code} is now ${nextStatus}.`);
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      code: item.code || '',
      discountType: item.discountType || 'Percentage',
      discountPercentage: item.discountPercentage || 20,
      minimumBookingAmount: item.minimumBookingAmount || 0,
      maximumDiscount: item.maximumDiscount || 0,
      startDate: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : '',
      expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
      usageLimit: item.usageLimit || 0,
      perCustomerLimit: item.perCustomerLimit || 1,
      status: item.status || 'Active',
      isPublic: item.isPublic !== undefined ? item.isPublic : true,
    });
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      code: '',
      discountType: 'Percentage',
      discountPercentage: 20,
      minimumBookingAmount: 0,
      maximumDiscount: 0,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageLimit: 0,
      perCustomerLimit: 1,
      status: 'Active',
      isPublic: true,
    });
    setIsFormOpen(false);
  };

  // Stats
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.status === 'Active').length;
  const expiredCoupons = coupons.filter((c) => new Date(c.expiryDate) < new Date()).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0);

  return (
    <div className="p-4 md:p-8 relative min-h-full space-y-8 font-body">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Ticket className="text-[#5B49AD]" /> Coupon Management
          </h1>
          <p className="text-white/40 font-medium text-sm md:text-base">
            Create promotional discount codes, manage validity, set redemption caps & configure public customer cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCoupons}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase text-white hover:bg-white/10 transition-all shadow-md"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Reload
          </button>
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="tech-button !bg-[#5B49AD] !text-white px-6 py-2.5 uppercase text-xs tracking-wider font-bold shadow-[0_0_20px_rgba(91,73,173,0.4)] flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Create New Coupon
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

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-6 rounded-3xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-white/40 tracking-wider">Total Coupons</span>
          <p className="text-3xl font-display font-black text-white">{totalCoupons}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl border border-emerald-500/20 p-6 rounded-3xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">Active Coupons</span>
          <p className="text-3xl font-display font-black text-emerald-400">{activeCoupons}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl border border-amber-500/20 p-6 rounded-3xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">Expired Coupons</span>
          <p className="text-3xl font-display font-black text-amber-400">{expiredCoupons}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl border border-[#5B49AD]/30 p-6 rounded-3xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-[#5B49AD] tracking-wider">Total Redemptions</span>
          <p className="text-3xl font-display font-black text-white">{totalRedemptions}</p>
        </div>
      </div>

      {/* Modal / Form Overlay */}
      {isFormOpen && (
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-2xl space-y-6 relative z-10 animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold text-white uppercase flex items-center gap-2">
              <Ticket className="text-[#5B49AD]" /> {editingItem ? 'Edit Coupon Offer' : 'Create New Promotional Coupon'}
            </h3>
            <button
              onClick={resetForm}
              className="px-3 py-1 bg-white/10 text-white/60 hover:text-white rounded-xl text-xs uppercase font-bold"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveForm} className="space-y-6">
            {/* Top Grid: Title, Description & Code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Coupon Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Launch Offer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-xs focus:outline-none focus:border-[#5B49AD]"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Short Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Get 20% flat discount on scheduled campaigns"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-xs focus:outline-none focus:border-[#5B49AD]"
                />
              </div>

              {/* Coupon Code + Generator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                    Coupon Code *
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomCode}
                    className="text-[9px] font-bold uppercase text-[#5B49AD] hover:underline flex items-center gap-1"
                  >
                    <Zap size={10} /> Generate Random
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. WELCOME20"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-mono font-bold text-xs focus:outline-none focus:border-[#5B49AD]"
                />
              </div>
            </div>

            {/* Middle Grid: Discount & Rules */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Discount Percentage */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Discount Percentage (%) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    placeholder="20"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-2xl pl-5 pr-10 py-3.5 text-white font-bold text-xs focus:outline-none focus:border-[#5B49AD]"
                  />
                  <Percent size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" />
                </div>
              </div>

              {/* Minimum Booking Amount */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Min. Booking Amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0 (No Minimum)"
                  value={formData.minimumBookingAmount}
                  onChange={(e) => setFormData({ ...formData, minimumBookingAmount: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-mono text-xs focus:outline-none focus:border-[#5B49AD]"
                />
              </div>

              {/* Maximum Discount Cap */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Max Discount Cap (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0 (Uncapped)"
                  value={formData.maximumDiscount}
                  onChange={(e) => setFormData({ ...formData, maximumDiscount: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-mono text-xs focus:outline-none focus:border-[#5B49AD]"
                />
              </div>

              {/* Total Usage Limit */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Total Redemption Limit
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0 (Unlimited)"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-mono text-xs focus:outline-none focus:border-[#5B49AD]"
                />
              </div>
            </div>

            {/* Dates & Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-3 text-white text-xs focus:outline-none focus:border-[#5B49AD]"
                />
              </div>

              {/* Expiry Date */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-3 text-white text-xs focus:outline-none focus:border-[#5B49AD]"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-xs focus:outline-none focus:border-[#5B49AD]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Display Setting (Public) */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Customer Carousel
                </label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                  className={`w-full py-3 px-4 rounded-2xl text-xs font-bold uppercase border transition-all flex items-center justify-center gap-2 ${
                    formData.isPublic
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-white/5 border-white/10 text-white/40'
                  }`}
                >
                  {formData.isPublic ? <Eye size={14} /> : <EyeOff size={14} />}
                  {formData.isPublic ? 'Visible to Clients' : 'Hidden from Carousel'}
                </button>
              </div>
            </div>

            {/* Image Upload Row */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                Promotional Image (URL or Upload JPG/PNG/WEBP)
              </label>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or upload image"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-3 text-white text-xs font-mono focus:outline-none focus:border-[#5B49AD]"
                />
                <label className="px-5 py-3 bg-white/10 border border-white/10 text-white rounded-2xl text-xs font-bold uppercase hover:bg-white/20 transition-all shrink-0 cursor-pointer flex items-center gap-2">
                  <Upload size={14} /> Upload Image
                  <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {formData.imageUrl && (
                <div className="mt-3 flex items-center gap-4 bg-black/40 p-3 rounded-2xl border border-white/10 w-fit">
                  <img src={formData.imageUrl} alt="Coupon Preview" className="w-16 h-16 object-cover rounded-xl border border-white/20" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                    className="text-red-400 text-xs font-bold uppercase hover:underline"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            {/* Submit & Reset Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setPreviewModalCoupon(formData)}
                className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-bold uppercase hover:bg-white/10 transition-all flex items-center gap-1.5"
              >
                <Eye size={14} /> Preview Card
              </button>
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
                {editingItem ? 'Update Coupon' : 'Save & Publish Coupon'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {coupons.map((item) => (
          <div
            key={item.id || item._id}
            className={`bg-white/5 backdrop-blur-3xl border p-6 rounded-[2.5rem] shadow-2xl flex flex-col justify-between space-y-6 transition-all duration-300 relative overflow-hidden group ${
              item.status === 'Active' ? 'border-white/15 hover:border-[#5B49AD]/60' : 'border-white/5 opacity-50'
            }`}
          >
            {/* Top Image Preview Banner */}
            <div className="relative h-36 rounded-2xl overflow-hidden bg-black/60 border border-white/10">
              <img
                src={
                  item.imageUrl ||
                  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80'
                }
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="absolute top-3 left-3 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-mono font-black text-[#5B49AD] tracking-widest flex items-center gap-1">
                <Tag size={10} /> {item.code}
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    item.status === 'Active'
                      ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                      : 'bg-red-500/30 text-red-300 border border-red-500/40'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-tight truncate">{item.title}</h4>
                  <p className="text-[10px] text-white/60 truncate">{item.description || 'Promotional Offer'}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-display font-black text-amber-400">{item.discountPercentage}%</span>
                  <span className="text-[9px] text-white/40 block font-bold uppercase">OFF</span>
                </div>
              </div>
            </div>

            {/* Coupon Rules Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-white/40 uppercase block">Min. Booking</span>
                  <span className="text-white font-bold font-mono">
                    {item.minimumBookingAmount ? `₹${item.minimumBookingAmount.toLocaleString()}` : 'None'}
                  </span>
                </div>

                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-white/40 uppercase block">Max Discount</span>
                  <span className="text-white font-bold font-mono">
                    {item.maximumDiscount ? `₹${item.maximumDiscount.toLocaleString()}` : 'Uncapped'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-white/60 bg-black/40 px-3 py-2 rounded-xl border border-white/5">
                <span className="flex items-center gap-1">
                  <Calendar size={11} className="text-[#5B49AD]" /> Expires: {new Date(item.expiryDate).toLocaleDateString()}
                </span>
                <span className="font-mono font-bold text-white/80">
                  Used: {item.usageCount || 0} {item.usageLimit ? `/ ${item.usageLimit}` : 'times'}
                </span>
              </div>
            </div>

            {/* Card Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                onClick={() => handleToggleStatus(item)}
                className={`p-2 rounded-xl text-xs font-bold uppercase transition-all ${
                  item.status === 'Active'
                    ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-white/5 text-white/40 hover:text-white'
                }`}
                title={item.status === 'Active' ? 'Deactivate Coupon' : 'Activate Coupon'}
              >
                {item.status === 'Active' ? <Lock size={14} /> : <Unlock size={14} />}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewModalCoupon(item)}
                  className="p-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl transition-all"
                  title="Preview Customer Card"
                >
                  <Eye size={14} />
                </button>

                <button
                  onClick={() => startEdit(item)}
                  className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all"
                  title="Edit Coupon"
                >
                  <Edit2 size={14} />
                </button>

                <button
                  onClick={() => handleDelete(item)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all"
                  title="Delete Coupon"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Card Modal */}
      {previewModalCoupon && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="relative bg-black border border-white/20 p-8 rounded-[3rem] max-w-md w-full shadow-2xl space-y-6">
            <button
              onClick={() => setPreviewModalCoupon(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white p-2"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5B49AD]">
                CUSTOMER CARD PREVIEW
              </span>
              <h3 className="text-xl font-bold text-white uppercase">{previewModalCoupon.title || 'Special Offer'}</h3>
            </div>

            {/* Card Preview */}
            <div className="glass-card p-6 rounded-3xl border border-[#5B49AD]/40 relative overflow-hidden space-y-4 shadow-2xl">
              <div className="relative h-40 rounded-2xl overflow-hidden">
                <img
                  src={
                    previewModalCoupon.imageUrl ||
                    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80'
                  }
                  alt={previewModalCoupon.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/80 px-3 py-1 rounded-full text-xs font-mono font-bold text-[#5B49AD]">
                  {previewModalCoupon.code || 'COUPON'}
                </div>
              </div>

              <div>
                <p className="text-xs text-white/80">{previewModalCoupon.description || 'Promotional Discount'}</p>
                <div className="mt-3 flex items-baseline justify-between border-t border-white/10 pt-3">
                  <span className="text-2xl font-display font-black text-amber-400">
                    {previewModalCoupon.discountPercentage}% OFF
                  </span>
                  <span className="text-[10px] font-bold text-white/40 uppercase">
                    Expires: {previewModalCoupon.expiryDate ? new Date(previewModalCoupon.expiryDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setPreviewModalCoupon(null)}
              className="w-full py-3 bg-white/10 rounded-2xl text-xs font-bold uppercase text-white hover:bg-white/20"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
