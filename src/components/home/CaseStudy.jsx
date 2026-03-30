import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function CaseStudy() {
  // Step 2.1: State Initialization
  const [portfolioData, setPortfolioData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  // Step 2.2: The useEffect Hook with Absolute URL
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        console.log("--- PIPELINE VERIFICATION ---");
        // Using full absolute URL to bypass proxy issues
        const response = await axios.get('http://localhost:5001/api/portfolios');
        console.log("Data Received Successfully:", response.data);
        setPortfolioData(response.data);
      } catch (error) {
        console.error("Critical API Fetch Failure:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(portfolioData?.length > 1 ? portfolioData.length - 1 : 0) * 80}vw`]);

  // Step 2.3: Defensive Rendering & Loading States
  if (loading) {
    return (
      <div className="bg-black h-screen flex items-center justify-center text-white font-display text-xl tracking-widest uppercase">
        <div className="animate-pulse">Loading neural infrastructure...</div>
      </div>
    );
  }

  if (!portfolioData || portfolioData.length === 0) {
    return (
      <div className="bg-black h-screen flex items-center justify-center text-white border-y border-white/5">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold mb-4 italic opacity-50">Loading projects...</h2>
          <p className="text-white/20 text-xs uppercase tracking-widest">Connect to neural uplink to view archives</p>
        </div>
      </div>
    );
  }

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-[#050505]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-20 px-20">
          {portfolioData.map((item, index) => (
            <div key={item?._id || index} className="w-[80vw] h-[75vh] flex flex-col justify-center relative group">
              {/* Optional Chaining applied to every field */}
              <span className="text-[15rem] md:text-[25rem] font-display font-black text-white/[0.03] absolute -top-32 -left-20 select-none z-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1 space-y-8">
                  <div className="inline-block px-5 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.4em]">
                    {item?.client || 'CONFIDENTIAL CLIENT'}
                  </div>
                  <h3 className="text-6xl md:text-8xl font-display font-bold text-white tracking-tighter leading-none">
                    {item?.title || 'No Title Provided'}
                  </h3>
                  <div className="flex items-center gap-6">
                    <div className="h-px w-20 bg-white/20" />
                    <div className="text-4xl md:text-5xl font-display font-black text-primary italic drop-shadow-[0_0_15px_rgba(91,73,173,0.3)]">
                      {item?.metrics || 'N/A Metrics'}
                    </div>
                  </div>
                  <button className="flex items-center gap-4 text-white hover:text-primary transition-colors duration-500 py-4 group/btn">
                    <span className="text-xs font-black uppercase tracking-[0.5em]">View Intelligence</span>
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:border-primary transition-colors">
                      <span className="text-xl group-hover/btn:translate-x-1 transition-transform">→</span>
                    </div>
                  </button>
                </div>
                
                <div className="w-full md:w-1/2 aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 group-hover:border-primary/30 transition-all duration-700 bg-white/5 shadow-2xl">
                  {item?.imageUrl ? (
                    <img 
                      src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:5001${item.imageUrl}`} 
                      className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000" 
                      alt={item?.title || 'Project image'} 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10 text-xs font-black uppercase tracking-widest">
                      Missing Evidence File
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
