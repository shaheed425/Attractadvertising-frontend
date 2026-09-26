import React from 'react';
import { User, Phone, Mail, Building, Briefcase, MapPin, FileText, ArrowRight } from 'lucide-react';

export default function CustomerForm({ customerData, setCustomerData, onNext, onPrev }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    customerData.customerName?.trim() !== '' &&
    customerData.phoneNumber?.trim() !== '' &&
    customerData.email?.trim() !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#5B49AD] flex items-center justify-center gap-2">
          <User size={14} /> Step 5 of 7 — Customer & Client Details
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">
          Customer Information
        </h2>
        <p className="text-sm text-[#A1A1AA]">
          Enter contact and company information for your scheduled advertising campaign verification.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-10 rounded-[3rem] shadow-2xl space-y-6">
        {/* Full Name & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA] flex items-center gap-2">
              <User size={14} className="text-[#5B49AD]" /> Full Name *
            </label>
            <input
              type="text"
              name="customerName"
              value={customerData.customerName || ''}
              onChange={handleChange}
              required
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#5B49AD] placeholder:text-white/10 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA] flex items-center gap-2">
              <Phone size={14} className="text-[#5B49AD]" /> Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={customerData.phoneNumber || ''}
              onChange={handleChange}
              required
              placeholder="+91 98765 43210"
              className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#5B49AD] placeholder:text-white/10 transition-all"
            />
          </div>
        </div>

        {/* Email & Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA] flex items-center gap-2">
              <Mail size={14} className="text-[#5B49AD]" /> Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={customerData.email || ''}
              onChange={handleChange}
              required
              placeholder="rahul@brand.com"
              className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#5B49AD] placeholder:text-white/10 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA] flex items-center gap-2">
              <Building size={14} className="text-[#5B49AD]" /> Company / Brand Name
            </label>
            <input
              type="text"
              name="companyName"
              value={customerData.companyName || ''}
              onChange={handleChange}
              placeholder="Acme Media Corp"
              className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#5B49AD] placeholder:text-white/10 transition-all"
            />
          </div>
        </div>

        {/* Designation & Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA] flex items-center gap-2">
              <Briefcase size={14} className="text-[#5B49AD]" /> Designation / Role
            </label>
            <input
              type="text"
              name="designation"
              value={customerData.designation || ''}
              onChange={handleChange}
              placeholder="Marketing Director / Founder"
              className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#5B49AD] placeholder:text-white/10 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA] flex items-center gap-2">
              <MapPin size={14} className="text-[#5B49AD]" /> Billing / Base Address
            </label>
            <input
              type="text"
              name="address"
              value={customerData.address || ''}
              onChange={handleChange}
              placeholder="City, State / HQ Address"
              className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#5B49AD] placeholder:text-white/10 transition-all"
            />
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA] flex items-center gap-2">
            <FileText size={14} className="text-[#5B49AD]" /> Additional Notes / Special Instructions
          </label>
          <textarea
            name="notes"
            rows="3"
            value={customerData.notes || ''}
            onChange={handleChange}
            placeholder="Provide any specific instructions, campaign creative requests, or guidelines..."
            className="w-full bg-black/60 border border-white/10 rounded-2xl p-6 text-white text-sm focus:outline-none focus:border-[#5B49AD] placeholder:text-white/10 transition-all resize-none"
          />
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={onPrev}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-[#A1A1AA] hover:text-white hover:border-white/30 transition-all"
          >
            ← Back to Time Slot
          </button>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full sm:w-auto tech-button !bg-[#5B49AD] !text-white px-5 sm:px-8 py-3.5 sm:py-4 uppercase text-xs tracking-[0.15em] sm:tracking-[0.2em] font-bold shadow-[0_0_20px_rgba(91,73,173,0.4)] flex items-center justify-center gap-2 ${
              !isFormValid ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            Review Booking Summary <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
