import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe, ShieldCheck, Mail, MapPin, Phone, Sparkles } from 'lucide-react';
import BusinessCard from '../components/BusinessCard';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { QRCodeCanvas } from "qrcode.react";
import { businees_url } from '../data/businesses';
import QRCodeModal from '../qr/QRCodeModal';
import RequestServiceModal from '../components/RequestServiceModal';
import { useAuth } from '../context/AuthContext';
import { getServicePrice, formatPrice } from '../utils/pricing';



const BusinessDetails = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [qrData, setQrData] = useState("a");
  const [loading, setLoading] = useState(true);
  const [openQR, setOpenQR] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const { currentUser, userData } = useAuth();

  useEffect(() => {
    const fetchBusinessAndRecommendations = async () => {
      try {
        setLoading(true);
        // Fetch current business
        const docRef = doc(db, "companies", id);
        const docSnap = await getDoc(docRef);

        let currentBusiness = null;
        if (docSnap.exists()) {
          const data = docSnap.data();
          currentBusiness = {
            id: docSnap.id,
            ...data,
            companyName: data.description || data.companyName || ''
          };
          setBusiness(currentBusiness);
        } else {
          setBusiness(null);
        }

        // Fetch recommendations
        if (currentBusiness) {
          const querySnapshot = await getDocs(collection(db, "companies"));
          const allComps = [];
          querySnapshot.forEach((d) => {
            if (d.id !== id) {
              const data = d.data();
              if (data.status === 'active') {
                allComps.push({
                  id: d.id,
                  ...data,
                  companyName: data.description || data.companyName || ''
                });
              }
            }
          });

          const currentServices = currentBusiness.services || [];
          const recoms = allComps
            .map(b => {
              const overlapCount = (b.services || []).filter(s => currentServices.includes(s)).length;
              return { ...b, overlapCount };
            })
            .sort((a, b) => b.overlapCount - a.overlapCount)
            .slice(0, 3);

          setRecommendations(recoms);
        }
      } catch (error) {
        console.error("Error fetching business:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessAndRecommendations();

    setQrData(`${businees_url}/${id}`);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Loading Business Details...</h2>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Business Not Found</h2>
        <Link to="/" className="text-primary hover:underline flex items-center justify-center gap-2 mt-8">
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>
    );
  }

  const { name, companyName, services, logo, website } = business;

  const handleCloseQR = () => {
    setOpenQR(false);
  };

  const onDisplayQR = () => {
    setOpenQR(true);
  }

  const handleRequestService = async (selectedService) => {
    if (!currentUser) {
      alert("Please login to request a service");
      return;
    }

    try {
      await addDoc(collection(db, "notifications"), {
        senderId: currentUser.uid,
        senderEmail: currentUser.email,
        receiverId: business.userId, // The owner of the business
        businessId: id,
        businessName: business.name,
        service: selectedService,
        status: 'pending',
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  };

  return (
    <div className="relative w-full px-6 md:px-12 py-20 fade-in mt-12 overflow-x-hidden">
      {/* Background flair */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-full blur-[120px] -z-10 opacity-70 pointer-events-none transform translate-x-1/3 -translate-y-1/4"></div>

      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-12 group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform " />
        Back to Home
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
        <div className="lg:col-span-2">
          <div className="glass-card p-8 md:p-12 mb-8">
            <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
              <div className="w-32 h-32 rounded-3xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200 shadow-glow flex-shrink-0">
                {logo ? (
                  <img src={logo} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-bold text-primary">{name.charAt(0)}</span>
                )}
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 w-full">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                      {name}
                    </h1>
                    <div className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs uppercase font-bold flex items-center gap-1 border border-indigo-500/20 whitespace-nowrap">
                      <ShieldCheck size={14} />
                      Verified
                    </div>
                  </div>

                  <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8">
                    {companyName}
                  </p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    {services.map((service, index) => (
                      <span
                        key={index}
                        className="text-xs uppercase tracking-widest bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl text-slate-600 font-medium"
                      >
                        {typeof service === 'object' ? service.name : service}
                      </span>
                    ))}
                  </div>
                </div>
                {/* QR Code - Right Side */}
                <div onClick={() => onDisplayQR()}
                  className="bg-white p-4 rounded-[1.5rem] shadow-xl border border-slate-100 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-300 group">
                  <QRCodeCanvas
                    id="QRCode"
                    value={qrData}
                    size={110}
                    bgColor="transparent"
                    fgColor="#000000"
                  />
                  <p className="text-[10px] text-center mt-2 text-slate-400 uppercase font-bold tracking-tighter group-hover:text-primary transition-colors">Click to zoom</p>
                </div>
              </div>
              <QRCodeModal open={openQR} onClose={handleCloseQR} qrid={qrData} />
            </div>

            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">About the Company</h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {name} is a leading provider in its field, dedicated to delivering excellence and innovation.
                  With a focus on customer satisfaction and high-quality results, they have established themselves
                  as a trusted partner for businesses seeking premium services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((service, index) => {
                    const price = getServicePrice(service);
                    const isMember = userData?.role === 'member';
                    const discount = isMember ? 0.1 : 0;
                    const discountedPrice = price * (1 - discount);

                    return (
                      <div key={index} className="flex flex-col gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 mb-1">{typeof service === 'object' ? service.name : service}</h4>
                            <p className="text-sm text-slate-500 mb-4">Expert solutions tailored to your specific business requirements.</p>
                            
                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex flex-col">
                                {isMember && (
                                  <span className="text-xs text-slate-400 line-through font-medium">
                                    {formatPrice(price)}
                                  </span>
                                )}
                                <div className="flex items-center gap-2">
                                  <span className="text-xl font-black text-primary">
                                    {formatPrice(discountedPrice)}
                                  </span>
                                  {isMember && (
                                    <span className="bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                                      -10% Member
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-8">Contact Information</h3>
            <div className="space-y-6">
              {business.website && (
                <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-slate-600 hover:text-primary transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Website</p>
                    <p className="font-medium text-slate-900">Visit Official Site</p>
                  </div>
                </a>
              )}

              {business.email && (
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Email</p>
                    <p className="font-medium text-slate-700">{business.email}</p>
                  </div>
                </div>
              )}

              {business.phone && (
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Phone</p>
                    <p className="font-medium text-slate-700">{business.phone}</p>
                  </div>
                </div>
              )}

              {business.location && (
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Location</p>
                    <p className="font-medium text-slate-700">{business.location}</p>
                  </div>
                </div>
              )}

              {!business.website && !business.email && !business.phone && !business.location && (
                <p className="text-slate-500 italic">No contact information provided.</p>
              )}
            </div>

            {(business.phone || business.email) && (
              <button
                className="btn-premium w-full mt-10 py-4 h-auto text-lg font-bold"
                onClick={() => {
                  if (business.phone) {
                    const phoneNumber = business.phone.replace(/[^0-9]/g, '');
                    const message = "Hello, I want to inquire about your product";
                    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
                  } else if (business.email) {
                    window.open(`mailto:${business.email}`);
                  }
                }}
              >
                Send Inquiry
              </button>
            )}

            <button
              className="w-full mt-4 py-4 h-auto text-lg font-bold border-2 border-primary text-primary hover:bg-primary/5 rounded-xl transition-all duration-300"
              onClick={() => setIsRequestModalOpen(true)}
            >
              Request Service
            </button>

            <RequestServiceModal
              isOpen={isRequestModalOpen}
              onClose={() => setIsRequestModalOpen(false)}
              services={services}
              businessName={name}
              onSubmit={handleRequestService}
            />
          </div>

          <div className="glass p-8 rounded-[2rem] border border-slate-200">
            <h4 className="text-slate-900 font-bold mb-4">Why choose them?</h4>
            <ul className="space-y-3">
              {['Premium Quality', 'Verified Business', 'Expert Team', 'Proven Results'].map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                  <ShieldCheck size={16} className="text-primary" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <section className="pt-20 border-t border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-primary" size={24} />
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">Recommended for You</h2>
            </div>
            <p className="text-slate-600 max-w-xl">
              Explore other premium businesses providing similar services tailored to your needs.
            </p>
          </div>
          <Link to="/" className="text-primary hover:text-slate-900 font-bold transition-colors flex items-center gap-2 group">
            View all businesses <ArrowLeft size={20} className="rotate-180 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map(recom => (
            <BusinessCard key={recom.id} business={recom} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default BusinessDetails;
