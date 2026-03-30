import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntroAnimation = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  
  const words = [
    { text: 'ATTRACT', type: 'bold', duration: 1.2 },
    { text: 'Advertising', type: 'script', duration: 1.2 },
    { text: 'The Future of Mobile Street Advertising', type: 'medium', duration: 1.5 },
    { text: 'MINIMUM', type: 'kinetic', duration: 0.3 },
    { text: 'BOOKING', type: 'kinetic', duration: 0.3 },
    { text: 'DAILY', type: 'kinetic', duration: 0.3 },
    { text: 'MAXIMUM', type: 'kinetic', duration: 0.3 },
    { text: 'CAP', type: 'kinetic', duration: 0.2 },
    { text: 'WHAT IS', type: 'kinetic', duration: 0.4 },
    { text: 'INCLUDED?', type: 'kinetic', duration: 0.4 },
    { text: 'PREMIUM', type: 'kinetic', duration: 0.3 },
    { text: 'ADD-ONS', type: 'kinetic', duration: 0.3 },
    { text: 'SUMMARY', type: 'kinetic', duration: 0.3 },
    { text: 'OF COSTS', type: 'kinetic', duration: 0.3 },
    { text: 'RECAP VIDEO', type: 'logo-font', duration: 0.8 },
    { text: 'BE SEEN.', type: 'final', duration: 1.5 },
    { text: 'EVERYWHERE.', type: 'final-hold', duration: 2 }
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete]);

  useEffect(() => {
    if (index < words.length) {
      const timer = setTimeout(() => {
        setIndex(prev => prev + 1);
      }, words[index].duration * 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [index, onComplete]);

  const getTextStyle = (type) => {
    switch (type) {
      case 'bold': return 'font-display font-black text-6xl md:text-8xl tracking-tighter uppercase';
      case 'script': return "font-['Pinyon_Script'] text-5xl md:text-7xl lowercase opacity-90 tracking-wide brightness-125";
      case 'medium': return 'font-body font-medium text-lg md:text-2xl mt-4 opacity-70 tracking-[0.2em] uppercase text-center max-w-xl';
      case 'kinetic': return 'font-display font-black text-[12vw] md:text-9xl tracking-tight uppercase glitch-text px-4';
      case 'logo-font': return 'font-display font-black text-[10vw] md:text-8xl tracking-tighter uppercase text-primary drop-shadow-[0_0_15px_rgba(255,107,0,0.5)]';
      case 'final': return 'font-display font-black text-[12vw] md:text-9xl tracking-tighter uppercase';
      case 'final-hold': return 'font-display font-black text-[12vw] md:text-9xl tracking-tighter uppercase';
      default: return 'text-2xl';
    }
  };

  const currentWord = words[index] || words[words.length - 1];

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden cursor-none">
      <svg className="hidden">
        <filter id="glitch">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" />
        </filter>
        <filter id="distort">
          <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence" />
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="10" />
        </filter>
      </svg>

      <div className="relative z-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              filter: 'blur(0px)',
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            exit={{ 
              opacity: 0, 
              scale: 1.2, 
              filter: 'blur(20px)',
              transition: { duration: 0.2, ease: "easeIn" }
            }}
            className="flex flex-col items-center justify-center text-center px-6"
          >
            <span className={`${getTextStyle(currentWord.type)} text-white relative`}>
              {currentWord.text}
              {currentWord.type === 'kinetic' && (
                <motion.span 
                  className="absolute inset-0 text-primary opacity-50 mix-blend-screen"
                  animate={{ x: [-2, 2, -2], y: [1, -1, 1] }}
                  transition={{ repeat: Infinity, duration: 0.1 }}
                >
                  {currentWord.text}
                </motion.span>
              )}
            </span>
            
            {currentWord.text === 'ATTRACT' && words[index+1]?.text === 'Advertising' && (
               <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 font-serif italic text-3xl text-white/60"
               >
                 Advertising
               </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Special handling for 'BE SEEN.' + 'EVERYWHERE.' */}
        {index >= words.length - 2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 font-display font-black text-2xl md:text-3xl tracking-[0.3em] uppercase opacity-40"
          >
            {index === words.length - 1 ? 'EVERYWHERE.' : ''}
          </motion.div>
        )}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
        onClick={onComplete}
        className="fixed bottom-10 right-10 z-[10000] px-6 py-2 bg-[#5B49AD]/20 backdrop-blur-md border border-[#5B49AD]/40 rounded-full text-[#5B49AD] text-xs font-bold uppercase tracking-widest hover:text-white hover:bg-[#5B49AD]/60 hover:shadow-[0_0_20px_rgba(91,73,173,0.3)] transition-all cursor-pointer"
      >
        Skip Intro
      </motion.button>

      <style>{`
        .glitch-text {
          text-shadow: 
            0.05em 0 0 rgba(255, 0, 0, 0.75),
            -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
            0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          animation: glitch 500ms infinite;
        }

        @keyframes glitch {
          0% {
            text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75), -0.05em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          14% {
            text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75), -0.05em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          15% {
            text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          49% {
            text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          50% {
            text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          99% {
            text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          100% {
            text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.75), -0.025em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
        }
      `}</style>
    </div>
  );
};

export default IntroAnimation;
