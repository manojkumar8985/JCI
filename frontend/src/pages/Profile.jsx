import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { Trash2, Plus, Briefcase, Tag } from 'lucide-react';


const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    services: [{ name: '', price: '' }],
    logo: '',
    website: '',
    phone: '',
    email: '',
    location: ''
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


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [userCompanies, setUserCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  const fetchUserCompanies = async () => {
    if (!currentUser) return;
    setLoadingCompanies(true);
    try {
      const q = query(collection(db, "companies"), where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      const comps = [];
      querySnapshot.forEach((d) => {
        comps.push({ id: d.id, ...d.data() });
      });
      setUserCompanies(comps);
    } catch (error) {
      console.error("Error fetching user companies:", error);
    }
    setLoadingCompanies(false);
  };

  useEffect(() => {
    fetchUserCompanies();
  }, [currentUser]);

  const handleDelete = async (companyId) => {
    if (window.confirm("Are you sure you want to delete this company profile?")) {
      try {
        await deleteDoc(doc(db, "companies", companyId));
        fetchUserCompanies();
      } catch (error) {
        console.error("Error deleting company:", error);
        alert("Error deleting company");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cleanedServices = formData.services
        .filter(s => s.name.trim() !== '')
        .map(s => ({
          name: s.name.trim(),
          price: s.price ? parseInt(s.price.toString()) : 1000
        }));

      await addDoc(collection(db, "companies"), {
        name: formData.name,
        description: formData.companyName,
        services: cleanedServices,
        logo: formData.logo,
        website: formData.website,
        phone: formData.phone,
        email: formData.email,
        location: formData.location,
        userId: currentUser.uid,
        status: 'pending',
        createdAt: new Date()
      });

      alert("Profile Created Successfully 🚀");

      setFormData({
        name: '',
        companyName: '',
        services: [{ name: '', price: '' }],
        logo: '',
        website: '',
        phone: '',
        email: '',
        location: ''
      });
      fetchUserCompanies();
    } catch (error) {
      console.error(error);
      alert("Error saving data");
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
        <p className="mb-8">Please log in</p>
        <button onClick={() => navigate('/login')} className="btn-premium px-8">
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6 md:px-12 overflow-hidden">
      {/* Background flair */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-100/40 to-cyan-100/40 rounded-full blur-[100px] -z-10 pointer-events-none transform translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-cyan-100/40 to-indigo-100/40 rounded-full blur-[100px] -z-10 pointer-events-none transform -translate-x-1/3 translate-y-1/4"></div>

      <div className="relative z-10 max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-10">
          Create Business Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            type="text"
            name="name"
            placeholder="Company Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="input"
          />

          <textarea
            name="companyName"
            placeholder="Description"
            required
            value={formData.companyName}
            onChange={handleChange}
            className="input"
          />

          <div className="space-y-4 p-6 bg-slate-50/50 rounded-3xl border border-slate-200">
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Briefcase size={14} /> Services & Pricing
            </h3>
            <div className="space-y-4">
              {formData.services.map((service, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end animate-slide-up">
                  <div className="flex-1 w-full relative">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Service Name</label>
                    <input
                      type="text"
                      value={service.name}
                      onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                      placeholder="e.g. Graphic Design"
                      className="input w-full"
                      required={index === 0}
                    />
                  </div>
                  <div className="w-full sm:w-32 relative">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block flex items-center gap-1">
                      <Tag size={10} /> Price (INR)
                    </label>
                    <input
                      type="number"
                      value={service.price}
                      onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                      placeholder="1000"
                      className="input w-full"
                    />
                  </div>
                  {formData.services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors mb-1"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addService}
                className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:text-secondary transition-colors py-2 px-1"
              >
                <Plus size={18} /> Add Another Service
              </button>
            </div>
          </div>

          <input
            type="url"
            name="logo"
            placeholder="Logo URL"
            required
            value={formData.logo}
            onChange={handleChange}
            className="input"
          />

          <input
            type="url"
            name="website"
            placeholder="Website URL"
            required
            value={formData.website}
            onChange={handleChange}
            className="input"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (e.g. +91 1234567890)"
            required
            value={formData.phone}
            onChange={handleChange}
            className="input"
          />

          <input
            type="email"
            name="email"
            placeholder="Contact Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="input"
          />

          <input
            type="text"
            name="location"
            placeholder="Location (e.g. City, Country)"
            required
            value={formData.location}
            onChange={handleChange}
            className="input"
          />

          <button
            type="submit"
            className="btn-premium w-full py-4 text-lg font-bold"
          >
            Create Profile & Publish
          </button>

        </form>

        <div className="mt-16 border-t border-slate-200 pt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Your Companies</h2>
          {loadingCompanies ? (
            <p className="text-center text-slate-500">Loading...</p>
          ) : userCompanies.length === 0 ? (
            <p className="text-center text-slate-500">You haven't created any companies yet.</p>
          ) : (
            <div className="space-y-4">
              {userCompanies.map(comp => (
                <div key={comp.id} className="flex items-center justify-between p-4 bg-white/80 border border-slate-200 rounded-2xl shadow-sm backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    {comp.logo ? (
                      <img src={comp.logo} alt={comp.name} className="w-12 h-12 rounded-xl object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-primary font-bold">
                        {comp.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900">{comp.name}</h4>
                      <p className="text-sm text-slate-500 truncate max-w-[200px] md:max-w-xs">{comp.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(comp.id)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete Company"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;