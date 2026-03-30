import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const MOCK_TESTIMONIALS = [
  {
    id: 1,
    clientName: 'Sarah Connor',
    company: 'SkyNet Solutions',
    message: "TotalX delivered a cloud-scale enterprise dashboard that transformed our data visualization. Their expertise in React and Node.js is unmatched.",
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 2,
    clientName: 'Bruce Wayne',
    company: 'Wayne Enterprises',
    message: "The Flutter mobile application they built is incredibly fluid. The attention to detail in the UI/UX design reflects their premium quality.",
    avatarUrl: 'https://randomuser.me/api/portraits/men/46.jpg'
  },
  {
    id: 3,
    clientName: 'Tony Stark',
    company: 'Stark Industries',
    message: "From hardware integration to high-performance web portals, TotalX is our go-to partner for cutting-edge technology solutions.",
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
  }
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % MOCK_TESTIMONIALS.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? MOCK_TESTIMONIALS.length - 1 : prev - 1));
  };

  return (
    <section className="py-32 relative w-full px-6 max-w-[1400px] mx-auto z-10">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[150px] -z-10 rounded-full pointer-events-none" />

      <div className="text-center mb-20">
        <span className="text-primary font-bold uppercase tracking-[0.4em] text-xs mb-6 block">Testimonials</span>
        <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-white">
          Trusted by <span className="text-primary">Industry Leaders.</span>
        </h2>
      </div>

      <div className="relative glass-card p-12 md:p-20 rounded-[3rem] overflow-hidden min-h-[400px] flex items-center justify-center border-white/5">
        <Quote className="absolute top-12 left-12 text-primary/10" size={120} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 text-center flex flex-col items-center"
          >
            <p className="text-2xl md:text-4xl font-display font-bold text-white leading-tight mb-12 max-w-4xl italic">
              "{MOCK_TESTIMONIALS[index].message}"
            </p>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
                <img 
                  src={MOCK_TESTIMONIALS[index].avatarUrl} 
                  alt={MOCK_TESTIMONIALS[index].clientName}
                  className="w-16 h-16 rounded-full border-2 border-primary object-cover relative z-10"
                />
              </div>
              <div className="text-left">
                <h4 className="font-display font-black text-xl text-white">{MOCK_TESTIMONIALS[index].clientName}</h4>
                <p className="text-sm font-bold uppercase tracking-widest text-primary">{MOCK_TESTIMONIALS[index].company}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute bottom-8 right-12 flex gap-4">
          <button 
            onClick={prevSlide} 
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all duration-300"
            data-cursor="Prev"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide} 
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all duration-300"
            data-cursor="Next"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-3 mt-12">
        {MOCK_TESTIMONIALS.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-12 bg-primary' : 'w-4 bg-white/10 hover:bg-white/30'}`}
          />
        ))}
      </div>
    </section>
  );
}
