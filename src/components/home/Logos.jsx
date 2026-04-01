import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { motion } from 'framer-motion';

export default function Logos() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/logos`);
        setLogos(response.data);
      } catch (err) {
        console.error("API Fetch Failed (Logos):", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogos();
  }, []);

  // Show a placeholder if loading or empty so the user knows where it is
  if (loading) {
    return (
      <div className="py-20 bg-black text-center text-white/5 text-[10px] font-black uppercase tracking-[1em]">
        Initializing Partner Network...
      </div>
    );
  }

  // Prepare at least 12 slots for the grid layout
  const gridLogos = [...logos];
  while (gridLogos.length < 12) {
    gridLogos.push({ _id: `empty-${gridLogos.length}`, isPlaceholder: true });
  }
  const logosToDisplay = gridLogos;

  return (
    <section className="py-32 bg-black overflow-hidden" id="partners">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#A1A1AA]/20 text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] md:tracking-[1em] block"
          >
            Global Partner Network
          </motion.span>
        </div>

        <div className="grid grid-rows-2 grid-flow-col gap-[1px] overflow-x-auto pb-8 custom-scrollbar">
          {logosToDisplay.map((logo, i) => (
            <motion.div
              key={logo._id || i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: (i % 6) * 0.05 }}
              className="relative w-[180px] md:w-[220px] aspect-[16/10] flex-shrink-0 flex items-center justify-center border border-white/5 bg-white/[0.01] rounded-2xl group hover:bg-white/[0.03] hover:border-transparent transition-all duration-300"
            >
              {/* Corner Marker (Bottom-Right) - Minimal grey */}
              <div className="absolute -right-[3px] -bottom-[3px] w-[6px] h-[6px] bg-white/5 group-hover:bg-white/20 rounded-full z-20 transition-all duration-500" />
              
              {/* If it's the very first cell, add top-left marker too */}
              {i === 0 && (
                 <div className="absolute -left-[3px] -top-[3px] w-[6px] h-[6px] bg-white/5 rounded-full z-20" />
              )}

              <div className="p-8 md:p-6 w-full h-full flex items-center justify-center">
                {!logo.isPlaceholder ? (
                  <div className="flex flex-col items-center gap-3 group/item text-center">
                    {logo.logoUrl && (
                      <img 
                        src={logo.logoUrl.startsWith('http') ? logo.logoUrl : `${API_URL}${logo.logoUrl}`} 
                        alt={logo.clientName} 
                        className="max-h-12 md:max-h-14 w-auto object-contain opacity-70 grayscale group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-700 invert group-hover/item:scale-110"
                      />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover/item:text-white/60 transition-colors">
                      {logo.clientName}
                    </span>
                  </div>
                ) : (
                  <div className="w-12 h-[1px] bg-white/5 rounded-full opacity-50" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  ); 
}
