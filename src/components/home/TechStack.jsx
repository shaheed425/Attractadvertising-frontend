import { motion } from 'framer-motion';

const techLogos = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Flutter', color: '#02569B' },
  { name: 'Node.js', color: '#339933' },
  { name: 'Firebase', color: '#FFCA28' },
  { name: 'MongoDB', color: '#47A248' },
  { name: 'Next.js', color: '#FFFFFF' },
  { name: 'TailwindCSS', color: '#06B6D4' },
  { name: 'Android', color: '#3DDC84' },
  { name: 'iOS', color: '#FFFFFF' },
  { name: 'GitHub', color: '#FFFFFF' },
  { name: 'Shopify', color: '#7AB55C' },
  { name: 'WordPress', color: '#21759B' },
  { name: 'Figma', color: '#F24E1E' },
  { name: 'Solidity', color: '#363636' }
];

export default function TechStack() {
  return (
    <section className="py-32 bg-[#0a0a0a] overflow-hidden border-y border-white/5 relative">
      <div className="absolute inset-0 bg-primary/2 opacity-20 pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 mb-20">
        <div className="flex flex-col items-center text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-primary font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block"
          >
            Capabilities
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-display font-black tracking-tighter text-white"
          >
            Innovation Driven by <span className="text-primary">Modern Tech.</span>
          </motion.h2>
        </div>
      </div>

      <div className="relative">
        {/* Infinite Marquee 1 */}
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] py-4">
          <motion.div
            animate={{ x: [0, -100 * techLogos.length] }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex items-center gap-12 whitespace-nowrap"
          >
            {[...techLogos, ...techLogos, ...techLogos].map((tech, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5, scale: 1.05 }}
                className="flex items-center gap-4 px-8 py-4 bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl hover:border-primary/50 hover:bg-white/[0.05] transition-all duration-300 group cursor-pointer"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl bg-black/40 border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all"
                  style={{ color: tech.color }}
                >
                  {tech.name[0]}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                    {tech.name}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest text-white/30 uppercase">
                    {`{DEV}`}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Reverse Marquee */}
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] py-4 mt-8">
          <motion.div
            animate={{ x: [-100 * techLogos.length, 0] }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex items-center gap-12 whitespace-nowrap"
          >
            {[...techLogos, ...techLogos, ...techLogos].map((tech, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: 5, scale: 1.05 }}
                className="flex items-center gap-4 px-8 py-4 bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl hover:border-primary/50 hover:bg-white/[0.05] transition-all duration-300 group cursor-pointer"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl bg-black/40 border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all opacity-40 group-hover:opacity-100"
                  style={{ color: tech.color }}
                >
                  {tech.name[0]}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white/40 group-hover:text-white transition-colors">
                    {tech.name}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest text-white/10 group-hover:text-primary/40 uppercase">
                    {`{STACK}`}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
