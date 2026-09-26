import React, { useState } from 'react';
import { MapPin, Navigation, ArrowRight, CheckCircle2 } from 'lucide-react';

const PLACES_DATABASE = {
  'Ernakulam (Kochi)': [
    { name: 'Lulu Mall & Edapally Junction', footfall: 'Very High (100k+/day)', type: 'Shopping & Transit' },
    { name: 'Marine Drive & Shanmugham Road', footfall: 'High (80k+/day)', type: 'Promenade & Commercial' },
    { name: 'MG Road & Maharajas Metro Corridor', footfall: 'High (75k+/day)', type: 'Retail & Metro Hub' },
    { name: 'Kakkanad InfoPark & SmartCity Area', footfall: 'High (60k IT Pros)', type: 'Tech Park Zone' },
    { name: 'Vytilla Mobility Hub & Flyover Junction', footfall: 'Extreme (150k+/day)', type: 'Major Transit Hub' },
    { name: 'Fort Kochi Beach & Promenade', footfall: 'High Tourist Footfall', type: 'Tourism & Events' },
    { name: 'Panampilly Nagar Avenue', footfall: 'Medium-High', type: 'Luxury Shopping & Cafes' },
  ],
  'Thiruvananthapuram': [
    { name: 'Technopark Campus Phase 1 & 3 Gate', footfall: 'Very High (70k IT)', type: 'Tech Hub' },
    { name: 'East Fort & Chalai Market Road', footfall: 'Extreme (120k+/day)', type: 'Heritage Retail' },
    { name: 'Kowdiar & Vellayambalam Corridor', footfall: 'High Traffic', type: 'Premium Residential' },
    { name: 'Lulu Mall Akkulam Highway', footfall: 'High Footfall', type: 'Shopping & Dining' },
    { name: 'Kilmangalam & Kazhakkoottam Junction', footfall: 'High Traffic', type: 'Commercial Highway' },
  ],
  'Kozhikode': [
    { name: 'Calicut Beach Promenade & Pier', footfall: 'Very High Evening', type: 'Leisure & Dining' },
    { name: 'Mavoor Road & KSRTC Terminal', footfall: 'High (90k+/day)', type: 'Transit & Malls' },
    { name: 'Focus Mall & Rajaji Road', footfall: 'High Commercial', type: 'Retail Core' },
    { name: 'Cyberpark & Hilite City Area', footfall: 'High IT & Youth', type: 'Modern Urban Hub' },
  ],
  'Thrissur': [
    { name: 'Swaraj Round & Round South/North', footfall: 'Extreme (130k+/day)', type: 'City Center Loop' },
    { name: 'M.G. Road & Thrissur Trade Center', footfall: 'High Retail', type: 'Commercial Shopping' },
    { name: 'Sakthan Thampuran Bus Stand', footfall: 'High Transit', type: 'Transport Hub' },
  ],
};

const DEFAULT_PLACES = [
  { name: 'Central City Market & Shopping Hub', footfall: 'High Footfall', type: 'Commercial Zone' },
  { name: 'Main Transit / Bus Terminal Junction', footfall: 'Very High Footfall', type: 'Transport Hub' },
  { name: 'IT Park / Business District Gate', footfall: 'Corporate Footfall', type: 'Business Zone' },
  { name: 'Beach / Lake Promenade Corridor', footfall: 'Evening Footfall', type: 'Leisure & Events' },
  { name: 'Prime Shopping Street & Metro Junction', footfall: 'Dense Pedestrian', type: 'Retail Belt' },
];

export default function PlaceSelector({ selectedDistrict, selectedPlace, setSelectedPlace, onNext, onPrev }) {
  const places = PLACES_DATABASE[selectedDistrict] || DEFAULT_PLACES;
  const [customPlace, setCustomPlace] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const handleSelectPlace = (placeName) => {
    setIsCustom(false);
    setSelectedPlace(placeName);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customPlace.trim()) {
      setIsCustom(true);
      setSelectedPlace(customPlace.trim());
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#5B49AD] flex items-center justify-center gap-2">
          <Navigation size={14} /> Step 3 of 7 — Location / Place Selection
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">
          Select Campaign Location
        </h2>
        <p className="text-sm text-[#A1A1AA]">
          Target locations inside <span className="text-white font-bold">{selectedDistrict || 'Selected District'}</span>.
        </p>
      </div>

      {/* Suggested Places List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
          Recommended High-Footfall Places in {selectedDistrict}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {places.map((place, idx) => {
            const isSelected = selectedPlace === place.name && !isCustom;
            return (
              <div
                key={idx}
                onClick={() => handleSelectPlace(place.name)}
                className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#5B49AD]/30 to-black border-[#5B49AD] shadow-[0_0_25px_rgba(91,73,173,0.4)] scale-[1.01]'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-base font-bold text-white uppercase tracking-tight">{place.name}</h4>
                  {isSelected && <CheckCircle2 size={18} className="text-[#5B49AD]" />}
                </div>

                <div className="flex items-center gap-3 text-xs text-[#A1A1AA]/80 mt-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold uppercase text-[#5B49AD]">
                    {place.type}
                  </span>
                  <span>📍 {place.footfall}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Location Input */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
          <MapPin size={14} className="text-[#5B49AD]" /> Need a Specific Landmark or Custom Street?
        </h4>
        <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Type custom landmark/street address (e.g., Near Oberon Mall Highway Entrance)..."
            value={customPlace}
            onChange={(e) => setCustomPlace(e.target.value)}
            className="flex-1 bg-black/60 border border-white/15 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#5B49AD] placeholder:text-[#A1A1AA]/40"
          />
          <button
            type="submit"
            className="px-6 py-4 bg-[#5B49AD] text-white text-xs font-bold uppercase tracking-wider rounded-2xl hover:bg-[#5B49AD]/90 transition-all shadow-md"
          >
            Use Custom Location
          </button>
        </form>
      </div>

      {/* Selection Confirmation Bar */}
      {selectedPlace && (
        <div className="bg-gradient-to-r from-black via-[#5B49AD]/20 to-black border border-[#5B49AD]/40 p-5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-[#5B49AD]" />
            <span className="text-xs text-white font-medium">
              Selected Spot: <strong className="text-white uppercase font-bold">{selectedPlace}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Action Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={onPrev}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-[#A1A1AA] hover:text-white hover:border-white/30 transition-all"
        >
          ← Back to District
        </button>

        {selectedPlace ? (
          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto tech-button !bg-[#5B49AD] !text-white px-5 sm:px-8 py-3.5 sm:py-4 uppercase text-xs tracking-[0.15em] sm:tracking-[0.2em] font-bold shadow-[0_0_20px_rgba(91,73,173,0.4)] flex items-center justify-center gap-2"
          >
            Continue to Time Selection <ArrowRight size={16} />
          </button>
        ) : (
          <p className="text-xs text-[#A1A1AA]/60 font-semibold italic">Please select a location to proceed</p>
        )}
      </div>
    </div>
  );
}
