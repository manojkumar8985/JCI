import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, or } from 'firebase/firestore';
import { Bell, Clock, CheckCircle, XCircle, ArrowRight, MessageSquare, Sparkles, Send, Inbox } from 'lucide-react';

const Notifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'

  useEffect(() => {
    if (!currentUser) return;


    try {
      const q = query(
        collection(db, "notifications"),
        or(
          where("receiverId", "==", currentUser.uid),
          where("senderId", "==", currentUser.uid)
        )
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        let notifs = [];
        snapshot.forEach((doc) => {
          notifs.push({ id: doc.id, ...doc.data() });
        });

        // Sort in JS to avoid indexing error during development
        notifs.sort((a, b) => {
          const timeA = a.timestamp?.toDate() || 0;
          const timeB = b.timestamp?.toDate() || 0;
          return timeB - timeA;
        });

        setNotifications(notifs);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("OR query failed, falling back to multiple listeners:", e);
      // Fallback logic for older SDKs if needed, but modern Firebase should support or()
    }
  }, [currentUser]);

  const updateStatus = async (id, newStatus) => {
    try {
      const docRef = doc(db, "notifications", id);
      await updateDoc(docRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4">Please Log In</h2>
        <p className="text-slate-500 mb-8 text-center max-w-md">
          You need to be logged in to view your notifications and service requests.
        </p>
      </div>
    );
  }

  const filteredNotifications = notifications.filter(n =>
    activeTab === 'received' ? n.receiverId === currentUser.uid : n.senderId === currentUser.uid
  );

  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6 md:px-12">
      {/* Background flair */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-full blur-[120px] -z-10 opacity-70 pointer-events-none transform translate-x-1/3 -translate-y-1/4"></div>

      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-glow">
                <Bell size={24} />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Notifications</h1>
            </div>
            <p className="text-slate-600 max-w-xl text-lg">
              Manage your service requests and stay updated on your business interactions.
            </p>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-12 border border-slate-200 max-w-md">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'received' ? 'bg-white text-primary shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Inbox size={18} />
            Business Inbox
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'sent' ? 'bg-white text-primary shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Send size={18} />
            My Requests
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="glass-card p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              {activeTab === 'received' ? <Inbox size={40} /> : <Send size={40} />}
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              No {activeTab === 'received' ? 'business requests' : 'sent requests'} yet
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              {activeTab === 'received'
                ? "When someone requests a service from your business, it will appear here."
                : "When you request a service from a business, you can track it here."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className="glass-card p-6 md:p-8 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
              >
                {/* Status indicator bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${notification.status === 'pending' ? 'bg-amber-400' :
                    notification.status === 'accepted' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${notification.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                          notification.status === 'accepted' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
                        }`}>
                        {notification.status}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                        <Clock size={12} />
                        {notification.timestamp?.toDate().toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    <h4 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors">
                      {notification.service}
                    </h4>

                    <div className="flex items-center gap-2 text-slate-600 flex-wrap">
                      <span className="font-bold text-slate-900">
                        {activeTab === 'received' ? notification.senderEmail : 'Requested from'}
                      </span>
                      <ArrowRight size={14} className="text-slate-300" />
                      <span className="bg-slate-100 px-3 py-1 rounded-lg text-sm font-bold text-slate-700">
                        {notification.businessName}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    {activeTab === 'received' && notification.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(notification.id, 'accepted')}
                          className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={18} />
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(notification.id, 'rejected')}
                          className="w-full sm:w-auto px-6 py-3 bg-red-50 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle size={18} />
                          Reject
                        </button>
                      </>
                    )}

                    <a
                      href={`mailto:${activeTab === 'received' ? notification.senderEmail : 'contact@business.com'}`}
                      className="w-full sm:w-auto btn-premium py-3 px-6 text-sm font-bold flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={16} />
                      Contact {activeTab === 'received' ? 'Client' : 'Business'}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
