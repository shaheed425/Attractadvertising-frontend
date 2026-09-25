import React from 'react';
import { Clock, ArrowRight, AlertCircle, CheckCircle2, Lock } from 'lucide-react';

export const TIME_SLOTS_DATA = [
  {
    id: 'slot-morning',
    name: 'Morning Prime Slot',
    timeRange: '09:00 AM – 01:00 PM',
    duration: '4 Hours',
    status: 'available',
    popular: false,
    tag: 'Office & Morning Commute Traffic',
  },
  {
    id: 'slot-afternoon',
    name: 'Afternoon Retail Slot',
    timeRange: '01:30 PM – 05:30 PM',
    duration: '4 Hours',
    status: 'available',
    popular: false,
    tag: 'Lunch & Mall Footfall',
  },
  {
    id: 'slot-evening',
    name: 'Evening Peak Hour Slot (6:00 PM Peak)',
    timeRange: '06:00 PM – 10:00 PM',
    duration: '4 Hours',
    status: 'available',
    popular: true,
    tag: '🔥 Main 6 PM Peak Impression Rush',
  },
  {
    id: 'slot-fullday',
    name: 'Full-Day All-Access Package',
    timeRange: '09:00 AM – 10:00 PM',
    duration: '13 Hours Full Day',
    status: 'available',
    popular: true,
    tag: 'Maximum Brand Dominance',
  },
];

export default function TimeSelector({ selectedTime, setSelectedTime, onNext, onPrev, dynamicTimeSlots }) {
  const activeSlots = dynamicTimeSlots && dynamicTimeSlots.length > 0 ? dynamicTimeSlots : TIME_SLOTS_DATA;
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#5B49AD] flex items-center justify-center gap-2">
          <Clock size={14} /> Step 4 of 7 — Time Slot Selection
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">
          Select Campaign Time Slot
        </h2>
        <p className="text-sm text-[#A1A1AA]">
          Choose an available operational time window. Booked slots are locked to prevent schedule conflicts.
        </p>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeSlots.map((slot) => {
          const slotName = slot.name || slot.title || slot.timeRange || 'Custom Time Slot';
          const slotTimeRange = slot.timeRange || slot.name || slot.title || '09:00 AM – 01:00 PM';
          const slotDuration = slot.duration || '4 Hours';
          const isBooked = slot.status === 'booked';
          const isSelected = (selectedTime === slotTimeRange || selectedTime === slotName) && !isBooked;

          return (
            <div
              key={slot.id}
              onClick={() => {
                if (!isBooked) {
                  setSelectedTime(slotTimeRange);
                }
              }}
              className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                isBooked
                  ? 'bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed'
                  : isSelected
                  ? 'bg-gradient-to-br from-[#5B49AD]/30 to-black border-[#5B49AD] shadow-[0_0_25px_rgba(91,73,173,0.4)] cursor-pointer scale-[1.01]'
                  : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 cursor-pointer'
              }`}
            >
              {/* Top Row: Name & Badges */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-black text-white uppercase tracking-tight">{slotName}</span>
                    {slot.popular && !isBooked && (
                      <span className="px-2 py-0.5 rounded-full bg-[#5B49AD] text-[8px] font-black uppercase text-white tracking-wider">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#A1A1AA]">{slot.tag || 'Standard Slot'}</p>
                </div>

                {isBooked ? (
                  <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase rounded-full flex items-center gap-1">
                    <Lock size={12} /> Booked
                  </span>
                ) : isSelected ? (
                  <CheckCircle2 size={22} className="text-[#5B49AD]" />
                ) : (
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase rounded-full">
                    Available
                  </span>
                )}
              </div>

              {/* Bottom Row: Time Range */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-2">
                <div className="flex items-center gap-2">
                  <Clock size={16} className={isBooked ? 'text-red-400' : 'text-[#5B49AD]'} />
                  <span className="text-base font-bold text-white tracking-wide">{slotTimeRange}</span>
                </div>
                <span className="text-xs text-[#A1A1AA] font-medium">{slotDuration}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Warning */}
      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3 text-xs text-[#A1A1AA]">
        <AlertCircle size={18} className="text-[#5B49AD] shrink-0" />
        <span>
          Slots marked as <strong className="text-red-400">Booked</strong> are currently reserved by existing clients for this date.
        </span>
      </div>

      {/* Action Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={onPrev}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-[#A1A1AA] hover:text-white hover:border-white/30 transition-all"
        >
          ← Back to Place
        </button>

        {selectedTime ? (
          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto tech-button !bg-[#5B49AD] !text-white px-8 py-4 uppercase text-xs tracking-[0.2em] font-bold shadow-[0_0_20px_rgba(91,73,173,0.4)] flex items-center justify-center gap-2"
          >
            Continue to Customer Details <ArrowRight size={16} />
          </button>
        ) : (
          <p className="text-xs text-[#A1A1AA]/60 font-semibold italic">Please select an available time slot to proceed</p>
        )}
      </div>
    </div>
  );
}
