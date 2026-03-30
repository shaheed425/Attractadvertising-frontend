import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const clients = [
  'FlyX', 'Sayid', 'Mazara', 'KG', 'Safari Cars', 
  'VFC', 'Kings Club', 'Turbolux', 'Suguna', 'Fly Store', 'Brain Sill'
];

export default function TrustedPartners() {
  return (
    <section className="py-32 bg-[#0a0a0a] px-6 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-[0.5em] text-white/20 mb-4"
          >
            Partnerships Built on Trust, Grown Through Impact
          </motion.h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-16">
          {clients.map((client, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group flex items-center gap-16 relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="text-2xl md:text-4xl font-display font-black text-white/10 group-hover:text-white transition-all duration-500 tracking-tighter cursor-default relative z-10">
                  {client}
                </div>
              </div>
              
              {i < clients.length - 1 && (
                <div className="text-primary/10 group-hover:text-primary transition-colors duration-500">
                  <Sparkles size={18} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
