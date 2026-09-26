import React from 'react';
import { Calendar, MapPin, Navigation, Clock, User, Building, Edit3, ArrowRight, ShieldCheck, Tag, Tv } from 'lucide-react';

export default function BookingSummaryCard({ bookingData, onEdit, onProceedToPayment }) {
  const { date, preferredDate, district, place, timeSlot, screenCount = 1, basePricePerScreen = 4000, customerName, companyName, email, phoneNumber, totalAmount } = bookingData;

  const formatDateStr = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#5B49AD] flex items-center justify-center gap-2">
          <ShieldCheck size={14} /> Step 6 of 7 — Booking Review
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">
          Review Booking Details
        </h2>
        <p className="text-sm text-[#A1A1AA]">
          Please review your scheduled campaign parameters before proceeding to coupon application & payment.
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5B49AD]/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Top Header & Edit Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5B49AD]">
              SCHEDULED ADVERTISING CAMPAIGN
            </span>
            <h3 className="text-2xl font-display font-bold text-white uppercase mt-1">Summary Specification</h3>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-xs font-bold uppercase tracking-wider text-white hover:border-[#5B49AD] hover:bg-[#5B49AD]/20 transition-all self-start sm:self-auto"
          >
            <Edit3 size={14} /> Edit Details
          </button>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Schedule & Location */}
          <div className="space-y-6 bg-black/40 p-6 rounded-3xl border border-white/5">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#5B49AD] flex items-center gap-2">
              <Calendar size={14} /> Deployment Schedule & Spot
            </h4>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-[#5B49AD] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">Selected Date</p>
                  <p className="text-white font-bold">{formatDateStr(date)}</p>
                  {preferredDate && <p className="text-xs text-[#A1A1AA]">Backup: {formatDateStr(preferredDate)}</p>}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={18} className="text-[#5B49AD] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">Time Window</p>
                  <p className="text-white font-bold">{timeSlot}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Tv size={18} className="text-[#5B49AD] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">Screen Count</p>
                  <p className="text-white font-bold">{screenCount} {screenCount === 1 ? 'Screen' : 'Screens'} ({screenCount}x Multiplier)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#5B49AD] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">Target District</p>
                  <p className="text-white font-bold">{district}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Navigation size={18} className="text-[#5B49AD] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">Location / Spot</p>
                  <p className="text-white font-bold">{place}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Billing */}
          <div className="space-y-6 bg-black/40 p-6 rounded-3xl border border-white/5">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#5B49AD] flex items-center gap-2">
              <User size={14} /> Client Details
            </h4>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <User size={18} className="text-[#5B49AD] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">Contact Person</p>
                  <p className="text-white font-bold">{customerName}</p>
                  <p className="text-xs text-[#A1A1AA]">{phoneNumber} • {email}</p>
                </div>
              </div>

              {companyName && (
                <div className="flex items-start gap-3">
                  <Building size={18} className="text-[#5B49AD] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">Company / Brand</p>
                    <p className="text-white font-bold">{companyName}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Tag size={18} className="text-[#5B49AD] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">Included Deliverables</p>
                  <p className="text-white text-xs leading-relaxed font-medium">
                    {screenCount} Active Dual HD LED Backpack Screens + GPS Footfall Tracking + Live Video Proof of Execution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Total Box */}
        <div className="bg-gradient-to-r from-[#5B49AD]/20 via-black to-[#5B49AD]/20 border border-[#5B49AD]/50 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5B49AD]">TOTAL BOOKING FEE</span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl md:text-5xl font-display font-black text-white">
                ₹{totalAmount?.toLocaleString() || '4,000'}
              </span>
              <span className="text-xs text-[#A1A1AA] font-semibold uppercase tracking-wider">
                ({screenCount} {screenCount === 1 ? 'Screen' : 'Screens'} × ₹{basePricePerScreen.toLocaleString()})
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button
              type="button"
              onClick={onEdit}
              className="w-full sm:w-auto px-6 py-4 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest text-[#A1A1AA] hover:text-white hover:border-white/40 transition-all text-center"
            >
              Edit Details
            </button>

            <button
              type="button"
              onClick={onProceedToPayment}
              className="w-full sm:w-auto tech-button !bg-[#5B49AD] !text-white px-5 sm:px-8 py-3.5 sm:py-4 uppercase text-xs tracking-[0.15em] sm:tracking-[0.2em] font-bold shadow-[0_0_25px_rgba(91,73,173,0.5)] flex items-center justify-center gap-2 cursor-pointer"
            >
              Continue to Payment & Coupons <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

