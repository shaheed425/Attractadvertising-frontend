import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative z-10"
      >
        <h2 className="text-2xl md:text-3xl font-display font-black text-center mb-8 md:mb-10 text-white tracking-tight uppercase">Clearance Required</h2>
        
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm text-center font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white opacity-40 ml-2">Username</label>
            <input 
              type="text" 
              placeholder="Enter ID" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-white outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white opacity-40 ml-2">Security Key</label>
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary outline-none transition-all pr-14"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-[#5B49AD] text-white font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(91,73,173,0.3)] mt-4"
          >
            {loading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
