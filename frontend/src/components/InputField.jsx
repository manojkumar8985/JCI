import React from 'react';

const InputField = ({ label, type = 'text', placeholder, value, onChange, icon: Icon, required = false, name }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-slate-400 mb-2.5 ml-1 uppercase tracking-widest">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-5 text-slate-500">
            <Icon size={20} />
          </div>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full bg-slate-900/80 border border-white/10 rounded-2xl py-4 ${Icon ? 'pl-14' : 'px-6'} pr-6 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-300`}
        />
      </div>
    </div>
  );
};

export default InputField;
