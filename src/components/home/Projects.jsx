import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_PROJECTS = [
  { _id: '1', title: 'Tech Startup Launch', category: 'Human LED Ads', description: 'A city-wide campaign utilizing 50 agent backpack screens for maximum visibility.', mediaUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80', mediaType: 'image' },
  { _id: '2', title: 'Spin-the-Wheel Fest', category: 'Event & Games', description: 'Live street trivia and games that resulted in thousands of direct interactions.', mediaUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', mediaType: 'image' },
  { _id: '3', title: 'Downtown Rush Handouts', category: 'Street Promos', description: 'Strategic flyer distribution combined with instant Instagram follower growth.', mediaUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80', mediaType: 'image' },
  { _id: '4', title: '3D Sneaker Launch Ad', category: 'Motion Graphics', description: 'High-end 3D motion graphics presented on bright outdoor displays.', mediaUrl: 'https://images.unsplash.com/photo-1528114039593-4366cc08227b?w=800&q=80', mediaType: 'image' },
];

const CATEGORIES = ['All', 'Human LED Ads', 'Event & Games', 'Street Promos', 'Motion Graphics'];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All' 
    ? MOCK_PROJECTS 
    : MOCK_PROJECTS.filter(p => p.category === activeCategory);

  return (
    <section className="py-32 bg-background px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-primary font-bold uppercase tracking-[0.4em] text-xs mb-4">Case Studies</h2>
            <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter">Selected Work</h1>
          </motion.div>

          <div className="flex flex-wrap gap-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${activeCategory === cat ? 'bg-white text-black border-white' : 'text-textMuted border-white/10 hover:border-white/30'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                key={project._id}
                className="group relative aspect-[16/10] rounded-[2rem] overflow-hidden bg-white/5 cursor-pointer"
              >
                <img 
                  src={project.mediaUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                
                <div className="absolute inset-0 p-10 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                  <span className="text-primary text-xs font-bold uppercase tracking-widest mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {project.category}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-display font-black text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-textMuted text-sm line-clamp-2 max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
