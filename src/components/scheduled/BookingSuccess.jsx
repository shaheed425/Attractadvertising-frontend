import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Calendar, MapPin, Clock, User, ShieldCheck, Home, Download, Sparkles } from 'lucide-react';

export default function BookingSuccess({ bookingResult }) {
  const navigate = useNavigate();

  const {
    bookingId = 'ATT-SCH-84920',
    customerName,
    date,
    district,
    place,
    timeSlot,
    totalAmount = 4999,
    paymentStatus = 'Pending Verification',
  } = bookingResult || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto py-8">
      {/* Success Card */}
      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl space-y-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#5B49AD]/20 via-transparent to-transparent pointer-events-none" />

        {/* Animated Check Icon */}
        <div className="relative z-10">
          <div className="w-24 h-24 rounded-full bg-[#5B49AD]/20 border-2 border-[#5B49AD] flex items-center justify-center mx-auto text-white shadow-[0_0_40px_rgba(91,73,173,0.8)] animate-pulse">
            <CheckCircle2 size={48} strokeWidth={2.5} className="text-white" />
          </div>

          <div className="mt-6 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5B49AD] flex items-center justify-center gap-2">
              <Sparkles size={14} /> CONFIRMATION RECEIPT
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tight">
              Booking Request Submitted Successfully
            </h2>
            <p className="text-sm text-[#A1A1AA] max-w-lg mx-auto italic">
              "Your scheduled booking request has been submitted successfully. Our team will review the payment and confirm your booking shortly."
            </p>
          </div>
        </div>

        {/* Reference ID Pill */}
        <div className="inline-block bg-black/60 border border-white/10 px-6 py-3 rounded-full relative z-10">
          <span className="text-xs text-[#A1A1AA] font-bold uppercase tracking-widest mr-2">REFERENCE ID:</span>
          <span className="text-base font-mono font-black text-[#5B49AD] tracking-wider">{bookingId}</span>
        </div>

        {/* Details Breakdown */}
        <div className="bg-black/50 border border-white/10 p-6 rounded-3xl text-left space-y-4 relative z-10">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#5B49AD] border-b border-white/10 pb-3 flex items-center gap-2">
            <ShieldCheck size={16} /> Campaign Execution Summary
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-[#A1A1AA] font-bold uppercase tracking-wider text-[10px]">Customer Name</p>
              <p className="text-white font-bold text-sm mt-0.5">{customerName || 'N/A'}</p>
            </div>

            <div>
              <p className="text-[#A1A1AA] font-bold uppercase tracking-wider text-[10px]">Payment Verification</p>
              <span className="inline-block px-2.5 py-0.5 mt-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold uppercase rounded-full text-[10px]">
                ⏳ {paymentStatus}
              </span>
            </div>

            <div>
              <p className="text-[#A1A1AA] font-bold uppercase tracking-wider text-[10px]">Scheduled Date</p>
              <p className="text-white font-bold text-sm mt-0.5 flex items-center gap-1.5">
                <Calendar size={14} className="text-[#5B49AD]" /> {date}
              </p>
            </div>

            <div>
              <p className="text-[#A1A1AA] font-bold uppercase tracking-wider text-[10px]">Time Window</p>
              <p className="text-white font-bold text-sm mt-0.5 flex items-center gap-1.5">
                <Clock size={14} className="text-[#5B49AD]" /> {timeSlot}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-[#A1A1AA] font-bold uppercase tracking-wider text-[10px]">Target Location</p>
              <p className="text-white font-bold text-sm mt-0.5 flex items-center gap-1.5">
                <MapPin size={14} className="text-[#5B49AD]" /> {place}, {district}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 relative z-10">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto tech-button !bg-[#5B49AD] !text-white px-8 py-4 uppercase text-xs tracking-[0.2em] font-bold shadow-[0_0_20px_rgba(91,73,173,0.5)] flex items-center justify-center gap-2"
          >
            <Home size={16} /> Back to Home
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Download size={16} /> View / Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
