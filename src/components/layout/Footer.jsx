import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Youtube, Facebook, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-32 pb-16 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24 mb-24">
          {/* Brand & Tagline */}
          <div className="flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-3xl font-display font-black text-white mb-8 tracking-tighter uppercase"
            >
              ATTRACT<span className="text-white opacity-40">.</span>
            </motion.div>
            <p className="text-lg text-white/40 leading-relaxed mb-6 max-w-xs font-medium italic">
              "STOP WAITING FOR CUSTOMERS TO FIND YOU. WALK YOUR BRAND STRAIGHT TO THEM."
            </p>
            <a
              href="https://www.instagram.com/Stackxxio_/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 mb-10 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                <Instagram size={18} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover:text-white/40 transition-colors tracking-[0.4em]">Developed By</p>
                <p className="text-sm font-bold tracking-widest text-white group-hover:text-primary transition-colors">@Stackxxio_</p>
              </div>
            </a>
            <div className="flex gap-4">
              {[
                { icon: <Instagram size={20} />, label: 'Instagram', href: 'https://www.instagram.com/Stackxxio_/' },
                { icon: <Twitter size={20} />, label: 'Twitter', href: '#' },
                { icon: <Linkedin size={20} />, label: 'LinkedIn', href: '#' },
                { icon: <Facebook size={20} />, label: 'Facebook', href: '#' },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:border-white hover:text-white transition-all duration-300 shadow-2xl"
                  title={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="flex flex-col md:items-start lg:items-center">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white opacity-40 mb-10">Solutions</h4>
              <ul className="space-y-6 text-sm font-bold uppercase tracking-widest text-white/20">
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#included" className="hover:text-primary transition-colors">Included</a></li>
                <li><a href="#addons" className="hover:text-primary transition-colors">Add-ons</a></li>
                <li><a href="#summary" className="hover:text-primary transition-colors">Summary</a></li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white opacity-40 mb-10">Global Reach</h4>
            <div className="space-y-8">
              <div className="flex items-start gap-5 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2 group-hover:bg-white/10 transition-colors">
                  <MapPin size={20} className="text-white" />
                </div>
                <div className="text-sm text-white/40 leading-relaxed font-medium">
                  <p className="text-white font-bold uppercase tracking-widest mb-2">Connect Now</p>
                  Contact us to book your slot!
                </div>
              </div>
              <div className="flex items-start gap-5 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2 group-hover:bg-white/10 transition-colors">
                  <Phone size={20} className="text-white" />
                </div>
                <div className="text-sm text-white/40 leading-relaxed font-medium">
                  <p className="text-white font-bold uppercase tracking-widest mb-2">Connect</p>
                  <div className="flex flex-col gap-1">
                    <a href="tel:+918590204464" className="hover:text-white transition-colors">+91 85902 04464</a>
                    <a href="tel:+916282546530" className="hover:text-white transition-colors">+91 62825 46530</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/10">
            © {new Date().getFullYear()} ATTRACT ADVERTISING. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-10 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10">
            <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-white transition-colors">TERMS</a>
            <a href="#" className="hover:text-white transition-colors">CAREER</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
