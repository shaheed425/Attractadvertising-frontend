import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProject = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/portfolio/${id}`);
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-primary gap-6">
      <h1 className="text-4xl font-display font-bold">Project Not Found</h1>
      <Link to="/" className="text-primary uppercase tracking-widest font-black flex items-center gap-2 hover:gap-4 transition-all">
        <ArrowLeft size={20} /> Abort to Mission Control
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-[#A1A1AA] selection:bg-primary/20 selection:text-primary transition-colors duration-500 relative font-body">
      <Navbar />
      <div className="fixed inset-0 bg-grid opacity-5 pointer-events-none -z-10" />

      {/* Hero Header */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[150px] -z-10" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors uppercase tracking-[0.3em] text-[10px] font-black mb-12">
              <ArrowLeft size={16} /> Back to Archive
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
              <div>
                <span className="text-primary font-bold uppercase tracking-[0.5em] text-[10px] mb-6 block">{project.client} // Case Study</span>
                <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-none mb-8 uppercase text-primary">
                  {project.title}
                </h1>
                <p className="text-xl text-[#A1A1AA]/60 leading-relaxed max-w-xl italic font-medium">
                  "{project.metrics}"
                </p>
              </div>
              
              <div className="flex flex-wrap gap-8 items-center lg:justify-end border-t lg:border-t-0 lg:border-l border-primary/5 pt-8 lg:pt-0 lg:pl-12">
                 <div className="space-y-1">
                   <div className="text-[10px] text-zinc-300 font-black uppercase tracking-[0.3em]">Vertical</div>
                   <div className="text-[#5B49AD] font-bold">{project.client}</div>
                 </div>
                 <div className="space-y-1 text-primary">
                    <div className="text-[10px] text-primary/40 font-black uppercase tracking-[0.3em]">Efficiency</div>
                    <div className="text-[#5B49AD] font-bold">100% Deployed</div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Media Showcase */}
      <section className="px-6 mb-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-[21/9] rounded-[3rem] overflow-hidden border border-primary/5 shadow-2xl relative group"
          >
            <img 
               src={project.imageUrl?.startsWith('http') ? project.imageUrl : `${API_URL}${project.imageUrl}`} 
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
               alt={project.title} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#5B49AD]/20 via-transparent to-transparent opacity-60" />
          </motion.div>
        </div>
      </section>

      {/* Content & Details */}
      <section className="px-6 py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          <div className="lg:col-span-8 space-y-12">
             <div className="space-y-8">
                <h2 className="text-3xl font-display font-bold text-[#5B49AD] tracking-tight flex items-center gap-4">
                  The Mission Objective
                  <div className="h-[2px] w-20 bg-primary/10" />
                </h2>
                <div className="text-lg text-zinc-500 leading-[1.8] space-y-6 lg:columns-1 whitespace-pre-wrap font-medium">
                  {project.details || "No secondary data provided. This project's performance metrics exceeded all projected benchmarks."}
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <div className="p-10 rounded-[2.5rem] bg-indigo-50/50 border border-primary/5 space-y-8 sticky top-32 shadow-xl shadow-primary/5">
               <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Technical Specs</h3>
               
               <div className="space-y-6">
                 <div className="flex gap-4 items-start">
                    <ShieldCheck className="text-primary/40 mt-1" size={20} />
                    <div>
                      <h4 className="text-[#5B49AD] font-bold text-sm">Verified Deployment</h4>
                      <p className="text-zinc-400 text-xs">Full agency support provided.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start">
                    <Zap className="text-primary/40 mt-1" size={20} />
                    <div>
                      <h4 className="text-[#5B49AD] font-bold text-sm">High Impact Visuals</h4>
                      <p className="text-zinc-400 text-xs">Optimized for backpack displays.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start">
                    <BarChart3 className="text-primary/40 mt-1" size={20} />
                    <div>
                      <h4 className="text-[#5B49AD] font-bold text-sm">Real-time Metrics</h4>
                      <p className="text-zinc-400 text-xs">Data-driven performance tracking.</p>
                    </div>
                 </div>
               </div>

               <button className="w-full py-5 bg-[#5B49AD] text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary transition-all flex items-center justify-center gap-3 group shadow-lg shadow-primary/20">
                 Launch Project <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </button>
            </div>
          </div>

        </div>
      </section>

      {/* Footer Branding */}
      <section className="py-40 text-center opacity-5">
         <div className="text-9xl md:text-[15rem] font-display font-black tracking-tighter uppercase select-none text-primary">ATTRACT</div>
      </section>
    </div>
  );
}
