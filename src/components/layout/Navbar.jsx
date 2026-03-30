import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import logo from '../../assets/logo.png';

const Navbar = ({ toggleContactModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

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

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${isScrolled ? 'bg-black/80 backdrop-blur-xl py-1 border-b border-white/10' : 'bg-transparent py-2'}`}>
      <div className="max-w-[1500px] mx-auto px-6 md:px-10 flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative h-16 w-48 cursor-pointer group"
          data-cursor="Home"
        >
          <img 
            src={logo} 
            alt="Attract Advertising" 
            className="absolute top-1/2 left-0 -translate-y-1/2 h-[120px] w-auto max-w-none object-contain transition-transform duration-500 group-hover:scale-105"
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
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a 
                href={link.href} 
                className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-1.5 py-2 ${activeDropdown === link.name ? 'text-white' : 'text-[#A1A1AA]/40 hover:text-white'}`}
              >
                {link.name}
                {link.dropdown && <ChevronDown size={12} className={`transition-transform duration-500 ${activeDropdown === link.name ? 'rotate-180 text-white' : 'opacity-40'}`} />}
              </a>

              {/* Hover Dot Indicator */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />

              {/* Dropdown */}
              <AnimatePresence>
                {link.dropdown && activeDropdown === link.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-72 bg-black border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl p-3 mt-4"
                  >
                    <div className="absolute inset-0 bg-white/2 pointer-events-none" />
                    {link.dropdown.map((item) => (
                      <a 
                        key={item} 
                        href="#" 
                        className="block px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 rounded-2xl transition-all group/item"
                      >
                        <div className="flex items-center justify-between">
                          {item}
                          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        </div>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-8">
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={toggleContactModal}
            className="hidden sm:block tech-button !bg-[#5B49AD] !text-white px-8 py-3 !text-[11px] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(91,73,173,0.3)] hover:shadow-[0_0_30px_rgba(91,73,173,0.5)]"
            data-cursor="Connect"
          >
            For Enquiry
          </motion.button>
          
          {/* Mobile Toggle */}
          <button 
            className="lg:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="flex flex-col gap-1.5 w-6">
              <div className={`h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2 w-6' : 'w-6'}`} />
              <div className={`h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'w-4'}`} />
              <div className={`h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2 w-6' : 'w-5'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-black z-[101] flex flex-col p-10 lg:hidden"
          >
            <div className="flex justify-between items-center mb-16">
              <div className="flex items-center">
              <div className="relative h-20 w-48">
                <img 
                  src={logo} 
                  alt="Attract Advertising" 
                  className="absolute top-1/2 left-0 -translate-y-1/2 h-[120px] w-auto max-w-none object-contain"
                />
              </div>
              </div>
              <button 
                className="text-white p-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={32} />
              </button>
            </div>

            <div className="flex flex-col gap-8 overflow-y-auto pb-12 flex-1">
              {navLinks.map((link, i) => (
                <motion.div 
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <a 
                    href={link.href} 
                    className="text-4xl font-display font-black text-white hover:text-white/60 transition-colors block mb-4"
                  >
                    {link.name}
                  </a>
                  {link.dropdown && (
                    <div className="ml-4 flex flex-col gap-4 border-l border-white/10 pl-6">
                      {link.dropdown.map(item => (
                        <a key={item} href="#" className="text-sm font-bold uppercase tracking-widest text-white/40 hover:text-white">{item}</a>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                toggleContactModal();
              }}
              className="w-full tech-button !bg-[#5B49AD] !text-white py-6 text-xl mt-8 shadow-[0_0_20px_rgba(91,73,173,0.3)]"
            >
              Get in Touch
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
