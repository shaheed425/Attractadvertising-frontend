import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/services`);
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading || services.length === 0) return null;

  return (
    <section className="py-32 bg-[#0a0a0a] px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -mr-100 -mt-100 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-bold uppercase tracking-[0.4em] text-xs mb-6 block">Our Solutions</span>
              <h2 className="text-5xl md:text-8xl font-display font-black tracking-tighter text-white leading-[0.9]">
                We Provide Solutions <br /> <span className="text-primary">That Work.</span>
              </h2>
            </motion.div>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-textMuted max-w-sm leading-relaxed"
          >
            Our strategic approach to design and development ensures we deliver digital products that are not just beautiful, but also robust and scalable.
          </motion.p>
        </div>

        <div className="flex flex-col">
          {services.map((service, i) => (
            <motion.a
              key={service._id || i}
              href="#"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group relative py-12 md:py-16 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 transition-all duration-700"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-[0.22, 1, 0.36, 1]" />

              <div className="flex items-center gap-12 md:gap-20 flex-1 relative z-10">
                <span className="text-2xl md:text-3xl font-display font-black text-primary/20 group-hover:text-primary transition-colors duration-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex flex-col gap-6">
                  <h3 className="text-4xl md:text-7xl font-display font-black text-white/90 group-hover:text-white transition-all duration-500 transform group-hover:translate-x-4">
                    {service.title}<span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-2">.</span>
                  </h3>
                  <div className="flex flex-wrap gap-4 group-hover:translate-x-4 transition-transform duration-500 bg-black/40 backdrop-blur-sm p-3 w-fit rounded-lg">
                    {service.description.split(',').map(tag => (
                      <span key={tag} className="text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-primary transition-colors">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:text-primary group-hover:border-primary group-hover:bg-primary/5 transition-all duration-700 group-hover:rotate-45 scale-75 group-hover:scale-100">
                  <ArrowUpRight size={32} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
