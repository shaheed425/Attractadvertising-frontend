import { useState } from 'react';
import { API_URL } from '../../config';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, X } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    clientName: '',
    address: '',
    email: '',
    mobileNumber: '',
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

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
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5B49AD]/10 to-transparent pointer-events-none" />
      
      <h3 className="text-3xl font-black text-white mb-8 uppercase tracking-tight flex items-center gap-4">
         For Enquiry
        <div className="h-1 w-12 bg-[#5B49AD] rounded-full" />
      </h3>

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
              className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#5B49AD] transition-all placeholder:text-white/10"
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
              className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#5B49AD] transition-all placeholder:text-white/10"
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
            className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#5B49AD] transition-all placeholder:text-white/10"
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
              className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#5B49AD] transition-all placeholder:text-white/10"
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
              className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#5B49AD] transition-all placeholder:text-white/10"
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
              Submission Received! We'll contact you soon.
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
              Something went wrong. Please try again.
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default ContactForm;
