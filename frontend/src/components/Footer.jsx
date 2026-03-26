import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!message) {
      alert("Please enter a message");
      return;
    }

    const phoneNumber = "910000000000"; // 👉 Replace with your number (country code + number)
    const encodedMessage = encodeURIComponent(message);

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  };

  const footerSections = [
    {
      title: "Solutions",
      links: ["Marketing", "Analytics", "Commerce", "Insights"]
    },
    {
      title: "Support",
      links: ["Pricing", "Documentation", "Guides", "API Status"]
    },
    {
      title: "Company",
      links: ["About", "Blog", "Jobs", "Press", "Partners"]
    },
    {
      title: "Legal",
      links: ["Claim", "Privacy", "Terms"]
    }
  ];

  return (
    <footer className="relative mt-10 border-t border-slate-200 bg-white/90 backdrop-blur-3xl overflow-hidden">
      {/* Decorative Blur Elements */}
      <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <div className="w-full px-6 md:px-12 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-4 mb-8 group w-fit">
              <div className="flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <img src={logo} alt="JCI Logo" className="w-12 h-12 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              </div>
              <span className="text-3xl font-black gradient-text tracking-tighter">JCI</span>
            </Link>
            <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-sm">
              Empowering businesses with premium digital solutions and verified professional services.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-primary/20 hover:text-primary transition-all duration-300 border border-slate-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerSections.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-slate-900 font-bold text-lg mb-6 flex items-center gap-2">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a href="#" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-1 group">
                        <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-20 p-8 md:p-12 glass-card relative overflow-hidden border-indigo-500/20 max-w-7xl mx-auto">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

            <div className="text-center lg:text-left">
              <h4 className="text-2xl font-black text-slate-900">
                Contact Us
              </h4>
              <p className="text-slate-600">
                Send us your message directly on WhatsApp.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
              <input
                type="text"
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-6 py-3 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all w-full sm:flex-1 lg:w-80"
              />

              <button
                onClick={handleSubmit}
                className="btn-premium py-3 px-8 text-sm whitespace-nowrap w-full sm:w-auto"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">
            © {currentYear} JCI Digital. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-primary" />
              Vizianagaram, AP
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-primary" />
              contact@jci.com
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
