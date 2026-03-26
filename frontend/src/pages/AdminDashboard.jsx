import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  User,
  Building2, 
  ShieldCheck, 
  ShieldAlert, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Search,
  Filter
} from 'lucide-react';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { currentUser, userData, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');

  // Security Gate - REMOVED for direct access
  const isAdmin = true;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);

      const companiesSnapshot = await getDocs(collection(db, "companies"));
      const companiesData = companiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCompanies(companiesData);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
    setLoading(false);
  };

  // ... (toggle functions) ...

  const toggleUserMembership = async (userId, currentRole) => {
    const newRole = currentRole === 'member' ? 'user' : 'member';
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  const toggleCompanyStatus = async (companyId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'pending' : 'active';
    try {
      await updateDoc(doc(db, "companies", companyId), { status: newStatus });
      setCompanies(companies.map(c => c.id === companyId ? { ...c, status: newStatus } : c));
    } catch (err) {
      console.error("Error updating company status:", err);
    }
  };

  // No redirect

  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCompanies = companies.filter(c => 
    (c.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 overflow-hidden">
      {/* Background flair */}
      <div className="absolute top-0 right-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[140px] -z-10 animate-pulse pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto reveal">
        <header className="mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white shadow-premium border border-slate-100 mb-8 text-[10px] font-black uppercase tracking-[.2em] text-primary">
            <ShieldCheck size={14} className="animate-pulse" />
            Administrative Override
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-6">
            Ecosystem <span className="gradient-text italic font-serif text-6xl md:text-8xl">Control</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-xl italic">
            Manage stakeholders, verify businesses, and curate the premium JCI network.
          </p>
        </header>

        {/* Search and Tabs */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16">
          <div className="flex bg-slate-100/50 backdrop-blur-3xl p-2 rounded-[2rem] border border-slate-200/50 w-full lg:w-96 shadow-sm">
            <button 
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 ${activeTab === 'users' ? 'bg-white text-primary shadow-premium scale-[1.02]' : 'text-slate-400 hover:text-slate-900'}`}
            >
              <Users size={20} strokeWidth={2.5} />
              Users
            </button>
            <button 
              onClick={() => setActiveTab('companies')}
              className={`flex-1 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 ${activeTab === 'companies' ? 'bg-white text-primary shadow-premium scale-[1.02]' : 'text-slate-400 hover:text-slate-900'}`}
            >
              <Building2 size={20} strokeWidth={2.5} />
              Companies
            </button>
          </div>

          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="input-premium pl-16 py-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">Synchronizing Data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {activeTab === 'users' ? (
              filteredUsers.map((user, index) => (
                <div key={user.id} className="glass-card p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-10 reveal" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-primary font-black text-3xl shadow-glow">
                      {user.name?.charAt(0) || user.email?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 mb-1">{user.name || 'Anonymous'}</h4>
                      <p className="text-slate-500 font-medium mb-3">{user.email}</p>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.role === 'admin' ? 'bg-red-50 text-red-500 border-red-200' : user.role === 'member' ? 'bg-green-50 text-green-500 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                          {user.role || 'user'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => toggleUserMembership(user.id, user.role)}
                        className={`flex-1 md:flex-none py-4 px-8 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${user.role === 'member' ? 'bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100' : 'bg-green-500 text-white shadow-lg shadow-green-200 hover:bg-green-600'}`}
                      >
                        {user.role === 'member' ? 'Revoke Membership' : 'Verify as Member'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              filteredCompanies.map((company, index) => (
                <div key={company.id} className="glass-card p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-10 reveal" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-[2rem] bg-white border border-slate-100 shadow-premium overflow-hidden flex items-center justify-center flex-shrink-0">
                      {company.logo ? (
                        <img src={company.logo} alt={company.companyName} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="text-primary" size={40} />
                      )}
                    </div>
                    <div>
                      <h4 className="text-3xl font-black text-slate-900 mb-2">{company.companyName}</h4>
                      <p className="text-slate-500 font-medium mb-4 flex items-center gap-2">
                        <User size={16} /> Owner: {company.name}
                      </p>
                      <div className="flex gap-3">
                        {company.services?.slice(0, 3).map((s, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-500 font-bold">
                            {typeof s === 'object' ? s.name : s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 ${company.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                      <div className={`w-2 h-2 rounded-full ${company.status === 'active' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></div>
                      {company.status || 'pending'}
                    </div>
                    <button 
                      onClick={() => toggleCompanyStatus(company.id, company.status)}
                      className={`flex-1 md:flex-none py-4 px-8 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${company.status === 'active' ? 'bg-slate-100 text-slate-400 hover:bg-amber-50 hover:text-amber-500' : 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-secondary'}`}
                    >
                      {company.status === 'active' ? 'Deactivate' : 'Approve & Go Live'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
