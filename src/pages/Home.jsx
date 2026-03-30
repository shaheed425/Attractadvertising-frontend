import React from 'react';
import CustomCursor from '../components/ui/CustomCursor';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import Logos from '../components/home/Logos';
import CorePackage from '../components/home/CorePackage';
import Portfolio from '../components/home/Portfolio';
import IncludedServices from '../components/home/IncludedServices';
import PremiumAddOns from '../components/home/PremiumAddOns';
import CostSummary from '../components/home/CostSummary';
import TeamShowcase from '../components/home/TeamShowcase';
import FAQ from '../components/home/FAQ';
import Contact from '../components/home/Contact';
import Footer from '../components/layout/Footer';

const Home = ({ toggleContactModal }) => {
  return (
    <div className="min-h-screen bg-black text-white relative font-body selection:bg-white selection:text-black">
      <CustomCursor />
      <Navbar toggleContactModal={toggleContactModal} />
      <div className="relative">
        {/* Site-wide grid background overlay */}
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none -z-10" />
        
        <Hero />
        <Logos />
        <CorePackage />
        <Portfolio />
        <IncludedServices />
        <PremiumAddOns />
        <CostSummary />
        <TeamShowcase />
        <FAQ />
        <Contact toggleContactModal={toggleContactModal} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
