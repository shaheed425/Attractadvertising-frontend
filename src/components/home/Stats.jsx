import { motion } from 'framer-motion';
import { Users, Briefcase, Calendar, Smile } from 'lucide-react';

const stats = [
  {
    icon: <Users className="text-primary" size={24} />,
    value: '100+',
    label: 'Clients',
    description: 'Serving global brands with innovation.'
  },
  {
    icon: <Briefcase className="text-primary" size={24} />,
    value: '150+',
    label: 'Projects',
    description: 'Delivering excellence at scale.'
  },
  {
    icon: <Calendar className="text-primary" size={24} />,
    value: '05+',
    label: 'Years',
    description: 'A half-decade of digital mastery.'
  },
  {
    icon: <Smile className="text-primary" size={24} />,
    value: '99%',
    label: 'Satisfaction',
    description: 'Commitment to absolute quality.'
  }
];

export default function Stats() {
  return (
    <section className="py-32 bg-[#0a0a0a] px-6 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="relative flex flex-col items-center lg:items-start lg:px-12 first:lg:pl-0 last:lg:pr-0 group"
            >
              {/* Desktop Divider */}
              {i < stats.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              )}
              
              <div className="flex flex-col items-center lg:items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all duration-500 group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:scale-110">
                  {stat.icon}
                </div>
                
                <div className="text-center lg:text-left">
                  <motion.div 
                    initial={{ scale: 0.9 }}
                    whileInView={{ scale: 1 }}
                    className="text-5xl md:text-7xl font-display font-black text-white mb-2 tracking-tighter"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-6 block">
                    {stat.label}
                  </div>
                  <p className="text-sm text-textMuted leading-relaxed max-w-[200px] opacity-60 group-hover:opacity-100 transition-opacity">
                    {stat.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
