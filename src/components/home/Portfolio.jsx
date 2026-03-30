import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, Eye } from 'lucide-react';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/portfolios');
        setProjects(data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return null; // Or a skeleton

  return (
    <section className="py-24 bg-black px-6 relative overflow-hidden" id="portfolio">
      <div className="max-w-[1100px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#A1A1AA]/40 font-bold uppercase tracking-[0.5em] text-[10px] mb-4 block">Our Track Record</span>
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tighter text-[#A1A1AA] uppercase italic">
            PREVIOUS <span className="text-[#A1A1AA]/40">WORK.</span>
          </h2>
        </motion.div>

        <div 
          className="grid grid-rows-2 grid-flow-col gap-8 md:gap-10 overflow-x-auto pb-12 pt-4 px-4 -mx-4 custom-scrollbar scroll-smooth"
          style={{ 
            gridAutoColumns: 'calc((100% - 2 * (2rem + 2.5rem)) / 3)', // Approximately 3 columns per row
            // On md screens and up, we want 3 columns to fit nicely in 1100px
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' // Fallback
          }}
        >
          {projects.map((project, i) => (
            <motion.div
              key={project._id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.8 }}
              className="group relative p-1 rounded-[2.5rem] bg-white/5 border border-white/10 overflow-hidden transition-all duration-500 w-[300px] md:w-[340px] flex-shrink-0 mb-4 shadow-2xl hover:bg-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              
              {/* Image Container */}
              <div className="aspect-[4/3] rounded-[2.2rem] overflow-hidden relative mb-4">
                <img 
                  src={project.imageUrl?.startsWith('http') ? project.imageUrl : `http://localhost:5001${project.imageUrl}`} 
                  alt={project.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-80 group-hover:opacity-100"
                />
                
                {/* Overlay Icons */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-20 font-bold">
                    <Link to={`/project/${project._id}`} className="w-14 h-14 rounded-full bg-[#5B49AD] text-white flex items-center justify-center hover:bg-[#5B49AD]/80 transition-all transform hover:scale-110 shadow-[0_0_20px_rgba(91,73,173,0.3)]">
                        <Eye size={24} />
                    </Link>
                    <button className="w-14 h-14 rounded-full border border-white/10 bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#5B49AD] hover:text-white transition-all transform hover:scale-110 shadow-2xl">
                        <ExternalLink size={20} />
                    </button>
                </div>
              </div>
              
              <div className="px-8 pb-10 relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A1A1AA]/40">{project.client}</span>
                  <div className="h-1 w-1 bg-primary rounded-full animate-pulse" />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-black text-[#A1A1AA] group-hover:text-primary transition-colors tracking-tighter leading-none uppercase">
                  {project.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-[10%] w-[500px] h-[500px] bg-white/5 blur-[150px] rounded-full pointer-events-none" />
    </section>
  );
}
