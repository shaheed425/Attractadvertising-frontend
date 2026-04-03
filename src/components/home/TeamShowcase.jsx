import axios from 'axios';
import { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { motion, AnimatePresence } from 'framer-motion';

const TeamMember = ({ member }) => (
  <motion.div
    className="relative group cursor-pointer flex-shrink-0 flex flex-col items-center px-4"
    whileHover={{ y: -8 }}
    transition={{ type: "spring", stiffness: 200, damping: 20 }}
  >
    <div className="relative w-48 h-64 md:w-56 md:h-80 overflow-hidden flex items-end justify-center">
      <img
        src={member.imageUrl?.startsWith('http') ? member.imageUrl : `${API_URL}${member.imageUrl}`}
        alt={member.role}
        className="w-full h-full object-cover transition-all duration-700 contrast-[1.1] brightness-[0.95] grayscale group-hover:grayscale-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_90%)]"
      />
    </div>

    <div className="mt-4 text-center">
      <p className="text-[10px] md:text-xs text-[#A1A1AA]/40 font-bold tracking-[0.3em] group-hover:text-white transition-colors duration-500 uppercase">
        {member.role}
      </p>
    </div>
  </motion.div>
);

export default function TeamShowcase() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`${API_URL}/api/team`);
        const data = await res.json();
        setTeam(data);
      } catch (error) {
        console.error('Error fetching team:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading || team.length === 0) return null;

  return (
    <section className="py-32 bg-black relative overflow-hidden" id="team">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="max-w-[1500px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[1fr,1.8fr] gap-12 lg:gap-20 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <h2 className="text-6xl md:text-8xl font-display text-[#A1A1AA] opacity-40 leading-[1.1] mb-8 uppercase">
              <span className="font-light block">You're Going</span>
              <span className="font-extralight italic block border-b-2 border-white/10 w-fit pb-2">To Love It</span>
              <span className="font-black block mt-2 text-[#A1A1AA]">Here!</span>
            </h2>
            <p className="text-sm md:text-base text-[#A1A1AA]/40 leading-relaxed font-medium max-w-sm mt-8">
              Working with this team feels like building something meaningful, we learn, grow, and win together.
            </p>
          </motion.div>

          <div 
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <motion.div
                className={`flex gap-16 md:gap-24 items-end ${team.length === 1 ? 'justify-center md:justify-center w-full' : ''}`}
                animate={isPaused || team.length <= 1 ? {} : { x: ["0%", "-100%"] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 60,
                    ease: "linear",
                  },
                }}
              >
                {(team.length > 1 ? [...team, ...team, ...team] : team).map((member, i) => (
                  <TeamMember key={`${member._id}-${i}`} member={member} />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-white/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-white/5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}
