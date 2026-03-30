import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.png';

const Navbar = ({ toggleContactModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Included', href: '#included' },
    { name: 'Add-Ons', href: '#addons' },
    { name: 'Summary', href: '#summary' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // Adjust based on navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${isScrolled ? 'bg-black/90 backdrop-blur-xl py-2 md:py-3 border-b border-white/5' : 'bg-transparent py-4 md:py-6'}`}>
      <div className="w-full px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative h-12 md:h-16 w-40 md:w-48 cursor-pointer group"
          onClick={() => handleNavClick('#')}
        >
          <img 
            src={logo} 
            alt="Attract Advertising" 
            className="absolute top-1/2 left-0 -translate-y-1/2 h-[80px] md:h-[120px] w-auto max-w-none object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link, i) => (
            <motion.div 
              key={link.name} 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative group"
            >
              <button 
                onClick={() => handleNavClick(link.href)}
                className="text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-1.5 py-2 text-[#A1A1AA]/60 hover:text-white"
              >
                {link.name}
              </button>

              {/* Hover Dot Indicator */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#5B49AD] rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_10px_#5B49AD]" />
            </motion.div>
          ))}
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-4 md:gap-8">
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={toggleContactModal}
            className="hidden sm:block tech-button !bg-[#5B49AD] !text-white px-6 md:px-8 py-2 md:py-3 !text-[10px] md:text-[11px] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(91,73,173,0.3)] hover:shadow-[0_0_30px_rgba(91,73,173,0.5)]"
          >
            For Enquiry
          </motion.button>
          
          {/* Mobile Toggle */}
          <button 
            className="lg:hidden text-white p-2 relative z-[110]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="flex flex-col gap-1.5 w-6">
              <div className={`h-0.5 bg-white transition-all duration-500 ${mobileMenuOpen ? 'rotate-45 translate-y-2 w-6' : 'w-6'}`} />
              <div className={`h-0.5 bg-white transition-all duration-500 ${mobileMenuOpen ? 'opacity-0 scale-x-0' : 'w-4'}`} />
              <div className={`h-0.5 bg-white transition-all duration-500 ${mobileMenuOpen ? '-rotate-45 -translate-y-2 w-6' : 'w-5'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 bg-black z-[101] flex flex-col h-screen p-10 md:p-20 lg:hidden"
          >
            <div className="flex flex-col gap-8 flex-1 pt-24">
              {navLinks.map((link, i) => (
                <motion.button 
                  key={link.name}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  onClick={() => handleNavClick(link.href)}
                  className="text-2xl md:text-6xl font-display font-black text-[#A1A1AA] hover:text-white uppercase tracking-tighter hover:translate-x-4 transition-all text-left"
                >
                  {link.name}
                </motion.button>
              ))}
            </div>

            <div className="mt-auto pb-10">
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  toggleContactModal();
                }}
                className="w-full tech-button !bg-[#5B49AD] !text-white py-6 text-xl shadow-[0_0_40px_rgba(91,73,173,0.4)] transition-transform active:scale-95 uppercase font-black tracking-widest rounded-full"
              >
                Get in Touch
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;