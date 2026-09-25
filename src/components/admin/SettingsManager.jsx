import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { getStoredSettings, saveStoredSettings } from '../../utils/settingsStorage';
import {
  Settings,
  QrCode,
  Instagram,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Image,
  Upload,
  Trash2,
} from 'lucide-react';

export default function SettingsManager() {
  const [settings, setSettings] = useState(getStoredSettings());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState({ type: '', msg: '' });

  const token = localStorage.getItem('adminToken');
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const showNotice = (msg, type = 'success') => {
    setNotice({ type, msg });
    setTimeout(() => setNotice({ type: '', msg: '' }), 4000);
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Url = reader.result;
      setSettings((prev) => ({ ...prev, heroShowcaseImage: base64Url }));
      showNotice('Hero showcase thumbnail image selected! Click Save to apply.', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleQrImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Url = reader.result;
      setSettings((prev) => {
        const updated = { ...prev, qrImage: base64Url };
        saveStoredSettings(updated);
        return updated;
      });
      showNotice('Custom QR Image uploaded & saved! This exact image will now appear on customer payment screen.', 'success');
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    // Load local storage first
    const localSettings = getStoredSettings();
    setSettings(localSettings);

    try {
      const { data } = await axios.get(`${API_URL}/api/settings`);
      if (data) {
        const merged = saveStoredSettings(data);
        setSettings(merged);
      }
    } catch (err) {
      console.warn('API Settings fetch failed, using local storage settings:', err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    // Save to local storage first for immediate persistence
    const savedLocal = saveStoredSettings(settings);
    setSettings(savedLocal);

    try {
      const { data } = await axios.put(`${API_URL}/api/settings`, settings, authHeaders);
      if (data) {
        const synced = saveStoredSettings(data);
        setSettings(synced);
      }
      showNotice('System settings & Instagram link saved & synced successfully!');
    } catch (err) {
      console.warn('Remote backend sync failed (404/Network), settings saved locally:', err?.message || err);
      showNotice('Settings saved locally! (Backend pending deployment)', 'success');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(settings.upiId || '8590204464@ybl');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const upiQrPreviewUrl =
    settings.qrImage ||
    `https://quickchart.io/qr?text=${encodeURIComponent(
      `upi://pay?pa=${settings.upiId || '8590204464@ybl'}&pn=${encodeURIComponent(
        settings.ownerName || 'ATTRACT ADVERTISING'
      )}&am=4000&cu=INR`
    )}&size=300&dark=5B49AD&light=ffffff&margin=1`;

  return (
    <div className="p-4 md:p-8 relative min-h-full space-y-8 font-body">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Sliders className="text-[#5B49AD]" /> System Settings
          </h1>
          <p className="text-white/40 font-medium text-sm md:text-base">
            Manage Owner UPI Payment QR Code, receiving credentials, and Homepage Hero Showcase Instagram link.
          </p>
        </div>

        <button
          onClick={fetchSettings}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase text-white hover:bg-white/10 transition-all self-start md:self-auto shadow-md"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Reload Settings
        </button>
      </div>

      {/* Notice Alert */}
      {notice.msg && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
            notice.type === 'error'
              ? 'bg-red-500/20 border border-red-500/30 text-red-400'
              : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
          }`}
        >
          <CheckCircle2 size={16} /> {notice.msg}
        </div>
      )}

      {/* Settings Form Grid */}
      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* CARD 1: Owner UPI & Payment QR Configuration */}
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5B49AD]">
                PAYMENT SYSTEM SETUP
              </span>
              <h3 className="text-xl font-bold text-white uppercase mt-1 flex items-center gap-2">
                <QrCode className="text-[#5B49AD]" /> Owner Payment QR & UPI Setup
              </h3>
              <p className="text-xs text-white/40 mt-1">
                Configure the receiving UPI ID, Owner Name, and QR Code displayed on the customer booking page (`/scheduled`).
              </p>
            </div>

            {/* Owner UPI ID */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                Owner UPI ID *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={settings.upiId || ''}
                  onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                  placeholder="e.g. 8590204464@ybl"
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono text-sm focus:outline-none focus:border-[#5B49AD]"
                />
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="px-4 py-4 bg-white/10 border border-white/10 text-white rounded-2xl text-xs font-bold uppercase hover:bg-white/20 transition-all shrink-0 flex items-center gap-1"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            {/* Owner Account Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                Owner Account / Brand Name *
              </label>
              <input
                type="text"
                required
                value={settings.ownerName || ''}
                onChange={(e) => setSettings({ ...settings, ownerName: e.target.value })}
                placeholder="e.g. ATTRACT ADVERTISING"
                className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#5B49AD]"
              />
            </div>

            {/* Custom QR Code Image Upload & URL Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                  <QrCode size={14} className="text-[#5B49AD]" /> Custom QR Code Image (Upload File or Edit URL)
                </label>
                {settings.qrImage && (
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, qrImage: '' })}
                    className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[10px] font-bold uppercase flex items-center gap-1 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 size={12} /> Clear Custom QR
                  </button>
                )}
              </div>

              {/* Upload File & Direct URL Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Upload Image Button Box */}
                <label className="sm:col-span-1 border-2 border-dashed border-white/20 hover:border-[#5B49AD] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-black/40 hover:bg-white/5 transition-all text-center group">
                  <Upload size={20} className="text-white/40 group-hover:text-[#5B49AD] group-hover:scale-110 transition-all" />
                  <span className="text-xs font-bold text-white uppercase mt-1.5">Upload QR Image</span>
                  <span className="text-[9px] text-white/40">PNG, JPG, WebP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrImageFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Direct Image URL Input */}
                <div className="sm:col-span-2 space-y-1.5 flex flex-col justify-center">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                    Or Direct Image URL
                  </label>
                  <input
                    type="text"
                    value={settings.qrImage || ''}
                    onChange={(e) => setSettings({ ...settings, qrImage: e.target.value })}
                    placeholder="Upload image file above or paste custom QR image URL..."
                    className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-xs font-mono focus:outline-none focus:border-[#5B49AD]"
                  />
                </div>
              </div>
            </div>

            {/* Live QR Preview Box */}
            <div className="bg-black/60 border border-white/10 p-6 rounded-3xl text-center space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B49AD]">
                Live Customer Payment Screen Preview
              </span>
              <div className="w-48 h-48 bg-white p-3 rounded-2xl mx-auto shadow-2xl flex items-center justify-center border-4 border-[#5B49AD]/40">
                <img
                  src={upiQrPreviewUrl}
                  alt="UPI QR Code Preview"
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <p className="text-base font-bold text-white uppercase">{settings.ownerName || 'ATTRACT ADVERTISING'}</p>
              <p className="text-xs font-mono font-bold text-[#5B49AD]">{settings.upiId || '8590204464@ybl'}</p>
            </div>
          </div>

          {/* Card 1 Save Button */}
          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={saving}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#5B49AD] text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:bg-[#5B49AD]/80 transition-all"
            >
              <Save size={16} /> Save Payment QR Settings
            </button>
          </div>
        </div>

        {/* CARD 2: Hero Showcase Instagram Configuration */}
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5B49AD]">
                HERO MEDIA SHOWCASE
              </span>
              <h3 className="text-xl font-bold text-white uppercase mt-1 flex items-center gap-2">
                <Instagram className="text-[#5B49AD]" /> Hero Showcase Instagram Link
              </h3>
              <p className="text-xs text-white/40 mt-1">
                Set the Instagram Reel, Post, or Profile link triggered by clicking the showcase cards on the homepage hero section.
              </p>
            </div>

            {/* Instagram Link Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                Instagram Link (Reel / Post / Profile) *
              </label>
              <input
                type="text"
                required
                value={settings.instagramUrl || ''}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                placeholder="e.g. https://www.instagram.com/reel/C... or https://www.instagram.com/Stackxxio_/"
                className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono text-xs focus:outline-none focus:border-[#5B49AD]"
              />
            </div>

            {/* Live Instagram Link Test Preview Card */}
            {settings.instagramUrl && (
              <div className="bg-black/60 border border-white/10 p-6 rounded-3xl space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B49AD] flex items-center gap-2">
                  <Instagram size={14} /> Instagram Target Preview
                </span>
                
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                  <div className="truncate pr-4">
                    <p className="text-xs font-mono text-white truncate">{settings.instagramUrl}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Clicking Hero Showcase card opens this link</p>
                  </div>
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#5B49AD] text-white rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 shrink-0 hover:bg-[#5B49AD]/80 transition-all shadow-md"
                  >
                    Test Link <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            )}
            {/* HERO SHOWCASE THUMBNAIL IMAGE FORM SECTION */}
            <div className="border-t border-white/10 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5B49AD] flex items-center gap-1.5">
                    <Image size={14} /> Hero Showcase Thumbnail Image
                  </label>
                  <p className="text-xs text-white/40 mt-1">
                    Upload an image or paste a custom image URL for the Homepage Hero Showcase card.
                  </p>
                </div>

                {settings.heroShowcaseImage && (
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, heroShowcaseImage: '' })}
                    className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[10px] font-bold uppercase flex items-center gap-1 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 size={12} /> Clear Image
                  </button>
                )}
              </div>

              {/* Upload & URL Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* File Upload Box */}
                <label className="sm:col-span-1 border-2 border-dashed border-white/20 hover:border-[#5B49AD] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-black/40 hover:bg-white/5 transition-all text-center group">
                  <Upload size={22} className="text-white/40 group-hover:text-[#5B49AD] group-hover:scale-110 transition-all" />
                  <span className="text-xs font-bold text-white uppercase mt-2">Upload Image</span>
                  <span className="text-[9px] text-white/40">PNG, JPG, WebP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Direct Image URL Input */}
                <div className="sm:col-span-2 space-y-2 flex flex-col justify-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                    Or Paste Custom Image URL
                  </label>
                  <input
                    type="text"
                    value={settings.heroShowcaseImage || ''}
                    onChange={(e) => setSettings({ ...settings, heroShowcaseImage: e.target.value })}
                    placeholder="e.g. https://images.unsplash.com/photo-... or upload image file"
                    className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-xs font-mono focus:outline-none focus:border-[#5B49AD]"
                  />
                </div>
              </div>

              {/* Live Hero Card Thumbnail Preview */}
              <div className="bg-black/60 border border-white/10 p-5 rounded-3xl space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B49AD] flex items-center gap-1.5">
                  <Image size={14} /> Live Hero Card Thumbnail Preview
                </span>

                <div className="w-full h-44 rounded-2xl border border-white/10 relative overflow-hidden bg-gradient-to-br from-purple-900/40 via-black to-black flex items-center justify-center">
                  {settings.heroShowcaseImage ? (
                    <img
                      src={settings.heroShowcaseImage}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Instagram size={32} className="text-white/30 mx-auto" />
                      <p className="text-xs text-white/40 font-mono mt-2">No custom image set (Default Gradient active)</p>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[10px] font-bold uppercase text-white tracking-widest flex items-center gap-1">
                      <Instagram size={12} className="text-[#E1306C]" /> Homepage Hero Card Preview
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Global Save Button */}
          <div className="pt-6 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto tech-button !bg-[#5B49AD] !text-white px-10 py-5 uppercase text-xs tracking-[0.25em] font-black shadow-[0_0_30px_rgba(91,73,173,0.5)] flex items-center justify-center gap-3"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Saving Settings...
                </>
              ) : (
                <>
                  <Save size={18} /> Save System Settings
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
