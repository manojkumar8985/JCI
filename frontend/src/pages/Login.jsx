import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import InputField from '../components/InputField';
import bgImage from '../assets/background.jpg';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await googleLogin();
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to log in with Google. ' + err.message);
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
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to sign in. ' + err.message);
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

      <div className="glass-card w-full max-w-xl p-10 md:p-16 shadow-2xl relative overflow-hidden z-10">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -mr-16 -mt-16"></div>

        <div className="text-center mb-10 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-glow mx-auto mb-8">
            <LogIn className="text-white" size={36} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4">Welcome Back</h2>
          <p className="text-lg text-slate-600">Enter your credentials to access JCI</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm relative z-10">
            {error}
          </div>
        )}

        <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
          <InputField
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            icon={Mail}
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div className="space-y-2">
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
            <div className="flex justify-end pr-1">
              <Link to="/login" className="text-sm text-primary hover:text-secondary font-bold transition-colors">Forgot password?</Link>
            </div>
          </div>

          <button disabled={loading} type="submit" className="btn-premium w-full !mt-12 py-5 text-xl flex items-center justify-center gap-3 group disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login to Account'}
            {!loading && <ArrowRight size={24} className="group-hover:translate-x-1.5 transition-transform" />}
          </button>
        </form>

        <div className="relative my-10 relative z-10">
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
          className="w-full py-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold flex items-center justify-center gap-4 transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] active:scale-[0.98] relative z-10 group disabled:opacity-50"
        >
          <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <p className="mt-12 text-center text-slate-500 font-medium relative z-10">
          New to the platform? <Link to="/signup" className="text-primary hover:text-slate-900 font-bold transition-colors">Create your free account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
