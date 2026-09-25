import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Sparkles, MessageSquare, Building2, User } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config';
import { getStoredTestimonials } from '../admin/TestimonialManager';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(getStoredTestimonials());

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/testimonials`);
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        }
      } catch (err) {
        console.warn('Frontend testimonials API fetch fallback:', err);
      }
    };
    fetchTestimonials();
  }, []);

  const displayList = testimonials.filter((t) => t.isFeatured !== false);

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-black font-body">
      {/* Grid background & purple blur glow */}
      <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#5B49AD]/10 blur-[150px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto mb-16 text-center space-y-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#5B49AD] flex items-center justify-center gap-2">
          <Sparkles size={14} /> CLIENT TESTIMONIALS & REVIEWS
        </span>
        <h2 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
          Real Impact<span className="text-[#5B49AD]">.</span> Verified Results<span className="text-white opacity-30">.</span>
        </h2>
        <p className="text-sm md:text-base text-[#A1A1AA] max-w-2xl mx-auto font-medium">
          See how leading enterprise brands and event organizers dominate street footfall using Attract’s walking billboard backpack screens.
        </p>
      </div>

      {/* Static Responsive Grid Container (No Auto-Scroll) */}
      <div className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayList.map((item, index) => (
            <motion.div
              key={item.id || item._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 md:p-8 rounded-[2.5rem] flex flex-col justify-between space-y-6 relative overflow-hidden group border border-white/10 hover:border-[#5B49AD]/60 hover:shadow-[0_0_30px_rgba(91,73,173,0.2)] transition-all duration-500"
            >
              {/* Background Quote Watermark Icon */}
              <Quote
                size={100}
                className="absolute -right-4 -bottom-4 text-white/[0.03] group-hover:text-[#5B49AD]/10 transition-colors pointer-events-none"
              />

              <div className="space-y-4 relative z-10">
                {/* Rating Stars & Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  <span className="text-[9px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 font-bold uppercase tracking-widest flex items-center gap-1">
                    <MessageSquare size={10} className="text-[#5B49AD]" /> VERIFIED REVIEW
                  </span>
                </div>

                {/* Testimonial Quote Text */}
                <p className="text-xs md:text-sm text-white/80 leading-relaxed font-medium italic">
                  "{item.reviewText}"
                </p>
              </div>

              {/* Client Info Footer */}
              <div className="flex items-center gap-4 pt-4 border-t border-white/10 relative z-10">
                <img
                  src={
                    item.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={item.clientName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#5B49AD] shadow-md group-hover:scale-105 transition-transform"
                />
                <div className="truncate">
                  <h4 className="text-sm font-bold text-white uppercase tracking-tight truncate">{item.clientName}</h4>
                  <p className="text-[10px] text-[#5B49AD] font-bold uppercase tracking-wider truncate">
                    {item.companyName || 'Corporate Client'}
                  </p>
                  {item.designation && <p className="text-[9px] text-white/40 truncate">{item.designation}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

