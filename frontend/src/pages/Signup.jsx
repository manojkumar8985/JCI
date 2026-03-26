import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, Globe, Info, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import InputField from '../components/InputField';
import bgImage from '../assets/background.jpg';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    services: [{ name: '', price: '' }],
    website: '',
    logo: ''
  });

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { name: '', price: '' }]
    });
  };

  const removeService = (index) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    setFormData({ ...formData, services: newServices });
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...formData.services];
    newServices[index][field] = value;
    setFormData({ ...formData, services: newServices });
  };


  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await googleLogin();
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to sign up with Google. ' + err.message);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const { user } = await signup(formData.email, formData.password);
      
      // Save user profile data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        role: role, // 'user' or 'business'
        createdAt: new Date()
      });

      // If it's a business, also save initial company data if provided
      if (role === 'business' && formData.companyName) {
        const cleanedServices = formData.services
          .filter(s => s.name.trim() !== '')
          .map(s => ({
            name: s.name.trim(),
            price: s.price ? parseInt(s.price) : 1000
          }));

        await setDoc(doc(db, "companies", user.uid), {
          ownerId: user.uid,
          name: formData.name,
          companyName: formData.companyName,
          services: cleanedServices,
          website: formData.website,
          logo: formData.logo,
          email: formData.email,
          status: 'pending',
          createdAt: new Date()
        });
      }

      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to create an account. ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center py-20 px-6 fade-in"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Light Overlay */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]"></div>

      <div className="glass-card w-full max-w-5xl overflow-hidden flex flex-col lg:flex-row shadow-2xl relative z-10">
        {/* Left Side - Info */}
        <div className="w-full lg:w-[40%] bg-gradient-to-br from-indigo-700 via-indigo-600 to-cyan-600 p-12 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-black mb-6 leading-tight">Start Your <br />Premium Journey</h2>
            <p className="text-lg text-white/70 leading-relaxed mb-8">
              {role === 'user'
                ? "Join our elite community and discover top-tier businesses tailored to your high standards."
                : "Scale your business with professional tools and reach the most engaged professional audience."}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                <Globe size={20} />
              </div>
              <p className="font-semibold">Global Platform Access</p>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                <User size={20} />
              </div>
              <p className="font-semibold">Verified Professional Network</p>
            </div>
          </div>

          <div className="mt-12 flex gap-3">
            <div className={`h-1.5 rounded-full transition-all duration-500 ${role === 'user' ? 'w-12 bg-white' : 'w-4 bg-white/30'}`}></div>
            <div className={`h-1.5 rounded-full transition-all duration-500 ${role === 'business' ? 'w-12 bg-white' : 'w-4 bg-white/30'}`}></div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-[60%] p-10 md:p-16 bg-white/80">
          <div className="max-w-lg mx-auto">
            <h3 className="text-3xl font-black text-slate-900 mb-6">Create Account</h3>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            {/* Role Toggle */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-12 border border-slate-200">
              <button
                onClick={() => setRole('user')}
                className={`flex-1 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 ${role === 'user' ? 'bg-indigo-600 text-white shadow-xl translate-y-[-1px]' : 'text-slate-500 hover:text-slate-900'}`}
              >
                User Account
              </button>
              <button
                onClick={() => setRole('business')}
                className={`flex-1 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 ${role === 'business' ? 'bg-indigo-600 text-white shadow-xl translate-y-[-1px]' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Business Profile
              </button>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <InputField
                label="Full Name"
                placeholder="John Doe"
                icon={User}
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField
                  label="Email"
                  type="email"
                  placeholder="john@example.com"
                  icon={Mail}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <AnimatePresence mode="wait">
                {role === 'business' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: 20 }}
                    animate={{ height: 'auto', opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: 20 }}
                    className="space-y-8 overflow-hidden pt-8 border-t border-white/5"
                  >
                    <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">Business Information</p>
                    <InputField
                      label="Company Name"
                      placeholder="My Awesome Venture"
                      icon={Briefcase}
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required={role === 'business'}
                    />
                    <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Services & Pricing</p>
                    <div className="space-y-4">
                      {formData.services.map((service, index) => (
                        <div key={index} className="flex gap-4 items-end animate-slide-up">
                          <div className="flex-1">
                            <InputField
                              label={index === 0 ? "Service Name" : ""}
                              placeholder="e.g. Web Design"
                              name={`service-name-${index}`}
                              value={service.name}
                              onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                              required={role === 'business' && index === 0}
                            />
                          </div>
                          <div className="w-32">
                            <InputField
                              label={index === 0 ? "Price (INR)" : ""}
                              type="number"
                              placeholder="1000"
                              name={`service-price-${index}`}
                              value={service.price}
                              onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                            />
                          </div>
                          {formData.services.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeService(index)}
                              className="mb-2 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addService}
                        className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:text-secondary transition-colors py-2"
                      >
                        <Plus size={18} /> Add Another Service
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InputField
                        label="Website Link"
                        placeholder="https://mysite.com"
                        icon={Globe}
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                      />
                      <InputField
                        label="Logo URL"
                        placeholder="https://logo.png"
                        icon={ImageIcon}
                        name="logo"
                        value={formData.logo}
                        onChange={handleChange}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button disabled={loading} type="submit" className="btn-premium w-full mt-12 py-5 text-xl font-bold disabled:opacity-50">
                {loading ? 'Creating Account...' : 'Get Started'}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="bg-white px-4 text-slate-500 font-bold tracking-widest">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold flex items-center justify-center gap-4 transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] active:scale-[0.98] group disabled:opacity-50"
            >
              <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </button>

            <p className="mt-10 text-center text-slate-500 font-medium">
              Already a member? <Link to="/login" className="text-primary hover:text-slate-900 transition-colors">Login to JCI</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
