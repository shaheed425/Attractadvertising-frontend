import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Mail, Phone, User, Building, MapPin, Calendar, Search, RefreshCcw } from 'lucide-react';
import { API_URL } from '../../config';

const ContactManager = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/contacts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setContacts(contacts.filter(contact => contact._id !== id));
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 pb-24">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">
            Inbound <span className="text-[#5B49AD]">Leads</span>
          </h1>
          <p className="text-white/40 font-medium text-sm md:text-base">Manage and respond to client inquiries from the website.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative group flex-1 sm:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#5B49AD] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3.5 text-sm text-white focus:outline-none focus:border-[#5B49AD] transition-all w-full sm:w-64"
            />
          </div>
          <button 
            onClick={fetchContacts}
            className="flex items-center justify-center p-3.5 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-40">
          <div className="w-10 h-10 border-2 border-[#5B49AD]/20 border-t-[#5B49AD] rounded-full animate-spin" />
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-40 bg-white/5 border border-white/10 rounded-[3rem] border-dashed">
          <p className="text-white/20 italic font-medium">No leads found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredContacts.map((contact) => (
              <motion.div
                key={contact._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:border-white/20 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6">
                  <button 
                    onClick={() => deleteContact(contact._id)}
                    className="p-3 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="w-16 h-16 bg-[#5B49AD]/20 rounded-2xl flex items-center justify-center text-[#5B49AD] shrink-0">
                    <User size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1 truncate">{contact.clientName}</h3>
                    <div className="flex items-center gap-2 text-[#5B49AD] text-[10px] font-bold uppercase tracking-widest truncate">
                      <Building size={12} className="shrink-0" />
                      {contact.companyName}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-white/5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-white/40 group-hover:text-white transition-colors">
                      <Mail size={16} className="text-[#5B49AD]" />
                      <span className="text-sm font-medium">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/40 group-hover:text-white transition-colors">
                      <Phone size={16} className="text-[#5B49AD]" />
                      <span className="text-sm font-medium">{contact.mobileNumber}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-white/40 group-hover:text-white transition-colors">
                      <MapPin size={16} className="text-[#5B49AD]" />
                      <span className="text-sm font-medium">{contact.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/40 group-hover:text-white transition-colors">
                      <Calendar size={16} className="text-[#5B49AD]" />
                      <span className="text-sm font-medium">
                        {new Date(contact.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ContactManager;
