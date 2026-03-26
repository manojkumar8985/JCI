import React, { useState } from 'react';
import { X, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RequestServiceModal = ({ isOpen, onClose, services, businessName, onSubmit }) => {
  const [selectedService, setSelectedService] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService) return;

    setLoading(true);
    try {
      await onSubmit(selectedService);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedService('');
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !success) return null;

  return (
    <AnimatePresence>
      {(isOpen || success) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {success ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Request Sent!</h3>
                <p className="text-slate-500">Your request for <span className="text-primary font-bold">{selectedService}</span> has been sent to {businessName}.</p>
              </div>
            ) : (
              <>
                <div className="p-8 md:p-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-primary" size={20} />
                        <span className="text-xs font-black uppercase tracking-widest text-primary">Service Request</span>
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 leading-tight">
                        Request Service from <br/>
                        <span className="text-primary">{businessName}</span>
                      </h3>
                    </div>
                    <button 
                      onClick={onClose}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <X size={24} className="text-slate-400" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
                        Select a service
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {services.map((service, index) => {
                          const name = typeof service === 'object' ? service.name : service;
                          const isSelected = selectedService === (typeof service === 'object' ? service.name : service);
                          
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setSelectedService(name)}
                              className={`px-6 py-4 rounded-2xl text-left border-2 transition-all duration-300 font-bold flex items-center justify-between group ${
                                isSelected 
                                  ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10' 
                                  : 'border-slate-100 hover:border-slate-200 text-slate-600'
                              }`}
                            >
                              {name}
                              {isSelected && (
                                <CheckCircle size={18} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!selectedService || loading}
                      className="btn-premium w-full py-5 text-xl font-bold disabled:opacity-50 mt-4"
                    >
                      {loading ? 'Sending Request...' : 'Confirm Request'}
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RequestServiceModal;
