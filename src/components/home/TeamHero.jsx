import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeamHero() {
  const [members, setMembers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/team');
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        console.error('Error fetching team:', err);
      }
    };
    fetchTeam();
  }, []);

  useEffect(() => {
    if (members.length === 0 || isHovered) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(timer);
  }, [members, currentIndex, isHovered]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % members.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? members.length - 1 : prev - 1));
  };

  if (members.length === 0) return null;

  return (
    <section 
      className="relative h-screen w-full bg-[#000000] overflow-hidden flex flex-col justify-center items-center py-24"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Subtle Glow - Extremely Minimal per TotalX */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.03] blur-[180px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] flex flex-col items-center">
        {/* Slider Area */}
        <div className="relative w-full h-[550px] flex justify-center items-center">
          {members.map((member, i) => {
            let offset = i - currentIndex;
            if (offset < -members.length / 2) offset += members.length;
            if (offset > members.length / 2) offset -= members.length;

            const isCenter = offset === 0;
            const isVisible = Math.abs(offset) <= 1;

            return (
              <motion.div
                key={member._id}
                initial={false}
                animate={{
                  x: offset * 500,
                  scale: isCenter ? 1 : 0.8,
                  opacity: isCenter ? 1 : (Math.abs(offset) === 1 ? 0.4 : 0),
                  filter: isCenter ? 'blur(0px)' : 'blur(8px)',
                  zIndex: isCenter ? 30 : 10,
                }}
                transition={{ 
                  duration: 1, 
                  ease: [0.65, 0, 0.35, 1]
                }}
                className={`absolute w-[320px] md:w-[440px] aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/[0.03] ${Math.abs(offset) <= 1 ? 'cursor-pointer' : 'pointer-events-none'}`}
                onClick={() => {
                  if (offset === -1) handlePrev();
                  if (offset === 1) handleNext();
                }}
                // Drag support for mobile swipe
                drag={isCenter ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, { offset: dragOffset }) => {
                  if (dragOffset.x > 100) handlePrev();
                  else if (dragOffset.x < -100) handleNext();
                }}
              >
                <motion.div
                  animate={isCenter ? { y: [0, -4, 0] } : { y: 0 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full h-full relative"
                >
                  <img 
                    src={member.imageUrl} 
                    alt={member.name} 
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/60 to-transparent" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Text Area (Delayed Reveal - waits for image settlement) */}
        <div className="mt-20 text-center h-[160px] relative w-full">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              className="absolute inset-0 flex flex-col items-center justify-center p-4"
            >
              <motion.h3
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                // Wait for 1s image transition + 0.3s specific delay
                transition={{ delay: 1.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter mb-4"
              >
                {members[currentIndex].name}
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                // Delay 0.2s after Name starts
                transition={{ delay: 1.5, duration: 0.6, ease: "easeOut" }}
                className="text-primary text-[10px] md:text-xs font-bold uppercase tracking-[1em] ml-[1em]"
              >
                {members[currentIndex].role}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Cinematic Performance Pagination */}
      <div className="absolute bottom-20 flex gap-4">
        {members.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className="relative py-4 group"
          >
            <div className={`h-[1px] transition-all duration-1000 ease-in-out ${i === currentIndex ? 'w-16 bg-white' : 'w-6 bg-white/10 group-hover:bg-white/40'}`} />
          </button>
        ))}
      </div>
    </section>
  );
}
