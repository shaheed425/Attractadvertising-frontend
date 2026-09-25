import React from 'react';
import { Calendar as CalendarIcon, Sparkles, CheckCircle2, Tv, Minus, Plus } from 'lucide-react';

export default function DateSelector({
  date,
  setDate,
  preferredDate,
  setPreferredDate,
  screenCount = 1,
  setScreenCount,
  onNext,
}) {
  const today = new Date().toISOString().split('T')[0];

  // Quick select options (Today, Tomorrow, This Weekend, Next Week)
  const getQuickDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  };

  const quickDates = [
    { label: 'Tomorrow', dateVal: getQuickDate(1) },
    { label: 'In 3 Days', dateVal: getQuickDate(3) },
    { label: 'In 1 Week', dateVal: getQuickDate(7) },
    { label: 'In 2 Weeks', dateVal: getQuickDate(14) },
  ];

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return 'No date selected';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#5B49AD] flex items-center justify-center gap-2">
          <CalendarIcon size={14} /> Step 1 of 7 — Date & Screen Selection
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">
          Campaign Date & Screen Count
        </h2>
        <p className="text-sm text-[#A1A1AA]">
          Select your execution date and the number of walking billboard screens to deploy.
        </p>
      </div>

      {/* Date Pickers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Date */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-xl space-y-4">
          <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
            <Sparkles size={14} className="text-[#5B49AD]" /> Primary Execution Date *
          </label>
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-black/60 border border-white/15 rounded-2xl px-6 py-4 text-white text-base focus:outline-none focus:border-[#5B49AD] transition-all cursor-pointer"
          />
          <p className="text-xs text-[#A1A1AA]/60">
            Select the exact date you wish to deploy the advertising backpacks.
          </p>
        </div>

        {/* Alternate / Preferred Secondary Date */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-xl space-y-4">
          <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA] flex items-center gap-2">
            Alternative / Preferred Backup Date (Optional)
          </label>
          <input
            type="date"
            min={today}
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            className="w-full bg-black/60 border border-white/15 rounded-2xl px-6 py-4 text-white text-base focus:outline-none focus:border-[#5B49AD] transition-all cursor-pointer"
          />
          <p className="text-xs text-[#A1A1AA]/60">
            Secondary option in case weather or high-demand slot adjustments are required.
          </p>
        </div>
      </div>

      {/* Screen Count Selection Box */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5B49AD]">
              SCREEN CAPACITY SELECTION
            </span>
            <h3 className="text-xl font-bold text-white uppercase mt-1 flex items-center gap-2">
              <Tv className="text-[#5B49AD]" /> How Many Screens Do You Need?
            </h3>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              Select the number of walking billboard LED screens (Default = 1 Screen). Price updates automatically.
            </p>
          </div>

          {/* Stepper Counter Controls */}
          {setScreenCount && (
            <div className="flex items-center gap-2 bg-black/60 border border-white/10 p-2 rounded-2xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setScreenCount(Math.max(1, screenCount - 1))}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-[#5B49AD] transition-all flex items-center justify-center disabled:opacity-30"
                disabled={screenCount <= 1}
              >
                <Minus size={16} />
              </button>
              <div className="px-4 text-center">
                <span className="text-xl font-black text-white font-mono">{screenCount}</span>
                <span className="block text-[9px] text-[#A1A1AA] uppercase font-bold">
                  {screenCount === 1 ? 'Screen' : 'Screens'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setScreenCount(Math.min(10, screenCount + 1))}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-[#5B49AD] transition-all flex items-center justify-center"
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Quick Screen Count Selectors (1, 2, 3, 4 Screens) */}
        {setScreenCount && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((count) => {
              const isSelected = screenCount === count;
              const screenTotal = 4000 * count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setScreenCount(count)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#5B49AD]/30 to-black border-[#5B49AD] shadow-[0_0_25px_rgba(91,73,173,0.4)] scale-[1.02]'
                      : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-white tracking-wider">
                      {count} {count === 1 ? 'Screen' : 'Screens'}
                    </span>
                    {isSelected && <CheckCircle2 size={16} className="text-[#5B49AD]" />}
                  </div>
                  <div className="mt-3">
                    <span className="text-lg font-black text-white font-mono">₹{screenTotal.toLocaleString()}</span>
                    <p className="text-[10px] text-[#A1A1AA] uppercase font-bold mt-0.5">
                      {count === 1 ? 'Standard Coverage' : `${count}x Multiplier`}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Select Buttons */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">Quick Select Dates</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickDates.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setDate(item.dateVal)}
              className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                date === item.dateVal
                  ? 'bg-[#5B49AD] border-[#5B49AD] text-white shadow-[0_0_15px_rgba(91,73,173,0.5)]'
                  : 'bg-white/5 border-white/10 text-[#A1A1AA] hover:border-white/30 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Date Preview Card */}
      {date && (
        <div className="bg-gradient-to-r from-[#5B49AD]/20 via-black/80 to-[#5B49AD]/10 border border-[#5B49AD]/40 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#5B49AD]/30 border border-[#5B49AD]/50 flex items-center justify-center text-[#5B49AD]">
              <CheckCircle2 size={24} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5B49AD]">Selected Date</p>
              <h4 className="text-lg md:text-xl font-display font-bold text-white uppercase">{formatDateDisplay(date)}</h4>
              {preferredDate && (
                <p className="text-xs text-[#A1A1AA]">Backup: {formatDateDisplay(preferredDate)}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onNext}
            className="w-full md:w-auto tech-button !bg-[#5B49AD] !text-white px-8 py-4 uppercase text-xs tracking-[0.2em] font-bold shadow-[0_0_20px_rgba(91,73,173,0.4)]"
          >
            Continue to District Select →
          </button>
        </div>
      )}
    </div>
  );
}
