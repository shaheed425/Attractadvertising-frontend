import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import PortfolioManager from '../../components/admin/PortfolioManager';
import ServiceManager from '../../components/admin/ServiceManager';
import LogoManager from '../../components/admin/LogoManager';
import TeamManager from '../../components/admin/TeamManager';
import ContactManager from '../../components/admin/ContactManager';

const DashboardHome = () => (
  <div className="p-4 md:p-8 relative min-h-full">
    <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
    <h1 className="text-3xl md:text-4xl font-display font-black text-white mb-2 uppercase tracking-tight">Systems Online.</h1>
    <p className="text-white/40 font-medium text-base md:text-lg">Select a control module to manage the Attract Advertising platform.</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12 relative z-10">
      {[
        { title: 'Portfolio', count: 'Case Studies', color: 'bg-white/5 text-white border-white/10' },
        { title: 'Services', count: 'Packages', color: 'bg-white/5 text-white border-white/10' },
        { title: 'Logos', count: 'Partners', color: 'bg-white/5 text-white border-white/10' }
      ].map(stat => (
        <div key={stat.title} className="bg-white/5 backdrop-blur-3xl border border-white/10 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl hover:scale-[1.02] transition-transform duration-500">
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl mb-6 flex items-center justify-center border ${stat.color}`}>
            <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-current rounded-lg" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">{stat.title}</h3>
          <p className="text-white/20 text-sm font-bold uppercase tracking-widest">{stat.count}</p>
        </div>
      ))}
    </div>
  </div>
);

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row overflow-hidden font-body selection:bg-white/20 selection:text-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-black/80 backdrop-blur-md border-b border-white/10 z-40 sticky top-0 px-6">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 -ml-2 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h2 className="text-lg font-display font-black text-white uppercase tracking-tighter">
          ATTRACT<span className="text-[#5B49AD]">.</span>
        </h2>
        <div className="w-8" /> 
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className={`flex-1 md:ml-64 min-h-screen overflow-y-auto bg-black md:rounded-l-[3rem] md:my-4 shadow-2xl md:border md:border-white/10 transition-all duration-300 ${isSidebarOpen ? 'blur-sm md:blur-none pointer-events-none md:pointer-events-auto' : ''}`}>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="projects" element={<PortfolioManager />} />
          <Route path="services" element={<ServiceManager />} />
          <Route path="logos" element={<LogoManager />} />
          <Route path="team" element={<TeamManager />} />
          <Route path="leads" element={<ContactManager />} />
          <Route path="testimonials" element={<div className="p-8 text-white/20 lowercase italic">Testimonials Management Coming Soon</div>} />
        </Routes>
      </div>
    </div>
  );
}
