import React, { useState, useEffect } from 'react';
import BusinessCard from '../components/BusinessCard';
import { Search, Users, Briefcase, Award } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import banner1 from '../assets/b1.jpg';

const banners = [
  banner1,
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80"
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "companies"));
        const comps = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status === 'active') {
            comps.push({
              id: doc.id,
              ...data,
              companyName: data.description || data.companyName || ''
            });
          }
        });
        setBusinesses(comps);
      } catch (error) {
        console.error("Error fetching companies: ", error);
      }
    };
    fetchBusinesses();
  }, []);

  const filteredBusinesses = businesses.filter(biz =>
    (biz.name && biz.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (biz.companyName && biz.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (biz.services && biz.services.some(service => {
      const name = typeof service === 'object' ? service.name : service;
      return name && name.toLowerCase().includes(searchQuery.toLowerCase());
    }))
  );

  return (
    <div className="w-full px-6 md:px-12 py-20 fade-in">
      <header className="relative mb-24 text-center w-full mx-auto py-24 px-6 rounded-[3rem] overflow-hidden shadow-sm border border-slate-200">
        {/* Banner Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[80%] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[80%] bg-secondary/10 blur-[100px] rounded-full pointer-events-none"></div>
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center mix-blend-multiply transition-opacity duration-1000 ease-in-out ${currentBanner === index ? 'opacity-80' : 'opacity-0'
              }`}
            style={{ backgroundImage: `url('${banner}')` }}
          ></div>
        ))}

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-slate-200 shadow-sm backdrop-blur-md mb-8 text-primary font-bold text-sm tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Official JCI Directory
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-slate-900">
            <span className='text-white opacity-80'>Discover</span> <span className="gradient-text">Premium</span> <br />    <span className='text-white opacity-80'>Services</span>
          </h1>
          <p className="text-xl text-slate-600 opacity-80 mb-12 mx-auto leading-relaxed text-white">
            Connect with top-tier service providers and elevate your professional network with JCI.
          </p>

          <div className="relative flex items-center w-full max-w-3xl mx-auto p-2 h-20 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl">
            <div className="pl-6 text-slate-500">
              <Search size={28} />
            </div>
            <input
              type="text"
              placeholder="Search for Services..."
              className="flex-1 bg-transparent border-none outline-none px-6 text-xl text-slate-900 placeholder:text-slate-400 focus:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn-premium h-full px-12 text-lg">Search</button>
          </div>
        </div>
      </header>
    


      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredBusinesses.map((biz, index) => (
          <BusinessCard key={index} business={biz} />
        ))}
        {filteredBusinesses.length === 0 && (
          <div className="col-span-full text-center py-20">
            <p className="text-2xl text-slate-500 italic">No businesses found matching "{searchQuery}"</p>
          </div>
        )}
      </section>

      {/* Counters Section */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-all fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <Users size={32} />
          </div>
          <h3 className="text-5xl font-black text-slate-800 mb-2">100+</h3>
          <p className="text-lg text-slate-500 font-medium tracking-wide uppercase">Happy Customers</p>
        </div>

        <div className="flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-all fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-4">
            <Briefcase size={32} />
          </div>
          <h3 className="text-5xl font-black text-slate-800 mb-2">1000+</h3>
          <p className="text-lg text-slate-500 font-medium tracking-wide uppercase">Services Offered</p>
        </div>

        <div className="flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-all fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-600 mb-4">
            <Award size={32} />
          </div>
          <h3 className="text-5xl font-black text-slate-800 mb-2">50+</h3>
          <p className="text-lg text-slate-500 font-medium tracking-wide uppercase">Partnerships</p>
        </div>


        

      </section>



              {/* Become Member Banner */}
      <section className="mt-10 reveal">
        <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-8 md:p-16 text-white shadow-2xl group">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 group-hover:bg-primary/30 transition-colors duration-700"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 group-hover:bg-secondary/20 transition-colors duration-700"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-center lg:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-8 text-indigo-300 font-bold text-xs tracking-[0.2em] uppercase">
                Elevate Your Career
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">
                Become a <span className="gradient-text italic font-serif">JCI Member</span> <br /> Today
              </h2>
              <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                Join our exclusive network of professionals and entrepreneurs. Gain access to premium opportunities, mentorship, and a global community dedicated to excellence.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
              <button 
                onClick={() => window.location.href = '/signup'}
                className="btn-premium py-5 px-12 text-lg whitespace-nowrap shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] border-none"
              >
                Join JCI Now
              </button>
              <button className="px-12 py-5 rounded-2xl border border-white/20 hover:bg-white/10 transition-all font-bold text-lg whitespace-nowrap backdrop-blur-sm">
                Learn More
              </button>
            </div>
          </div>
          
          {/* Decorative stats or proof points */}
          <div className="mt-16 pt-16 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
            <div>
              <p className="text-3xl font-black mb-1">Global</p>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Networking</p>
            </div>
            <div>
              <p className="text-3xl font-black mb-1">Elite</p>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Opportunities</p>
            </div>
            <div>
              <p className="text-3xl font-black mb-1">Expert</p>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Mentorship</p>
            </div>
            <div>
              <p className="text-3xl font-black mb-1">100%</p>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Growth</p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;
