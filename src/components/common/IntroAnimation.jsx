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
      case 'bold': return 'font-display font-black text-[clamp(2.5rem,12vw,6rem)] md:text-8xl tracking-tighter uppercase leading-none';
      case 'script': return "font-['Pinyon_Script'] text-[clamp(2rem,10vw,5rem)] md:text-7xl lowercase opacity-90 tracking-wide brightness-125 leading-none";
      case 'medium': return 'font-body font-medium text-[clamp(0.875rem,3vw,1.5rem)] md:text-2xl mt-6 opacity-70 tracking-[0.2em] uppercase text-center px-4 max-w-[90vw] md:max-w-2xl';
      case 'kinetic': return 'font-display font-black text-[clamp(2rem,12vw,7rem)] md:text-9xl tracking-tight uppercase glitch-text px-4 leading-none';
      case 'logo-font': return 'font-display font-black text-[clamp(2.5rem,12vw,8rem)] md:text-8xl tracking-tighter uppercase text-primary drop-shadow-[0_0_15px_rgba(255,107,0,0.5)] leading-none';
      case 'final': return 'font-display font-black text-[clamp(3rem,15vw,10rem)] md:text-9xl tracking-tighter uppercase leading-none';
      case 'final-hold': return 'font-display font-black text-[clamp(2rem,5vw,5rem)] md:text-9xl tracking-tighter uppercase leading-none';
      default: return 'text-xl md:text-2xl';
    }
  };

  const currentWord = words[index] || words[words.length - 1];

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden cursor-none p-4">
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

      <div className="relative z-10 flex flex-col items-center w-full max-w-full">
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
            className="flex flex-col items-center justify-center text-center w-full max-w-full overflow-hidden"
          >
            <span className={`${getTextStyle(currentWord.type)} text-white relative inline-block max-w-full`}>
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
                className="mt-4 font-serif italic text-[clamp(1.25rem,5vw,2.5rem)] md:text-3xl text-white/60"
               >
                 Advertising
               </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Special handling for 'BE SEEN.' + 'EVERYWHERE.' */}
        {index >= words.length - 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 md:mt-4 font-display font-black text-[clamp(1rem,5vw,2rem)] md:text-3xl tracking-[0.2em] md:tracking-[0.4em] uppercase opacity-20 text-center px-4 leading-none"
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
        className="fixed bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-10 md:translate-x-0 z-[10000] px-6 py-2 bg-[#5B49AD]/20 backdrop-blur-md border border-[#5B49AD]/40 rounded-full text-[#5B49AD] text-[10px] md:text-xs font-bold uppercase tracking-widest hover:text-white hover:bg-[#5B49AD]/60 hover:shadow-[0_0_20px_rgba(91,73,173,0.3)] transition-all cursor-pointer whitespace-nowrap"
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
