import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Quote, ChevronRight, Check } from 'lucide-react';

export default function PremiumAddOns() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/services');
        setServices(data.filter(s => s.isPremium));
      } catch (error) {
        console.error('Error fetching premium addons:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading || services.length === 0) return null;

  // Dynamic grouping by prefix (A., B., C., etc.)
  const groupedServices = services.reduce((acc, service) => {
    const match = service.title.match(/^([A-Z])\.\s*(.*)/);
    if (match) {
      const prefix = match[1];
      if (!acc[prefix]) acc[prefix] = [];
      acc[prefix].push({ ...service, displayTitle: match[2] });
    } else {
      if (!acc['standard']) acc['standard'] = [];
      acc['standard'].push(service);
    }
    return acc;
  }, {});

  const prefixes = Object.keys(groupedServices).filter(k => k !== 'standard').sort();
  const standardServices = groupedServices['standard'] || [];

  return (
    <section className="py-32 bg-black px-6 relative overflow-hidden" id="addons">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* PRE-HEADER */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <span className="text-[#A1A1AA]/40 font-bold uppercase tracking-[0.5em] text-[10px] mb-6 block">Maximize Your Reach</span>
          <h2 className="text-5xl md:text-8xl font-display font-black tracking-tighter text-[#A1A1AA] leading-none mb-8">
            PREMIUM <span className="text-[#A1A1AA]/40">ADD-ONS.</span>
          </h2>
          <p className="text-[#A1A1AA]/60 max-w-2xl text-lg leading-relaxed lowercase italic font-medium">
            (Optional Services)
          </p>
        </motion.div>

        {/* Dynamic Prefixed Sections (A, B, C...) */}
        {prefixes.map((prefix) => (
          <div key={prefix} className="mb-40">
            {groupedServices[prefix].map((service) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start"
              >
                <div className="lg:col-span-5 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-5xl md:text-7xl font-display font-black text-[#A1A1AA] leading-tight uppercase tracking-tighter">
                      <span className="text-primary">{prefix}.</span> {service.displayTitle}
                    </h3>
                    <p className="text-[#A1A1AA] font-bold text-lg">{service.price}</p>
                  </div>
                  <p className="text-[#A1A1AA]/60 font-bold text-xl leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="pt-10 flex flex-col gap-4">
                    <span className="text-[#A1A1AA]/40 text-[10px] font-black uppercase tracking-[0.4em]">Section Branding</span>
                    <div className="text-primary font-display font-black text-4xl opacity-10 tracking-tighter uppercase">ATTRACT<br />ADVERTISING</div>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-[4rem] p-12 md:p-16 shadow-2xl relative overflow-hidden group/box transition-all duration-700 hover:border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover/box:opacity-100 transition-opacity duration-1000" />
                  
                  <div className="space-y-12 relative z-10">
                    {service.details && service.details.map((detail, dIndex) => (
                      <div key={dIndex} className="group/item">
                        <div className="flex items-start gap-6">
                            <div className="mt-1 p-1 bg-white/5 rounded-lg text-[#A1A1AA]/60 group-hover/item:bg-primary group-hover/item:text-white transition-all duration-500">
                              <Check size={16} strokeWidth={4} />
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-[#A1A1AA] font-display font-black text-2xl tracking-tight group-hover/item:text-primary transition-colors">
                                {detail.label}
                              </h4>
                              <p className="text-[#A1A1AA]/60 leading-relaxed font-medium">
                                {detail.content}
                              </p>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-16 pt-8 border-t border-white/10 text-center relative z-10">
                    <span className="text-[#A1A1AA]/20 font-black uppercase tracking-[0.5em] text-[10px]">BE SEEN. EVERYWHERE.</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}

        {/* Standard Catch-all (if any) */}
        {standardServices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
            {standardServices.map((item, i) => (
              <motion.div
                key={item._id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[3rem] bg-white/5 border border-white/10 hover:border-primary transition-all group shadow-2xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-display font-black text-[#A1A1AA] group-hover:text-primary transition-colors tracking-tight uppercase leading-tight">{item.title}</h3>
                  <span className="text-primary font-bold text-lg whitespace-nowrap ml-4">{item.price}</span>
                </div>
                <p className="text-[#A1A1AA]/60 text-sm leading-relaxed italic font-medium">"{item.description}"</p>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
