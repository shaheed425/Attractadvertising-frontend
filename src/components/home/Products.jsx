import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Star } from 'lucide-react';

export default function Products() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log("--- DEBUG START (Services) ---");
        console.log("1. Initiating API Call to backend URL: /api/services");
        const response = await axios.get('http://localhost:5001/api/services');
        console.log("2. Raw Response Received:", response);
        console.log("3. Data being set into React state:", response.data);
        setServices(response.data);
      } catch (err) {
        console.error("API Fetch Failed or Network Error (Services):", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return (
    <div className="py-24 bg-black flex justify-center items-center h-96">
      <div className="w-16 h-16 border-[6px] border-primary/10 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!services || services.length === 0) {
    return (
      <div className="py-24 bg-black text-center text-white/40 border-y border-white/5">
        <p className="text-xl font-display uppercase tracking-widest mb-4">No Services Provisioned</p>
        <p className="text-sm">Loading data... (If this stays, check browser console for errors)</p>
      </div>
    );
  }

  return (
    <section className="py-32 bg-black relative" id="pricing">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block mb-6"
          >
            <span className="text-primary font-black uppercase tracking-[0.8em] text-[10px] bg-primary/10 px-6 py-2 rounded-full">
              Capital Solutions
            </span>
          </motion.div>
          <h2 className="text-5xl md:text-8xl font-display font-bold text-white tracking-tight leading-none">Scalable Engine Plans</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <motion.div
              key={service?._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className={`p-10 rounded-[3rem] border border-white/5 relative group hover:border-yellow-500/30 transition-all duration-700 overflow-hidden ${service?.isPremium ? 'bg-white/[0.05]' : 'bg-transparent'}`}
            >
              <div className="absolute -top-10 -right-10 p-8 text-white/[0.02] group-hover:text-primary/10 transition-colors pointer-events-none">
                {service?.isPremium ? <Star size={200} strokeWidth={1} /> : <Zap size={200} strokeWidth={1} />}
              </div>

              <div className="relative z-10">
                <div className={`text-[10px] uppercase font-black tracking-[0.3em] px-4 py-2 rounded-xl mb-12 inline-flex items-center gap-2 ${service?.isPremium ? 'bg-primary text-white' : 'bg-white/10 text-white/60'}`}>
                  {service?.isPremium ? <><Star size={12} fill="currentColor" /> Enterprise Tier</> : 'Scale Unit'}
                </div>
                <h3 className="text-4xl font-display font-bold text-white mb-6 tracking-tight">{service?.title || 'System Core'}</h3>
                <p className="text-white/40 mb-12 font-light text-lg leading-relaxed h-28 italic">
                  "{service?.description || 'Optimizing performance metrics for next-gen deployment.'}"
                </p>
                
                <div className="flex items-baseline gap-2 mb-12">
                   <div className="text-6xl font-display font-black text-white">{service?.price?.split('+')[0] || '$0'}</div>
                   <div className="text-primary font-black text-xl">+</div>
                </div>
                
                <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all duration-500 ${service?.isPremium ? 'bg-primary text-white hover:bg-white hover:text-black' : 'bg-white text-black hover:bg-primary hover:text-white'}`}>
                  Initialize Setup <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
