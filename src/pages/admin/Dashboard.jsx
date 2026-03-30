import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import PortfolioManager from '../../components/admin/PortfolioManager';
import ServiceManager from '../../components/admin/ServiceManager';
import LogoManager from '../../components/admin/LogoManager';
import TeamManager from '../../components/admin/TeamManager';
import ContactManager from '../../components/admin/ContactManager';

const DashboardHome = () => (
  <div className="p-8 relative min-h-full">
    <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
    <h1 className="text-4xl font-display font-black text-white mb-2 uppercase tracking-tight">Systems Online.</h1>
    <p className="text-white/40 font-medium text-lg">Select a control module to manage the Attract Advertising platform.</p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 relative z-10">
      {[
        { title: 'Portfolio', count: 'Case Studies', color: 'bg-white/5 text-white border-white/10' },
        { title: 'Services', count: 'Packages', color: 'bg-white/5 text-white border-white/10' },
        { title: 'Logos', count: 'Partners', color: 'bg-white/5 text-white border-white/10' }
      ].map(stat => (
        <div key={stat.title} className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl hover:scale-[1.02] transition-transform duration-500">
          <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center border ${stat.color}`}>
            <div className="w-6 h-6 border-2 border-current rounded-lg" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">{stat.title}</h3>
          <p className="text-white/20 text-sm font-bold uppercase tracking-widest">{stat.count}</p>
        </div>
      ))}
    </div>
  </div>
);

export default function Dashboard() {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-black flex overflow-hidden font-body selection:bg-white/20 selection:text-white">
      <Sidebar />
      <div className="flex-1 ml-64 min-h-screen overflow-y-auto bg-black rounded-l-[3rem] my-4 shadow-2xl border border-white/10">
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
