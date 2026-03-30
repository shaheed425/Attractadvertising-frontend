import { motion, useScroll, useTransform } from 'framer-motion';
import { Smartphone, Globe } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';

export default function Hero() {
  const containerRef = useRef(null);
  const [team, setTeam] = useState([]);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/employees`);
        setTeam(data.slice(0, 4)); // Get first 4 members for avatars
      } catch (error) {
        console.error('Hero Team Fetch Error:', error);
      }
    };
    fetchTeam();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }
    },
  };

  return (
    <section ref={containerRef} className="relative w-full flex items-center justify-center bg-black overflow-hidden pt-32 pb-16 px-6">
      <div className="absolute inset-0 z-0 bg-grid opacity-20 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[1600px] flex flex-col items-center">
        <motion.div 
          style={{ y: y1, rotate: rotate }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] lg:text-[15vw] font-display font-black tracking-tighter text-white pointer-events-none select-none blur-sm uppercase whitespace-nowrap"
        >
          ATTRACT
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-between w-full h-full gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.span 
                variants={wordVariants}
                className="text-[#A1A1AA] font-bold uppercase tracking-[0.4em] text-[8px] md:text-[10px] mb-6 block opacity-60"
              >
                The Future of Mobile Street Advertising
              </motion.span>
              
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter leading-[0.9] text-[#A1A1AA] mb-8 flex flex-wrap justify-center lg:justify-start uppercase">
                STOP WAITING <br />
                FOR CUSTOMERS <br />
                TO <span className="text-[#A1A1AA]/40">FIND YOU.</span>
              </h1>

              <motion.p 
                variants={wordVariants}
                className="text-base md:text-xl text-[#A1A1AA]/60 max-w-xl mb-12 leading-relaxed font-medium"
              >
                High-definition digital screens worn on backpacks by agents walking directly into high-traffic crowds. <span className="text-[#A1A1AA]/40">We walk your brand straight to your customers.</span>
              </motion.p>
              
              <motion.div 
                variants={wordVariants}
                className="flex flex-wrap items-center gap-6 justify-center lg:justify-start"
              >
                {/* <button className="tech-button !bg-[#5B49AD] !text-white shadow-[0_0_20px_rgba(91,73,173,0.3)] hover:shadow-[0_0_30px_rgba(91,73,173,0.5)]">
                  Get Started Now
                </button> */}
                <div className="flex -space-x-4">
                  {team.length > 0 ? (
                    team.map((member, i) => (
                      <div key={member._id} className="w-10 h-10 rounded-full border-2 border-black bg-white/10 overflow-hidden">
                        <img 
                          src={member.imageUrl?.startsWith('http') ? member.imageUrl : `${API_URL}${member.imageUrl}`} 
                          alt={member.name} 
                          className="w-full h-full object-cover grayscale opacity-60"
                        />
                      </div>
                    ))
                  ) : (
                    [1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-indigo-50 overflow-hidden flex items-center justify-center bg-zinc-100">
                        <div className="w-full h-full bg-indigo-100 animate-pulse" />
                      </div>
                    ))
                  )}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                    {team.length > 4 ? `+${team.length - 4}` : 'LIVE'}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div 
            style={{ y: y2 }}
            className="flex-1 flex flex-col md:flex-row items-center gap-8 lg:-mr-12"
          >
            <motion.div
              initial={{ opacity: 0, x: 100, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 2 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05, rotate: 0 }}
              className="glass-card w-full md:w-[350px] aspect-[4/3] rounded-[2rem] p-4 flex flex-col group cursor-pointer shadow-2xl relative"
              data-cursor="View Web"
            >
              <div className="w-full h-full bg-white/5 rounded-2xl overflow-hidden relative border border-white/10">
                <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <div className="w-full h-full flex items-center justify-center text-white/5">
                  <Globe size={120} className="group-hover:scale-110 group-hover:text-white/20 transition-all duration-700" />
                </div>
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                   </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">Enterprise Platform</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white font-bold">LIVE</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100, y: 100, rotate: -5 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: -2 }}
              transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05, rotate: 0 }}
              className="glass-card w-full md:w-[280px] aspect-[9/16] rounded-[2.5rem] p-4 flex flex-col group cursor-pointer md:-mt-20 self-end shadow-2xl relative"
              data-cursor="View App"
            >
              <div className="w-full h-full bg-white/5 rounded-[1.8rem] overflow-hidden relative border border-white/10">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-white/10 rounded-full z-10" />
                <div className="w-full h-full flex items-center justify-center text-white/5">
                  <Smartphone size={140} className="group-hover:scale-110 group-hover:text-white/20 transition-all duration-700" />
                </div>
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                   </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA]/40 group-hover:text-white transition-colors">iOS Experience</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#5B49AD]/40">Scroll</span>
          <div className="w-[2px] h-12 bg-[#5B49AD]/10 rounded-full relative overflow-hidden">
            <motion.div 
              animate={{ y: [-48, 48] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-primary"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
