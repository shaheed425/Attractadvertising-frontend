import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';

export default function TeamAdmin() {
  const [members, setMembers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState({ name: '', role: '', imageUrl: '', tagline: '' });
  const [editId, setEditId] = useState(null);

  const fetchMembers = async () => {
    const res = await fetch('http://localhost:5001/api/team');
    const data = await res.json();
    setMembers(data);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `http://localhost:5001/api/team/${editId}` : 'http://localhost:5001/api/team';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(currentMember)
    });

    if (res.ok) {
      setIsEditing(false);
      setCurrentMember({ name: '', role: '', imageUrl: '', tagline: '' });
      setEditId(null);
      fetchMembers();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`http://localhost:5001/api/team/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchMembers();
  };

  const startEdit = (member) => {
    setCurrentMember(member);
    setEditId(member._id);
    setIsEditing(true);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-display font-bold text-white">Manage Team</h1>
        <button 
          onClick={() => { setIsEditing(true); setEditId(null); setCurrentMember({ name: '', role: '', imageUrl: '', tagline: '' }); }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/80 transition-all"
        >
          <Plus size={20} /> Add Member
        </button>
      </div>

      {isEditing && (
        <div className="glass-card p-8 rounded-3xl border border-white/10 mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{editId ? 'Edit' : 'Add'} Team Member</h2>
            <button onClick={() => setIsEditing(false)} className="text-textMuted hover:text-white"><X /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              type="text" placeholder="Name" className="bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-primary"
              value={currentMember.name} onChange={(e) => setCurrentMember({...currentMember, name: e.target.value})} required
            />
            <input 
              type="text" placeholder="Role" className="bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-primary"
              value={currentMember.role} onChange={(e) => setCurrentMember({...currentMember, role: e.target.value})} required
            />
            <input 
              type="text" placeholder="Image URL" className="bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-primary"
              value={currentMember.imageUrl} onChange={(e) => setCurrentMember({...currentMember, imageUrl: e.target.value})} required
            />
            <input 
              type="text" placeholder="Tagline" className="bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-primary"
              value={currentMember.tagline} onChange={(e) => setCurrentMember({...currentMember, tagline: e.target.value})}
            />
            <div className="md:col-span-2">
              <button type="submit" className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:shadow-[0_0_30px_rgba(179,71,255,0.4)] transition-all flex items-center justify-center gap-2">
                <Check size={20} /> {editId ? 'Update' : 'Save'} Member
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(member => (
          <div key={member._id} className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col items-center text-center group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/50 mb-4 group-hover:scale-110 transition-transform">
              <img src={member.imageUrl} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold text-white">{member.name}</h3>
            <p className="text-primary text-sm mb-2">{member.role}</p>
            <p className="text-textMuted text-xs mb-6 italic">"{member.tagline}"</p>
            <div className="flex gap-4 w-full mt-auto">
              <button onClick={() => startEdit(member)} className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg flex items-center justify-center gap-2 transition-all"><Edit2 size={16} /> Edit</button>
              <button onClick={() => handleDelete(member._id)} className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg flex items-center justify-center gap-2 transition-all"><Trash2 size={16} /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
