import React from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Clock, Zap } from 'lucide-react';

const CorePackage = () => {
  return (
    <section className="py-24 bg-black px-6 relative overflow-hidden" id="pricing">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-white opacity-40 font-bold uppercase tracking-[0.5em] text-[10px] mb-4 block">Pricing Overview</span>
          <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-[#A1A1AA] uppercase">
            THE <span className="text-[#A1A1AA]/40">CORE</span> PACKAGE
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative group p-1 bg-gradient-to-br from-white/10 via-white/5 to-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
        >
          <div className="bg-white/5 backdrop-blur-3xl rounded-[2.9rem] p-12 md:p-20 relative overflow-hidden border border-white/10">
             {/* Animated Shine Effect */}
             <motion.div 
               animate={{ x: ['100%', '-100%'] }}
               transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
               className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
             />

             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#5B49AD]/10 flex items-center justify-center text-[#5B49AD] group-hover:bg-[#5B49AD] group-hover:text-white transition-all transform group-hover:scale-110">
                        <IndianRupee size={32} />
                    </div>
                    <div>
                        <p className="text-[#A1A1AA]/60 uppercase tracking-widest text-[10px] mb-1 font-bold">Hourly Rate</p>
                        <h3 className="text-4xl font-display font-black text-[#5B49AD]">₹1,000<span className="text-lg text-[#A1A1AA]/40 italic font-medium">/hr</span></h3>
                    </div>
                </div>

                <div className="flex flex-col items-center text-center gap-4 border-y md:border-y-0 md:border-x border-primary/5 py-8 md:py-0">
                    <div className="w-16 h-16 rounded-2xl bg-[#5B49AD]/5 flex items-center justify-center text-[#5B49AD]/40 group-hover:bg-[#5B49AD] group-hover:text-white transition-all">
                        <Clock size={32} />
                    </div>
                    <div>
                        <p className="text-[#A1A1AA]/60 uppercase tracking-widest text-[10px] mb-1 font-bold">Minimum Booking</p>
                        <h3 className="text-4xl font-display font-black text-[#5B49AD]">4 Hours</h3>
                        <p className="text-primary text-xs font-bold mt-1 uppercase tracking-widest">₹4,000 Total</p>
                    </div>
                </div>

                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#5B49AD]/5 flex items-center justify-center text-[#5B49AD]/40 group-hover:bg-[#5B49AD] group-hover:text-white transition-all">
                        <Zap size={32} />
                    </div>
                    <div>
                        <p className="text-[#A1A1AA]/60 uppercase tracking-widest text-[10px] mb-1 font-bold">Maximum Per Day</p>
                        <h3 className="text-4xl font-display font-black text-[#5B49AD]">5 Hours</h3>
                        <p className="text-primary text-xs font-bold mt-1 uppercase tracking-widest">₹5,000 Total</p>
                    </div>
                </div>
             </div>

             <div className="mt-16 text-center">
                <p className="text-[#A1A1AA]/40 italic text-sm font-medium">Structured for maximum impact in high-traffic periods.</p>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CorePackage;
