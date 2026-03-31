import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Image, Settings, LogOut, Users, MessageSquare } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/admin/projects', icon: <Image size={20} /> },
    { name: 'Services', path: '/admin/services', icon: <Settings size={20} /> },
    { name: 'Logos', path: '/admin/logos', icon: <Users size={20} /> },
    { name: 'Team', path: '/admin/team', icon: <Users size={20} /> },
    { name: 'Leads', path: '/admin/leads', icon: <MessageSquare size={20} /> },
    { name: 'Testimonials', path: '/admin/testimonials', icon: <MessageSquare size={20} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] md:hidden"
          onClick={onClose}
        />
      )}

      <div className={`w-64 h-screen bg-black border-r border-white/10 flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8">
          <div className="flex justify-between items-center md:block">
            <div>
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter">
                ATTRACT<span className="text-white opacity-40">.</span>
              </h2>
              <p className="text-[10px] font-bold text-white uppercase tracking-[0.3em] mt-1 opacity-40 lowercase">Admin Control</p>
            </div>
            <button className="md:hidden text-white/40 hover:text-white" onClick={onClose}>
              <LogOut size={20} className="rotate-180" />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-2 mt-4 overflow-y-auto custom-scrollbar">
          {links.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => {
                  if (window.innerWidth < 768) onClose();
                }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#5B49AD] text-white shadow-[0_0_20px_rgba(91,73,173,0.3)] scale-[1.02]' 
                    : 'text-white/40 hover:bg-white/5 hover:text-white hover:shadow-sm'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-white/20'}>{link.icon}</span>
                <span className="font-bold text-sm uppercase tracking-wide">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button 
            onClick={() => {
              localStorage.removeItem('adminToken');
              window.location.href = '/admin/login';
            }}
            className="flex items-center gap-3 px-4 py-3.5 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all w-full font-bold uppercase tracking-widest text-xs"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
