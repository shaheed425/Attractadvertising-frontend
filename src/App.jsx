import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SmoothScroll from './components/layout/SmoothScroll';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import IntroAnimation from './components/common/IntroAnimation';
import ContactModal from './components/home/ContactModal';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const toggleContactModal = () => setIsContactModalOpen(!isContactModalOpen);

  return (
    <Router>
      <div className="relative">
        <AnimatePresence mode="wait">
          {showIntro ? (
            <IntroAnimation key="intro" onComplete={() => setShowIntro(false)} />
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <SmoothScroll>
                <Routes>
                  <Route path="/" element={<Home toggleContactModal={toggleContactModal} />} />
                  <Route path="/project/:id" element={<ProjectDetail toggleContactModal={toggleContactModal} />} />
                  <Route path="/admin/login" element={<Login />} />
                  <Route path="/admin/*" element={<Dashboard />} />
                </Routes>
                <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
              </SmoothScroll>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
