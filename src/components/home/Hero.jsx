import { motion, useScroll, useTransform } from 'framer-motion';
import { Smartphone, Globe, Instagram, ExternalLink } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { getStoredSettings } from '../../utils/settingsStorage';

export default function Hero() {
  const containerRef = useRef(null);
  const [team, setTeam] = useState([]);
  const [instagramUrl, setInstagramUrl] = useState(() => getStoredSettings().instagramUrl);
  const [heroShowcaseImage, setHeroShowcaseImage] = useState(() => getStoredSettings().heroShowcaseImage || '');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/employees`);
        setTeam(data.slice(0, 4));
      } catch (error) {
        console.error('Hero Team Fetch Error:', error);
      }
    };

    const fetchSettings = async () => {
      // First ensure local stored Instagram URL & showcase image are set
      const local = getStoredSettings();
      if (local?.instagramUrl) setInstagramUrl(local.instagramUrl);
      if (local?.heroShowcaseImage !== undefined) setHeroShowcaseImage(local.heroShowcaseImage);

      try {
        const { data } = await axios.get(`${API_URL}/api/settings`);
        if (data) {
          if (data.instagramUrl) setInstagramUrl(data.instagramUrl);
          if (data.heroShowcaseImage !== undefined) setHeroShowcaseImage(data.heroShowcaseImage);
        }
      } catch (error) {
        console.warn('Hero Settings Fetch Error, using local settings fallback:', error);
      }
    };

    fetchTeam();
    fetchSettings();
  }, []);

  const handleOpenInstagram = () => {
    window.open(instagramUrl, '_blank', 'noopener,noreferrer');
  };

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
      },
    },
  };

  return (
    <section ref={containerRef} className="relative w-full flex items-center justify-center bg-black overflow-hidden pt-32 pb-16 px-6 font-body">
      <div className="absolute inset-0 z-0 bg-grid opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1600px] flex flex-col items-center">
        <motion.div
          style={{ y: y1, rotate: rotate }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] lg:text-[15vw] font-display font-black tracking-tighter text-white pointer-events-none select-none blur-sm uppercase whitespace-nowrap"
        >
          ATTRACT
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-between w-full h-full gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <motion.span
                variants={wordVariants}
                className="text-[#A1A1AA] font-bold uppercase tracking-[0.4em] text-[8px] md:text-[10px] mb-6 block opacity-60"
              >
                The Future of Mobile Street Advertising
              </motion.span>

              <h1 className="text-2xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter leading-[0.9] text-[#A1A1AA] mb-8 flex flex-wrap justify-center lg:justify-start uppercase">
                STOP WAITING <br />
                FOR CUSTOMERS <br />
                TO <span className="text-[#A1A1AA]/40">FIND YOU.</span>
              </h1>

              <motion.p
                variants={wordVariants}
                className="text-sm md:text-xl text-[#A1A1AA]/60 max-w-xl mb-12 leading-relaxed font-medium"
              >
                High-definition digital screens worn on backpacks by agents walking directly into high-traffic crowds.{' '}
                <span className="text-[#A1A1AA]/40">We walk your brand straight to your customers.</span>
              </motion.p>

              <motion.div variants={wordVariants} className="flex flex-wrap items-center gap-6 justify-center lg:justify-start">
                <div className="flex -space-x-4">
                  {team.length > 0 ? (
                    team.map((member) => (
                      <div key={member._id} className="w-10 h-10 rounded-full border-2 border-black bg-white/10 overflow-hidden">
                        <img
                          src={member.imageUrl?.startsWith('http') ? member.imageUrl : `${API_URL}${member.imageUrl}`}
                          alt={member.name}
                          className="w-full h-full object-cover grayscale opacity-60"
                        />
                      </div>
                    ))
                  ) : (
                    [1, 2, 3, 4].map((i) => (
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

          {/* Interactive Instagram Showcase Cards */}
          <motion.div style={{ y: y2 }} className="flex-1 flex flex-col md:flex-row items-center gap-8 lg:-mr-12">
            
            {/* Primary Showcase Card linking to configured Admin Instagram URL */}
            <motion.div
              initial={{ opacity: 0, x: 100, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 2 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05, rotate: 0 }}
              onClick={handleOpenInstagram}
              className="glass-card w-full md:w-[350px] aspect-[4/3] rounded-[2rem] p-4 flex flex-col group cursor-pointer shadow-2xl relative overflow-hidden"
              data-cursor="View Instagram"
            >
              {heroShowcaseImage ? (
                <div className="w-full h-full rounded-2xl overflow-hidden relative border border-white/10 group">
                  <img
                    src={heroShowcaseImage}
                    alt="Hero Showcase Thumbnail"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Instagram size={14} className="text-[#E1306C]" /> Watch Reel / Post
                      </span>
                      <ExternalLink size={14} className="text-white/60 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 flex gap-1.5 z-10 bg-black/50 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-900/40 via-pink-900/20 to-black rounded-2xl overflow-hidden relative border border-white/10 flex flex-col items-center justify-center">
                  <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>

                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 shadow-[0_0_30px_rgba(225,48,108,0.5)] group-hover:scale-110 transition-transform duration-500">
                    <div className="w-full h-full bg-black rounded-[1.4rem] flex items-center justify-center text-white">
                      <Instagram size={36} />
                    </div>
                  </div>

                  <span className="text-xs font-mono text-white/60 mt-3 flex items-center gap-1 group-hover:text-white transition-colors">
                    Instagram Reel / Post <ExternalLink size={12} />
                  </span>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                  ENTERPRISE PLATFORM
                </span>
                <span className="text-[10px] px-3 py-1 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-black tracking-widest flex items-center gap-1 shadow-lg">
                  <Instagram size={12} /> INSTAGRAM
                </span>
              </div>
            </motion.div>

            {/* Secondary Mobile Experience Card */}
            <motion.div
              initial={{ opacity: 0, x: 100, y: 100, rotate: -5 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: -2 }}
              transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05, rotate: 0 }}
              onClick={handleOpenInstagram}
              className="glass-card w-full md:w-[280px] aspect-[9/16] rounded-[2.5rem] p-4 flex flex-col group cursor-pointer md:-mt-20 self-end shadow-2xl relative overflow-hidden"
              data-cursor="Instagram Reel"
            >
              {heroShowcaseImage ? (
                <div className="w-full h-full rounded-[1.8rem] overflow-hidden relative border border-white/10 group">
                  <img
                    src={heroShowcaseImage}
                    alt="Campaign Reel"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-between p-5">
                    <div className="w-16 h-4 bg-white/30 backdrop-blur-md rounded-full mx-auto" />
                    <div className="text-center space-y-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 p-0.5 mx-auto shadow-lg">
                        <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-white">
                          <Instagram size={18} />
                        </div>
                      </div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider">Watch Reel</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-purple-900/30 via-rose-950/30 to-black rounded-[1.8rem] overflow-hidden relative border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-white/20 rounded-full z-10" />

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 shadow-[0_0_25px_rgba(225,48,108,0.5)] group-hover:scale-110 transition-transform duration-500">
                    <div className="w-full h-full bg-black rounded-[0.9rem] flex items-center justify-center text-white">
                      <Instagram size={28} />
                    </div>
                  </div>

                  <p className="text-xs font-bold text-white uppercase tracking-wider mt-4">
                    Watch Campaign Reel
                  </p>
                  <p className="text-[10px] text-white/40 mt-1">Tap to view live on Instagram</p>
                </div>
              )}

              <div className="mt-4 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA]/60 group-hover:text-white transition-colors">
                  IOS EXPERIENCE
                </span>
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
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-5 h-9 border-2 border-[#A1A1AA]/20 rounded-full flex justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-2 bg-[#5B49AD] rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
