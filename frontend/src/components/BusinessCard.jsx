import { useNavigate } from 'react-router-dom';
import { ExternalLink, Globe, ShieldCheck, Tag } from 'lucide-react';
import { getServicePrice, formatPrice } from '../utils/pricing';

const BusinessCard = ({ business }) => {
  const { id, name, services = [], logo, website, companyName } = business;
  const navigate = useNavigate();

  const minPrice = services.length > 0 
    ? Math.min(...services.map(s => getServicePrice(s))) 
    : 0;


  const handleCardClick = () => {
    navigate(`/business/${id}`);
  };

  const handleLinkClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="glass-card p-6 flex flex-col gap-6 h-full min-h-[400px] cursor-pointer hover:scale-[1.02] transition-transform duration-300"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200 shadow-glow">
          {logo ? (
            <img src={logo} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-primary">{name.charAt(0)}</span>
          )}
        </div>
        <div className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-[10px] uppercase font-bold flex items-center gap-1 border border-indigo-500/20">
          <ShieldCheck size={12} />
          Verified
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{name}</h3>
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{companyName}</p>

        <div className="flex flex-wrap gap-2 mt-6">
          {services.map((service, index) => {
            const name = typeof service === 'object' ? service.name : service;
            return (
              <span
                key={index}
                className="text-[10px] uppercase tracking-widest bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg text-slate-600 font-medium"
              >
                {name}
              </span>
            );
          })}
        </div>
      </div>

      <div className="pt-6 flex items-center justify-between border-t border-slate-200">
        {website ? (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-sm font-semibold flex items-center gap-1.5 hover:text-secondary transition-colors"
            onClick={handleLinkClick}
          >
            <Globe size={16} />
            Website
          </a>
        ) : (
          <span className="text-slate-500 text-sm italic">No link</span>
        )}
        <button
          className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 hover:border-primary transition-all text-slate-600 hover:text-primary"
          onClick={handleLinkClick}
        >
          <ExternalLink size={20} />
        </button>
      </div>

      {minPrice > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Tag size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Premium Offer</span>
          </div>
          <p className="text-sm font-bold text-slate-900">
            Starting <span className="text-primary">{formatPrice(minPrice)}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default BusinessCard;
