import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserCheck, FileText, Zap, Video } from 'lucide-react';

const icons = {
  UserCheck,
  FileText,
  Zap,
  Video
};

export default function IncludedServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/services');
        setServices(data.filter(s => !s.isPremium));
      } catch (error) {
        console.error('Error fetching included services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading || services.length === 0) return null;

  return (
    <section className="py-32 bg-black px-6 relative overflow-hidden" id="included">
      <div className="absolute inset-0 z-0 bg-grid opacity-20 pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col items-center">
          {/* Main Content */}
          <div className="w-full max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-[#A1A1AA] uppercase mb-2">
                WHAT IS INCLUDED?
              </h2>
              <p className="text-[#A1A1AA]/60 font-bold text-lg mb-4">(Free with every booking)</p>
              <p className="text-[#A1A1AA]/40 mx-auto max-w-md font-medium">
                When you book the core package, you get these 4 services at no extra cost:
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
              {services.map((service, i) => {
                const Icon = icons[service.icon] || UserCheck;
                return (
                  <motion.div
                    key={service._id || i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col gap-3 p-8 rounded-3xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Icon size={20} />
                      </div>
                      <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-[#A1A1AA]/40 font-medium leading-relaxed">
                      {service.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* White Wavy Divider at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 h-24">
         <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-full text-white opacity-20">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,-1.32,1200,34.75V0Z" fill="currentColor"></path>
         </svg>
      </div>
    </section>
  );
}
