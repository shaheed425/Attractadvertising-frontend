import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "What is Digital Backpack Advertising?",
    answer: "It's a high-impact mobile advertising solution where our brand ambassadors carry ultra-bright, high-resolution digital screens in top-tier foot-traffic areas. This ensures your brand moves with the crowd and is seen exactly where it matters most."
  },
  {
    question: "How do you track campaign performance?",
    answer: "We provide comprehensive coverage reports and professionally edited recap videos for every deployment. Our agents also track engagement levels and social media scans to give you a clear picture of your campaign's reach."
  },
  {
    question: "Can I choose the specific routes for my campaign?",
    answer: "Yes! We collaborate with you to map out 'Power Routes' through major metro hubs, shopping districts, or specific event zones to ensure your message reaches your ideal target demographic."
  },
  {
    question: "What is the 'Recap Video' mentioned in my package?",
    answer: "For every booking, we film your campaign in action—the crowd interaction, the brand presence, and the atmosphere. You receive a high-energy, edited video perfect for sharing on your social media channels to amplify your impact."
  },
  {
    question: "Do you provide ad content creation?",
    answer: "Absolutely. If you don't have a video ready, our motion graphics team can design a high-converting, eye-catching ad specifically optimized for our backpack displays."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-32 bg-black px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#A1A1AA]/40 font-bold uppercase tracking-[0.5em] text-[10px] mb-6 block">Inquiry</span>
            <h2 className="text-5xl md:text-8xl font-display font-black tracking-tighter text-[#A1A1AA] leading-[0.9]">
              Frequently Asked <br /> <span className="text-[#A1A1AA]/20">Questions.</span>
            </h2>
          </motion.div>
        </div>

        <div className="flex flex-col border-t border-white/10">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="border-b border-white/10"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full py-10 flex items-center justify-between text-left group transition-all"
                data-cursor="Toggle"
              >
                <span className={`text-2xl md:text-4xl font-display font-black transition-all duration-500 transform ${openIndex === i ? 'text-[#A1A1AA] translate-x-4' : 'text-[#A1A1AA]/40 group-hover:text-white'}`}>
                  {faq.question}
                </span>
                <div className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500 ${openIndex === i ? 'bg-[#5B49AD] border-primary rotate-180 text-white shadow-[0_0_20px_rgba(91,73,173,0.3)]' : 'border-white/10 text-[#A1A1AA]/40 group-hover:border-white group-hover:text-white'}`}>
                  {openIndex === i ? <Minus size={24} /> : <Plus size={24} />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="pb-10 pl-4 md:pl-20 text-[#A1A1AA]/60 leading-relaxed text-xl max-w-4xl font-medium">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
