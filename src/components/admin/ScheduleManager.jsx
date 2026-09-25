import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { getStoredSettings, saveStoredSettings } from '../../utils/settingsStorage';
import {
  Calendar,
  Clock,
  QrCode,
  CheckCircle2,
  XCircle,
  Eye,
  Plus,
  Trash2,
  Save,
  Lock,
  Unlock,
  RefreshCw,
  Search,
  User,
  Phone,
  Mail,
  Building,
  Briefcase,
  MapPin,
  Navigation,
  FileText,
  Tag,
  ChevronDown,
  ChevronUp,
  Play,
} from 'lucide-react';

const getYouTubeId = (url) => {
  if (!url) return 'dQw4w9WgXcQ';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : 'dQw4w9WgXcQ';
};

export default function ScheduleManager() {
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'slots', 'payment'
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [settings, setSettings] = useState(getStoredSettings());
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [notice, setNotice] = useState({ type: '', msg: '' });

  // New slot modal / state
  const [newSlot, setNewSlot] = useState({
    name: '',
    timeRange: '',
    duration: '3 Hours',
    status: 'available',
    tag: '',
    popular: false,
  });

  const token = localStorage.getItem('adminToken');
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const showNotice = (msg, type = 'success') => {
    setNotice({ type, msg });
    setTimeout(() => setNotice({ type: '', msg: '' }), 4000);
  };

  useEffect(() => {
    fetchBookings();
    fetchSettings();
  }, []);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    let apiBookings = [];
    try {
      const { data } = await axios.get(`${API_URL}/api/schedule`, authHeaders);
      apiBookings = Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('Could not fetch bookings from API, checking local storage:', err);
    }

    // Merge with localStorage attract_scheduled_bookings
    let localBookings = [];
    try {
      const stored = localStorage.getItem('attract_scheduled_bookings');
      if (stored) {
        localBookings = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage read error:', e);
    }

    // Deduplicate by bookingId or _id
    const combinedMap = new Map();
    [...apiBookings, ...localBookings].forEach((item) => {
      const id = item.bookingId || item._id;
      if (id && !combinedMap.has(id)) {
        combinedMap.set(id, item);
      }
    });

    setBookings(Array.from(combinedMap.values()));
    setLoadingBookings(false);
  };

  const fetchSettings = async () => {
    setLoadingSettings(true);
    const localSettings = getStoredSettings();
    setSettings(localSettings);

    try {
      const { data } = await axios.get(`${API_URL}/api/settings`);
      if (data) {
        const merged = saveStoredSettings(data);
        setSettings(merged);
      }
    } catch (err) {
      console.warn('Could not fetch settings from remote API, using local fallback:', err);
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleUpdateStatus = async (bookingItem, newStatus) => {
    const targetId = bookingItem._id || bookingItem.bookingId;

    // Update state locally
    const updatedList = bookings.map((b) => {
      if ((b._id && b._id === targetId) || (b.bookingId && b.bookingId === targetId)) {
        return { ...b, paymentStatus: newStatus };
      }
      return b;
    });
    setBookings(updatedList);

    // Update LocalStorage
    try {
      localStorage.setItem('attract_scheduled_bookings', JSON.stringify(updatedList));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // Update Backend API if _id exists
    if (bookingItem._id) {
      try {
        await axios.put(`${API_URL}/api/schedule/${bookingItem._id}/status`, { paymentStatus: newStatus }, authHeaders);
      } catch (err) {
        console.warn('Backend status update error:', err);
      }
    }

    showNotice(`Booking ${targetId} status set to ${newStatus}`);
  };

  const handleDeleteBooking = (bookingItem) => {
    const targetId = bookingItem._id || bookingItem.bookingId;
    if (window.confirm(`Are you sure you want to delete booking ${targetId}?`)) {
      const updatedList = bookings.filter(
        (b) => (b._id ? b._id !== targetId : b.bookingId !== targetId)
      );
      setBookings(updatedList);
      try {
        localStorage.setItem('attract_scheduled_bookings', JSON.stringify(updatedList));
      } catch (e) {
        console.warn('LocalStorage delete error:', e);
      }
      showNotice(`Booking ${targetId} deleted.`);
    }
  };

  const handleSaveSettings = async (updatedSettings = settings) => {
    setSavingSettings(true);
    // Persist locally first
    const savedLocal = saveStoredSettings(updatedSettings);
    setSettings(savedLocal);

    try {
      const { data } = await axios.put(`${API_URL}/api/settings`, updatedSettings, authHeaders);
      if (data) {
        const synced = saveStoredSettings(data);
        setSettings(synced);
      }
      showNotice('Settings updated successfully!');
    } catch (err) {
      console.warn('Remote settings update failed, saved locally:', err?.message || err);
      showNotice('Settings saved locally!', 'success');
    } finally {
      setSavingSettings(false);
    }
  };

  // Toggle slot status between available and booked
  const handleToggleSlotStatus = (slotId) => {
    const updatedSlots = settings.timeSlots.map((slot) => {
      if (slot.id === slotId) {
        return { ...slot, status: slot.status === 'available' ? 'booked' : 'available' };
      }
      return slot;
    });

    const newSettings = { ...settings, timeSlots: updatedSlots };
    setSettings(newSettings);
    handleSaveSettings(newSettings);
  };

  // Add new time slot
  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!newSlot.name || !newSlot.timeRange) {
      return showNotice('Please enter slot name and time range', 'error');
    }

    const slotToAdd = {
      ...newSlot,
      id: `slot-${Date.now()}`,
    };

    const updatedSlots = [...(settings.timeSlots || []), slotToAdd];
    const newSettings = { ...settings, timeSlots: updatedSlots };
    setSettings(newSettings);
    handleSaveSettings(newSettings);

    setNewSlot({
      name: '',
      timeRange: '',
      duration: '3 Hours',
      status: 'available',
      tag: '',
      popular: false,
    });
  };

  // Delete slot
  const handleDeleteSlot = (slotId) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      const updatedSlots = settings.timeSlots.filter((s) => s.id !== slotId);
      const newSettings = { ...settings, timeSlots: updatedSlots };
      setSettings(newSettings);
      handleSaveSettings(newSettings);
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = filterStatus === 'ALL' || b.paymentStatus === filterStatus;
    const matchesSearch =
      b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phoneNumber?.includes(searchTerm) ||
      b.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 md:p-8 relative min-h-full space-y-8 font-body">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Calendar className="text-[#5B49AD]" /> Schedule & Payment Control
          </h1>
          <p className="text-white/40 font-medium text-sm md:text-base">
            View full customer campaign requests, verify uploaded UPI screenshots, and manage operational time slots.
          </p>
        </div>

        {/* Refresh button */}
        <button
          onClick={() => {
            fetchBookings();
            fetchSettings();
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase text-white hover:bg-white/10 transition-all self-start md:self-auto shadow-md"
        >
          <RefreshCw size={14} className={loadingBookings ? 'animate-spin' : ''} /> Refresh Data
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

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-3 border-b border-white/10 pb-4 relative z-10">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeTab === 'bookings'
              ? 'bg-[#5B49AD] text-white shadow-[0_0_20px_rgba(91,73,173,0.4)]'
              : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
          }`}
        >
          <Calendar size={16} /> Customer Bookings ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('slots')}
          className={`px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeTab === 'slots'
              ? 'bg-[#5B49AD] text-white shadow-[0_0_20px_rgba(91,73,173,0.4)]'
              : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
          }`}
        >
          <Clock size={16} /> Time Slots Controller ({settings.timeSlots?.length || 0})
        </button>
      </div>

      {/* TAB 1: BOOKINGS LIST */}
      {activeTab === 'bookings' && (
        <div className="space-y-6 relative z-10">
          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/10">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input
                type="text"
                placeholder="Search by customer name, ref ID, email, district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white text-xs focus:outline-none focus:border-[#5B49AD]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              {['ALL', 'Pending Verification', 'Verified', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    filterStatus === status
                      ? 'bg-white text-black'
                      : 'bg-black/50 text-white/40 border border-white/10 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings Table / Grid */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white/5 border border-white/10 p-12 rounded-[2.5rem] text-center text-white/40">
              No scheduled bookings found matching your filter criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredBookings.map((booking) => {
                const bookingKey = booking._id || booking.bookingId;
                const isExpanded = expandedBookingId === bookingKey;

                return (
                  <div
                    key={bookingKey}
                    className="bg-white/5 backdrop-blur-3xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-2xl hover:border-white/20 transition-all space-y-6"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-white/10 pb-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-base font-black text-[#5B49AD]">{booking.bookingId}</span>
                          <span
                            className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              booking.paymentStatus === 'Verified'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : booking.paymentStatus === 'Rejected'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {booking.paymentStatus}
                          </span>
                          {booking.createdAt && (
                            <span className="text-[10px] text-white/40 font-mono hidden sm:inline">
                              Submitted: {new Date(booking.createdAt).toLocaleString()}
                            </span>
                          )}
                        </div>

                        <h3 className="text-2xl font-bold text-white uppercase tracking-tight mt-1">
                          {booking.customerName}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-white/60 pt-1">
                          <a href={`tel:${booking.phoneNumber}`} className="flex items-center gap-1.5 hover:text-white">
                            <Phone size={13} className="text-[#5B49AD]" /> {booking.phoneNumber}
                          </a>
                          <a href={`mailto:${booking.email}`} className="flex items-center gap-1.5 hover:text-white">
                            <Mail size={13} className="text-[#5B49AD]" /> {booking.email}
                          </a>
                          {booking.companyName && (
                            <span className="flex items-center gap-1.5 text-white/80 font-semibold">
                              <Building size={13} className="text-[#5B49AD]" /> {booking.companyName}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Amount & Expand */}
                      <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                        <div className="text-left md:text-right">
                          <span className="text-3xl font-display font-black text-white">
                            ₹{(booking.totalAmount || 4999).toLocaleString()}
                          </span>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest">Campaign Fee</p>
                        </div>

                        <button
                          onClick={() => setExpandedBookingId(isExpanded ? null : bookingKey)}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 mt-2"
                        >
                          {isExpanded ? (
                            <>
                              Hide Details <ChevronUp size={14} />
                            </>
                          ) : (
                            <>
                              View Full Details <ChevronDown size={14} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Summary Quick Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-1">
                        <span className="text-[10px] font-bold text-[#5B49AD] uppercase flex items-center gap-1.5">
                          <Calendar size={13} /> Scheduled Date & Window
                        </span>
                        <p className="text-white font-bold text-sm">{booking.date}</p>
                        <p className="text-white/60 text-xs">{booking.timeSlot}</p>
                      </div>

                      <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-1">
                        <span className="text-[10px] font-bold text-[#5B49AD] uppercase flex items-center gap-1.5">
                          <Navigation size={13} /> District & Location
                        </span>
                        <p className="text-white font-bold text-sm">{booking.place}</p>
                        <p className="text-white/60 text-xs">{booking.district}</p>
                      </div>

                      <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#5B49AD] uppercase block">UPI Payment Proof</span>
                          <span className="text-xs font-bold text-white">
                            {booking.paymentScreenshot ? 'Screenshot Attached' : 'No Screenshot'}
                          </span>
                        </div>
                        {booking.paymentScreenshot && (
                          <button
                            onClick={() => setSelectedScreenshot(booking.paymentScreenshot)}
                            className="px-3 py-2 bg-[#5B49AD] text-white rounded-xl text-xs font-bold uppercase hover:bg-[#5B49AD]/80 transition-all flex items-center gap-1"
                          >
                            <Eye size={14} /> View
                          </button>
                        )}
                      </div>
                    </div>

                    {/* EXPANDED FULL DETAILS DRAWER */}
                    {isExpanded && (
                      <div className="bg-black/60 border border-white/10 p-6 rounded-3xl space-y-6 animate-fade-in">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#5B49AD] border-b border-white/10 pb-3">
                          Full Booking Specifications & Client Record
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                          {/* Client Information */}
                          <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                            <span className="text-[10px] font-bold uppercase text-white/40">Client Details</span>
                            <div className="space-y-2 text-white">
                              <p>
                                <strong className="text-white/40">Full Name:</strong> {booking.customerName}
                              </p>
                              <p>
                                <strong className="text-white/40">Phone:</strong> {booking.phoneNumber}
                              </p>
                              <p>
                                <strong className="text-white/40">Email:</strong> {booking.email}
                              </p>
                              {booking.companyName && (
                                <p>
                                  <strong className="text-white/40">Company:</strong> {booking.companyName}
                                </p>
                              )}
                              {booking.designation && (
                                <p>
                                  <strong className="text-white/40">Role / Designation:</strong> {booking.designation}
                                </p>
                              )}
                              {booking.address && (
                                <p>
                                  <strong className="text-white/40">Address:</strong> {booking.address}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Campaign & Schedule Info */}
                          <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                            <span className="text-[10px] font-bold uppercase text-white/40">Campaign Specifications</span>
                            <div className="space-y-2 text-white">
                              <p>
                                <strong className="text-white/40">Primary Date:</strong> {booking.date}
                              </p>
                              {booking.preferredDate && (
                                <p>
                                  <strong className="text-white/40">Backup Date:</strong> {booking.preferredDate}
                                </p>
                              )}
                              <p>
                                <strong className="text-white/40">District:</strong> {booking.district}
                              </p>
                              <p>
                                <strong className="text-white/40">Target Place:</strong> {booking.place}
                              </p>
                              <p>
                                <strong className="text-white/40">Time Window:</strong> {booking.timeSlot}
                              </p>
                              <p>
                                <strong className="text-white/40">Screen Count:</strong> {booking.screenCount || 1} {booking.screenCount === 1 ? 'Screen' : 'Screens'}
                              </p>
                              <p>
                                <strong className="text-white/40">Booking Fee:</strong> ₹{(booking.totalAmount || 4999).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Notes / Special Instructions */}
                        {booking.notes && (
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1 text-xs">
                            <span className="text-[10px] font-bold uppercase text-[#5B49AD]">Client Additional Instructions / Notes</span>
                            <p className="text-white/80 italic font-medium leading-relaxed">{booking.notes}</p>
                          </div>
                        )}

                        {/* Payment Proof Preview Box */}
                        {booking.paymentScreenshot && (
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3 text-xs">
                            <span className="text-[10px] font-bold uppercase text-white/40">Uploaded Payment Screenshot Preview</span>
                            <div className="flex items-center gap-4">
                              <img
                                src={booking.paymentScreenshot}
                                alt="Payment Screenshot"
                                className="w-24 h-24 object-cover rounded-xl border border-white/20 cursor-pointer"
                                onClick={() => setSelectedScreenshot(booking.paymentScreenshot)}
                              />
                              <div>
                                <button
                                  type="button"
                                  onClick={() => setSelectedScreenshot(booking.paymentScreenshot)}
                                  className="px-4 py-2 bg-[#5B49AD] text-white rounded-xl text-xs font-bold uppercase hover:bg-[#5B49AD]/80 transition-all flex items-center gap-1.5"
                                >
                                  <Eye size={14} /> Open Full Size Screenshot
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Admin Actions Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                      <button
                        onClick={() => handleDeleteBooking(booking)}
                        className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold uppercase hover:bg-red-500 hover:text-white transition-all flex items-center gap-1.5"
                      >
                        <Trash2 size={14} /> Delete Record
                      </button>

                      <div className="flex items-center gap-3">
                        {booking.paymentStatus !== 'Verified' && (
                          <button
                            onClick={() => handleUpdateStatus(booking, 'Verified')}
                            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-500 transition-all flex items-center gap-1.5 shadow-lg"
                          >
                            <CheckCircle2 size={15} /> Verify & Confirm Payment
                          </button>
                        )}

                        {booking.paymentStatus !== 'Rejected' && (
                          <button
                            onClick={() => handleUpdateStatus(booking, 'Rejected')}
                            className="px-6 py-2.5 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all flex items-center gap-1.5"
                          >
                            <XCircle size={15} /> Reject Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TIME SLOTS CONTROLLER */}
      {activeTab === 'slots' && (
        <div className="space-y-8 relative z-10">
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <Clock className="text-[#5B49AD]" /> Manage Campaign Time Slots
            </h3>
            <p className="text-xs text-white/40">
              Toggle slots as **Available** or **Booked (Locked)**. Locked slots cannot be selected by clients on the booking page.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settings.timeSlots?.map((slot) => {
                const isBooked = slot.status === 'booked';
                return (
                  <div
                    key={slot.id}
                    className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                      isBooked
                        ? 'bg-red-950/20 border-red-500/30 text-white/80'
                        : 'bg-black/50 border-white/10 text-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-bold uppercase">{slot.name}</h4>
                        <p className="text-xs text-white/40 mt-0.5">{slot.tag || 'Standard Slot'}</p>
                      </div>

                      <button
                        onClick={() => handleToggleSlotStatus(slot.id)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                          isBooked
                            ? 'bg-red-500 text-white shadow-lg'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white'
                        }`}
                      >
                        {isBooked ? <Lock size={12} /> : <Unlock size={12} />}
                        {isBooked ? 'LOCKED / BOOKED' : 'AVAILABLE'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="text-xs">
                        <span className="font-bold text-white">{slot.timeRange}</span>
                        <span className="text-white/40 ml-2">({slot.duration})</span>
                      </div>

                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="text-white/20 hover:text-red-400 transition-colors p-1"
                        title="Delete slot"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add New Time Slot Form */}
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <Plus className="text-[#5B49AD]" /> Add Custom Time Slot
            </h3>

            <form onSubmit={handleAddSlot} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-white/40">Slot Name</label>
                <input
                  type="text"
                  placeholder="e.g. Nightclub Prime Glow"
                  value={newSlot.name}
                  onChange={(e) => setNewSlot({ ...newSlot, name: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#5B49AD]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-white/40">Time Range</label>
                <input
                  type="text"
                  placeholder="e.g. 09:00 PM – 12:00 AM"
                  value={newSlot.timeRange}
                  onChange={(e) => setNewSlot({ ...newSlot, timeRange: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#5B49AD]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-white/40">Tag / Highlight</label>
                <input
                  type="text"
                  placeholder="e.g. High Nightlife Impressions"
                  value={newSlot.tag}
                  onChange={(e) => setNewSlot({ ...newSlot, tag: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#5B49AD]"
                />
              </div>

              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-6 py-3 bg-[#5B49AD] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#5B49AD]/80 transition-all flex items-center gap-2"
                >
                  <Plus size={16} /> Add & Save Time Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Screenshot Lightbox Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="relative bg-black border border-white/20 p-6 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col items-center shadow-2xl">
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white p-2 text-sm uppercase font-bold flex items-center gap-1"
            >
              <XCircle size={24} /> Close
            </button>
            <h4 className="text-sm font-black uppercase tracking-widest text-[#5B49AD] mb-4">
              Uploaded Payment Screenshot Verification
            </h4>
            <div className="overflow-auto max-h-[75vh] w-full flex items-center justify-center bg-black/50 rounded-2xl p-2 border border-white/10">
              <img src={selectedScreenshot} alt="Uploaded Payment Screenshot" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
