import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Store, LogIn, Sparkles, Search, X, Building2, LogOut, Bell, Menu, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showJoinDropdown, setShowJoinDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { currentUser, userData, logout } = useAuth();
  
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }

    const q = query(
      collection(db, "notifications"),
      where("receiverId", "==", currentUser.uid),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = [];
      snapshot.forEach(doc => notifs.push({ id: doc.id, ...doc.data() }));
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [currentUser]);
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  // Is user admin?
  const isAdmin = userData?.role === 'admin' || currentUser?.email === 'admin@jci.com';

  // ... rest of the existing useEffects (scroll, fetchCompanies, search) ...

  const [allBusinesses, setAllBusinesses] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "companies"));
        const comps = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          comps.push({
            id: doc.id,
            ...data,
            companyName: data.description || data.companyName || ''
          });
        });
        setAllBusinesses(comps);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allBusinesses.filter(biz =>
        (biz.name && biz.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (biz.companyName && biz.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (biz.services && biz.services.some(service => {
          const name = typeof service === 'object' ? service.name : service;
          return name && name.toLowerCase().includes(searchQuery.toLowerCase());
        }))
      ).slice(0, 5);
      setSearchResults(filtered);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery, allBusinesses]);

  const handleSelectBusiness = (id) => {
    navigate(`/business/${id}`);
    setSearchQuery('');
    setShowDropdown(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[60] h-20 px-6 md:px-12 flex items-center justify-between transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-lg border-b border-slate-200' : 'glass-navbar'}`}>
        {/* Left: Logo */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex items-center gap-4 group flex-shrink-0">
            <div className="flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
              <img src={logo} alt="JCI Logo" className="w-16 h-16 md:w-26 md:h-26 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            </div>
          </Link>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="flex-1 flex justify-center max-w-2xl px-4">
          {location.pathname !== '/' && (
            <div className="relative hidden lg:block w-full">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search premium companies..."
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-3 pl-12 pr-10 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {showDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-card overflow-hidden shadow-2xl animate-in slide-in-from-top-2 duration-300">
                  <div className="p-2">
                    {searchResults.map((business) => (
                      <div
                        key={business.id}
                        onClick={() => handleSelectBusiness(business.id)}
                        className="px-4 py-3 rounded-xl hover:bg-slate-100 text-sm text-slate-600 hover:text-slate-900 cursor-pointer transition-colors flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200 flex-shrink-0">
                          {business.logo ? (
                            <img src={business.logo} alt={business.name} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 size={14} className="text-primary" />
                          )}
                        </div>
                        <div className="flex-1 truncate">
                          <p className="font-bold text-slate-900">{business.name}</p>
                          <p className="text-xs text-slate-500 truncate">{business.companyName || ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Navigation (Desktop & Hamburger) */}
        <div className="flex-1 flex justify-end items-center gap-2 md:gap-8">
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Home</Link>
            <Link to="/admin" className="text-sm font-bold text-primary hover:text-secondary transition-colors flex items-center gap-2"><ShieldCheck size={16} />Admin</Link>

            <div className="relative">
              <button
                onClick={() => setShowJoinDropdown(!showJoinDropdown)}
                className="text-sm font-bold text-primary hover:text-secondary transition-colors focus:outline-none flex items-center gap-1"
              >
                Join Us
                <svg className={`w-3 h-3 transition-transform ${showJoinDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showJoinDropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-40 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  <div className="p-2 space-y-1">
                    <Link to="/signup" className="block px-3 py-2 text-sm text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium text-center">Members</Link>
                    <Link to="/signup" className="block px-3 py-2 text-sm text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium text-center">Become a Member</Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {currentUser ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                onBlur={() => setTimeout(() => setShowProfileDropdown(false), 200)}
                className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors focus:outline-none"
              >
                {currentUser.photoURL ? <img src={currentUser.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" /> : <User size={20} />}
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 glass-card border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-slate-200">
                    <p className="text-sm text-slate-900 font-medium truncate">{currentUser.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <Link to="/admin" className="flex items-center gap-3 px-3 py-2 text-sm text-primary hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors font-bold"><ShieldCheck size={16} />Admin Dashboard</Link>
                    <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"><User size={16} />Profile</Link>
                    <Link to="/notifications" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"><Bell size={16} />Notifications</Link>
                    <button onClick={() => logout()} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"><LogOut size={16} />Logout</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Login</Link>
              <Link to="/signup" className="btn-premium flex items-center gap-2 py-2 px-6">
                <User size={18} />
                <span>Join Now</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-slate-600 hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-[80] shadow-2xl flex flex-col"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-10">
                  <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto">
                  {/* Mobile Search */}
                  {location.pathname !== '/' && (
                    <div className="relative mb-8 pt-2">
                      <div className="relative bg-slate-100 rounded-2xl border border-slate-200 p-2">
                        <div className="flex items-center gap-3 px-3">
                          <Search className="text-slate-400" size={18} />
                          <input
                            type="text"
                            placeholder="Search companies..."
                            className="bg-transparent border-none focus:ring-0 text-sm w-full py-2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                      {searchQuery && searchResults.length > 0 && (
                        <div className="mt-2 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                          {searchResults.map(b => (
                            <div key={b.id} onClick={() => { handleSelectBusiness(b.id); setIsMenuOpen(false); }} className="px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-none flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                {b.logo ? <img src={b.logo} className="w-full h-full object-cover rounded-lg" /> : <Building2 size={14} />}
                              </div>
                              <span className="text-sm font-bold truncate">{b.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-primary transition-all font-bold">
                    Home
                  </Link>

                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-primary/5 text-primary hover:bg-primary/10 transition-all font-bold">
                    <ShieldCheck size={20} />
                    Admin Dashboard
                  </Link>

                  {currentUser ? (
                    <>
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-primary transition-all font-bold">
                        <User size={20} />
                        Profile
                      </Link>
                      <Link to="/notifications" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-primary transition-all font-bold">
                        <Bell size={20} />
                        Notifications
                        {notifications.length > 0 && <span className="w-2 h-2 bg-primary rounded-full"></span>}
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-primary transition-all font-bold">
                        Login
                      </Link>
                      <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="mx-4 mt-4 btn-premium flex items-center justify-center gap-2 py-4 rounded-2xl">
                        <User size={18} />
                        Join Now
                      </Link>
                    </>
                  )}
                </div>

                {currentUser && (
                  <div className="pt-6 border-t border-slate-100 italic">
                    <button
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold"
                    >
                      <LogOut size={20} />
                      Logout
                    </button>
                    <p className="px-4 py-2 text-xs text-slate-400 font-medium truncate">{currentUser.email}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
