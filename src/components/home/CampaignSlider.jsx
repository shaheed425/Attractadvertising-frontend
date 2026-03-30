import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    id: 1,
    title: 'Street Domination',
    category: 'Mobile LED Ads',
    description: 'A full-scale mobile LED and street promotion campaign reaching thousands instantly.',
    image: 'https://images.unsplash.com/photo-1556761175-5973e6da5a6f?w=1600&q=80',
  },
  {
    id: 2,
    title: 'Interactive Trivia',
    category: 'Event Programs',
    description: 'Engaging street trivia games that drew crowds and exploded social media followers.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80',
  },
  {
    id: 3,
    title: 'Digital Odyssey',
    category: 'Motion Graphics',
    description: 'Bespoke 3D animations transforming human billboards into cinematic experiences.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=80',
  }
];

export default function CampaignSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black cursor-grab active:cursor-grabbing">
      <AnimatePresence mode='wait'>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'circOut' }}
          className="absolute inset-0 z-0"
        >
          <img src={SLIDES[current].image} alt={SLIDES[current].title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center px-4 md:px-20">
        <div className="max-w-3xl">
          <AnimatePresence mode='wait'>
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
                {SLIDES[current].category}
              </span>
              <h2 className="text-5xl md:text-8xl font-display font-black text-white leading-none mb-6">
                {SLIDES[current].title}
              </h2>
              <p className="text-xl md:text-2xl text-white/80 max-w-xl font-light">
                {SLIDES[current].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-10 left-4 md:left-20 flex gap-4 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="group py-4 flex flex-col items-start gap-2"
          >
            <span className={`text-xs font-bold ${i === current ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>
              0{i + 1}
            </span>
            <div className="h-1 w-16 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: i === current ? '100%' : '0%' }}
                transition={{ duration: i === current ? 6 : 0, ease: 'linear' }}
              />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
