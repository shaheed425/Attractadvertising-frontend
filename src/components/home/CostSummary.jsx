import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function CostSummary() {
  const [premiumServices, setPremiumServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/services');
        setPremiumServices(data.filter(s => s.isPremium));
      } catch (error) {
        console.error('Error fetching costs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCosts();
  }, []);

  const baseCosts = [
    { item: '4 Hour Booking (Min)', cost: '₹4,000' },
  ];

  if (loading) return null;

  const allCosts = [
    ...baseCosts,
    ...premiumServices.map(s => ({
      item: s.title,
      cost: s.price.startsWith('₹') || s.price.toLowerCase() === 'custom' ? s.price : `+${s.price}`
    }))
  ];

  return (
    <section className="py-32 bg-black px-6 relative overflow-hidden" id="summary">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-white opacity-40 font-bold uppercase tracking-[0.5em] text-[10px] mb-6 block">Transparency</span>
          <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-white uppercase italic">
            SUMMARY OF <span className="text-white/40">COSTS</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl"
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-8 md:p-10 text-white/40 uppercase tracking-widest text-xs font-bold">Service / Duration</th>
                <th className="p-8 md:p-10 text-white uppercase tracking-widest text-xs font-bold text-right">Investment</th>
              </tr>
            </thead>
            <tbody>
              {allCosts.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-white/10 hover:bg-white/5 transition-colors ${i === allCosts.length - 1 ? 'border-0' : ''}`}
                >
                  <td className="p-8 md:p-10 text-white font-medium md:text-lg">{row.item}</td>
                  <td className="p-8 md:p-10 text-white font-black md:text-2xl text-right">{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-10 bg-white/5 text-center">
            <p className="text-white/40 text-sm font-medium">All prices are inclusive of agent fees and base equipment.</p>
          </div>
        </motion.div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 blur-[100px] rounded-full pointer-events-none" />
    </section>
  );
}
