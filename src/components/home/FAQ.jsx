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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="text-white/40 font-bold uppercase tracking-[0.6em] text-[8px] md:text-[10px] mb-4 md:mb-6 block">Inquiry</span>
          <h2 className="text-2xl md:text-8xl font-display font-black text-white leading-none uppercase tracking-tighter italic">
            Frequently <br className="md:hidden" />
            <span className="text-white/20">Asked</span> <br />
            Questions.
          </h2>
        </motion.div>

        <div className="space-y-6 md:space-y-8">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-white/5 pb-6 md:pb-8"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h3 className={`text-lg md:text-4xl font-display font-black transition-all duration-500 uppercase tracking-tighter leading-tight ${openIndex === index ? 'text-white' : 'text-white/20 group-hover:text-white/40'}`}>
                  {faq.question}
                </h3>
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full border flex items-center justify-center transition-all duration-500 ${openIndex === index ? 'bg-[#5B49AD] border-primary rotate-180 text-white shadow-[0_0_20px_rgba(91,73,173,0.3)]' : 'border-white/10 text-white/40 group-hover:border-white group-hover:text-white'}`}>
                  {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="pb-10 pl-4 md:pl-20 text-[#A1A1AA]/60 leading-relaxed text-lg max-w-4xl font-medium px-4">
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
