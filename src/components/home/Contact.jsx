import { motion } from 'framer-motion';
import { CheckCircle2, Instagram, Youtube, Facebook, Linkedin, Twitter, ArrowRight } from 'lucide-react';

const socials = [
  { name: 'attract.advertising', icon: <Instagram size={20} />, href: 'https://www.instagram.com/attract.advertising?igsh=MXQ3aDJlbjJneHI1dw==' },
  { name: 'YouTube', icon: <Youtube size={20} />, href: '#' },
  { name: 'Facebook', icon: <Facebook size={20} />, href: '#' },
  { name: 'LinkedIn', icon: <Linkedin size={20} />, href: '#' },
  { name: 'X (Twitter)', icon: <Twitter size={20} />, href: '#' },
];

export default function Contact({ toggleContactModal }) {
  return (
    <section className="py-40 bg-black px-6 relative overflow-hidden" id="contact">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl md:text-9xl font-display font-black text-[#A1A1AA] tracking-tighter mb-10 leading-[0.9] uppercase">
              BE <span className="text-[#A1A1AA] opacity-40">SEEN.</span> <br />
              <span className="text-[#A1A1AA]/10">EVERYWHERE.</span>
            </h2>
            <div className="flex flex-col items-center gap-8">
              <p className="text-xl md:text-2xl text-[#A1A1AA]/40 max-w-2xl mx-auto leading-relaxed font-medium">
                Contact us to book your slot! <br />
                <span className="text-[#A1A1AA] font-black text-3xl md:text-5xl border-b-4 border-[#A1A1AA] pb-2 mt-4 inline-block tracking-tighter">+91 85902 04464</span>
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleContactModal}
                className="tech-button !bg-[#5B49AD] !text-white text-2xl px-16 py-10 flex items-center gap-4 group shadow-[0_0_30px_rgba(91,73,173,0.3)] hover:shadow-[0_0_50px_rgba(91,73,173,0.5)] mt-8"
                data-cursor="Let's Go"
              >
                For Enquiry <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        <div className="w-full max-w-5xl pt-16 border-t border-white/10 mx-auto">
          <div className="flex flex-wrap justify-center gap-10 md:gap-16">
            {socials.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="flex items-center gap-4 text-white/20 hover:text-white transition-all group"
              >
                <div className="w-14 h-14 rounded-full border border-white/5 bg-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:text-white group-hover:border-white/20 transition-all duration-500">
                  {social.icon}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] font-mono">{social.name}</span>
                  <CheckCircle2 size={12} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
