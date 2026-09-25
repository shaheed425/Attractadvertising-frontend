import React, { useState } from 'react';
import { MapPin, Search, CheckCircle2, ArrowRight } from 'lucide-react';

export const DISTRICTS_LIST = [
  { id: 'ernakulam', name: 'Ernakulam (Kochi)', code: 'EKM', tag: 'High Commercial Demand', popularity: 'Hotspot' },
  { id: 'trivandrum', name: 'Thiruvananthapuram', code: 'TVM', tag: 'Capital & IT Hub', popularity: 'Trending' },
  { id: 'kozhikode', name: 'Kozhikode', code: 'CLT', tag: 'Malabar Retail Center', popularity: 'High Footfall' },
  { id: 'thrissur', name: 'Thrissur', code: 'TCR', tag: 'Cultural & Shopping Hub', popularity: 'Popular' },
  { id: 'kannur', name: 'Kannur', code: 'CAN', tag: 'Northern Coastal Commercial', popularity: 'Active' },
  { id: 'kottayam', name: 'Kottayam', code: 'KTYM', tag: 'Central Commercial Center', popularity: 'Active' },
  { id: 'palakkad', name: 'Palakkad', code: 'PKD', tag: 'Industrial Corridor', popularity: 'Active' },
  { id: 'malappuram', name: 'Malappuram', code: 'MPM', tag: 'High-Density Consumer Base', popularity: 'High Footfall' },
  { id: 'alappuzha', name: 'Alappuzha', code: 'ALP', tag: 'Tourist & Local Markets', popularity: 'Active' },
  { id: 'kollam', name: 'Kollam', code: 'QLN', tag: 'Southern Port & Retail', popularity: 'Active' },
  { id: 'wayanad', name: 'Wayanad', code: 'WYD', tag: 'High-End Tourism Zone', popularity: 'Niche' },
  { id: 'kasaragod', name: 'Kasaragod', code: 'KSGD', tag: 'Northern Gateway', popularity: 'Active' },
  { id: 'pathanamthitta', name: 'Pathanamthitta', code: 'PTA', tag: 'Pilgrim & Residential', popularity: 'Active' },
  { id: 'idukki', name: 'Idukki', code: 'IDK', tag: 'Hill Station & Resort Areas', popularity: 'Niche' },
  { id: 'bangalore', name: 'Bengaluru Metro', code: 'BLR', tag: 'Interstate Tech Hub', popularity: 'Metro Special' },
];

export default function DistrictSelector({ selectedDistrict, setSelectedDistrict, onNext, onPrev }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDistricts = DISTRICTS_LIST.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#5B49AD] flex items-center justify-center gap-2">
          <MapPin size={14} /> Step 2 of 7 — District Selection
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">
          Select Target District
        </h2>
        <p className="text-sm text-[#A1A1AA]">
          Choose the primary district where your mobile screen campaign will be deployed.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" size={18} />
        <input
          type="text"
          placeholder="Search district name or code (e.g. Ernakulam, Kozhikode, EKM)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-black/60 border border-white/15 rounded-2xl pl-12 pr-6 py-4 text-white placeholder:text-[#A1A1AA]/40 focus:outline-none focus:border-[#5B49AD] transition-all text-sm"
        />
      </div>

      {/* District Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDistricts.map((item) => {
          const isSelected = selectedDistrict === item.name;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedDistrict(item.name)}
              className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-[#5B49AD]/30 to-black border-[#5B49AD] shadow-[0_0_25px_rgba(91,73,173,0.4)] scale-[1.02]'
                  : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#5B49AD]">
                    {item.code}
                  </span>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">{item.name}</h3>
                </div>
                {isSelected && <CheckCircle2 size={20} className="text-[#5B49AD]" />}
              </div>

              <div className="space-y-2">
                <p className="text-xs text-[#A1A1AA]">{item.tag}</p>
                <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-wider text-white/70">
                  ⚡ {item.popularity}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={onPrev}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-[#A1A1AA] hover:text-white hover:border-white/30 transition-all"
        >
          ← Back to Date
        </button>

        {selectedDistrict ? (
          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto tech-button !bg-[#5B49AD] !text-white px-8 py-4 uppercase text-xs tracking-[0.2em] font-bold shadow-[0_0_20px_rgba(91,73,173,0.4)] flex items-center justify-center gap-2"
          >
            Continue to Place Selection <ArrowRight size={16} />
          </button>
        ) : (
          <p className="text-xs text-[#A1A1AA]/60 font-semibold italic">Please select a district to proceed</p>
        )}
      </div>
    </div>
  );
}
