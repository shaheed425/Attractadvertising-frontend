import { useState } from 'react';
import { API_URL } from '../../config';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2 } from 'lucide-react';

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    clientName: '',
    address: '',
    email: '',
    mobileNumber: '',
  });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch(`${API_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          companyName: '',
          clientName: '',
          address: '',
          email: '',
          mobileNumber: '',
        });
        setTimeout(() => {
          setStatus('idle');
          onClose();
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-[3rem] p-8 md:p-12 relative shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8">
            <button 
              onClick={onClose}
              className="p-3 text-white/20 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mb-10">
            <h3 className="text-4xl font-black text-white uppercase tracking-tight flex items-center gap-4">
             For Enquiry
              <div className="h-1 w-12 bg-[#5B49AD] rounded-full" />
            </h3>
            <p className="text-white/40 mt-2 font-medium italic">Transform your brand's digital presence today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#5B49AD] transition-all placeholder:text-white/10"
                  placeholder="Your Agency / Company"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">Client Name</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#5B49AD] transition-all placeholder:text-white/10"
                  placeholder="Full Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#5B49AD] transition-all placeholder:text-white/10"
                placeholder="Location / Headquarters"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">Gmail / Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#5B49AD] transition-all placeholder:text-white/10"
                  placeholder="example@gmail.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#5B49AD] transition-all placeholder:text-white/10"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className={`w-full tech-button !bg-[#5B49AD] !text-white py-5 flex items-center justify-center gap-3 group overflow-hidden ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {status === 'loading' ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Connect Now
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>

            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-green-400 text-sm font-bold uppercase tracking-widest justify-center mt-4"
                >
                  <CheckCircle2 size={16} />
                  Submission Received!
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-red-500 text-sm font-bold uppercase tracking-widest justify-center mt-4"
                >
                  <X size={16} />
                  Error occurred. Try again.
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactModal;
