
import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { DiagnosisDashboard } from './DiagnosisDashboard';
import { Login } from './Login';
import { ResultsView } from './ResultsView';
import { HistoryView } from './HistoryView';
import { AdminDashboard } from './AdminDashboard';
import { Mailbox } from './Mailbox';
import { AppView, DiagnosisResult, Clinician, OnboardingRequest, InternalEmail } from './types';
import { ShieldCheck, User, Database, BadgeCheck, ShieldAlert, Mail } from 'lucide-react';

const INITIAL_CLINICIANS: Clinician[] = [
  { name: 'Dr. Lokeshwari S', email: 'lokeshwari@oncovision.ai', id: '313522104084', role: 'Senior Oncologist', isVerified: true, onboardedAt: 1704067200000, isAdmin: true, password: 'password2026' },
  { name: 'Dr. Soundarya Devi K', email: 'soundarya@oncovision.ai', id: '313522104158', role: 'Radiologist', isVerified: true, onboardedAt: 1706745600000, password: 'password2026' },
  { name: 'Dr. Sree Varsha M', email: 'sree@oncovision.ai', id: '313522104159', role: 'Pathologist', isVerified: true, onboardedAt: 1709251200000, password: 'password2026' },
  { name: 'Dr. Yamini R', email: 'yamini@oncovision.ai', id: '313522104180', role: 'Research Lead', isVerified: true, onboardedAt: 1711929600000, password: 'password2026' }
];

function App() {
  const [activeClinician, setActiveClinician] = useState<Clinician | null>(null);
  const [clinicians, setClinicians] = useState<Clinician[]>(INITIAL_CLINICIANS);
  const [history, setHistory] = useState<DiagnosisResult[]>([]);
  const [onboardingRequests, setOnboardingRequests] = useState<OnboardingRequest[]>([]);
  const [internalEmails, setInternalEmails] = useState<InternalEmail[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<DiagnosisResult | null>(null);
  const [notification, setNotification] = useState<{ title: string; message: string; type: 'success' | 'info' | 'alert' } | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  
  useEffect(() => {
    const savedClinicians = localStorage.getItem('oncovision_clinicians');
    if (savedClinicians) setClinicians(JSON.parse(savedClinicians));

    const savedHistory = localStorage.getItem('oncovision_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedRequests = localStorage.getItem('oncovision_requests');
    if (savedRequests) {
      setOnboardingRequests(JSON.parse(savedRequests));
    } else {
      const mockReq: OnboardingRequest = {
        id: 'REQ-9901',
        name: 'Dr. Aruna Kumar',
        email: 'aruna.k@medical-center.org',
        licenseNumber: 'MC-2024-551',
        hospital: 'Apollo Specialized Care',
        role: 'Radiologist',
        status: 'PENDING',
        timestamp: Date.now() - 3600000
      };
      setOnboardingRequests([mockReq]);
    }

    const savedEmails = localStorage.getItem('oncovision_emails');
    if (savedEmails) {
      setInternalEmails(JSON.parse(savedEmails));
    } else {
      const welcomeMail: InternalEmail = {
        id: 'SYS-WELCOME',
        sender: 'OncoVision System Authority',
        senderEmail: 'system@oncovision.ai',
        recipient: 'All Staff',
        subject: 'Welcome to the Diagnostic Terminal v3.2',
        body: 'Welcome to the unified OncoVision XAI terminal. This portal integrates Hybrid Deep Learning models with clinical transparency tools.',
        timestamp: Date.now() - 86400000,
        isRead: true,
        type: 'SYSTEM'
      };
      setInternalEmails([welcomeMail]);
    }
  }, []);

  const handleApproveRequest = (requestId: string) => {
    setOnboardingRequests(prev => {
      const requests = [...prev];
      const index = requests.findIndex(r => r.id === requestId);
      if (index === -1) return prev;

      const generatedPassword = 'OV-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      
      const request = requests[index];
      requests[index] = { ...request, status: 'APPROVED', password: generatedPassword };
      
      const newClinician: Clinician = {
        name: request.name,
        email: request.email,
        id: `STF-${request.id.split('-')[1] || Math.floor(Math.random()*1000)}`,
        role: request.role,
        isVerified: true,
        onboardedAt: Date.now(),
        avatar: request.faceImageData,
        password: generatedPassword
      };
      
      setClinicians(prevClinicians => {
        const updated = [...prevClinicians, newClinician];
        localStorage.setItem('oncovision_clinicians', JSON.stringify(updated));
        return updated;
      });

      const credentialEmail: InternalEmail = {
        id: `MAIL-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        sender: 'System Authority',
        senderEmail: 'system@oncovision.ai',
        recipient: request.email,
        subject: 'Portal Access Granted: Credentials Attached',
        body: `Hello ${request.name},\n\nYour application has been approved. Your Staff ID is: ${newClinician.id}.\n\nYOUR UNIQUE SECURITY KEY: ${generatedPassword}\n\nPlease use this key for all future terminal logins. Keep it confidential.`,
        timestamp: Date.now(),
        isRead: false,
        type: 'CREDENTIALS'
      };

      setInternalEmails(prevEmails => {
        const updated = [credentialEmail, ...prevEmails];
        localStorage.setItem('oncovision_emails', JSON.stringify(updated));
        return updated;
      });

      localStorage.setItem('oncovision_requests', JSON.stringify(requests));
      return requests;
    });

    setNotification({
      title: 'Credentials Dispatched',
      message: `Identity verified. Unique security key has been generated and emailed.`,
      type: 'success'
    });
    setTimeout(() => setNotification(null), 8000);
  };

  const handleRemoveClinician = (clinicianId: string) => {
    if (activeClinician?.id === clinicianId) {
      setNotification({ title: 'Safety Interlock', message: 'Unauthorized: Cannot revoke own authority credentials.', type: 'alert' });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    setClinicians(prev => {
      const clinicianToRemove = prev.find(c => c.id === clinicianId);
      const updated = prev.filter(c => c.id !== clinicianId);
      localStorage.setItem('oncovision_clinicians', JSON.stringify(updated));
      
      setNotification({
        title: 'Registry Updated',
        message: `${clinicianToRemove?.name || 'Clinician'} has been purged from authorized records.`,
        type: 'alert'
      });
      return updated;
    });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSendEmail = (email: Omit<InternalEmail, 'id' | 'timestamp' | 'isRead'>) => {
    const newEmail: InternalEmail = {
      ...email,
      id: `MAIL-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      timestamp: Date.now(),
      isRead: false
    };

    setInternalEmails(prev => {
      const updated = [newEmail, ...prev];
      localStorage.setItem('oncovision_emails', JSON.stringify(updated));
      return updated;
    });

    setNotification({
      title: 'Message Transmitted',
      message: `Your communication to ${email.recipient} has been delivered over the secure network.`,
      type: 'success'
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRequestAccess = (request: any) => {
    const newRequest: OnboardingRequest = {
      id: `REQ-${Math.floor(Math.random() * 9000) + 1000}`,
      ...request,
      status: 'PENDING',
      timestamp: Date.now()
    };
    
    setOnboardingRequests(prev => {
      const updated = [newRequest, ...prev];
      localStorage.setItem('oncovision_requests', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLogin = (clinician: Clinician) => {
    setActiveClinician(clinician);
    setCurrentView(AppView.HOME);
  };

  const userEmails = internalEmails.filter(email => 
    email.recipient === 'All Staff' || 
    email.recipient === activeClinician?.email ||
    email.senderEmail === activeClinician?.email ||
    (activeClinician?.isAdmin && (email.type === 'SYSTEM' || email.type === 'COMPLAINT'))
  );

  const renderView = () => {
    if (!activeClinician) {
      return <Login onLogin={handleLogin} onRequestAccess={handleRequestAccess} clinicians={clinicians} onboardingRequests={onboardingRequests} />;
    }

    switch (currentView) {
      case AppView.HOME:
        return (
          <>
            <Hero onStart={() => setCurrentView(AppView.DIAGNOSIS)} />
            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-xl flex items-center gap-6">
                    <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-3xl flex items-center justify-center relative overflow-hidden">
                        {activeClinician.avatar ? (
                           <img src={activeClinician.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                           <User size={32} />
                        )}
                        {activeClinician.isVerified && (
                          <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-0.5 rounded-full border-2 border-white shadow-lg">
                            <BadgeCheck size={10} />
                          </div>
                        )}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Medical Access</p>
                        <h3 className="text-xl font-black text-slate-900 leading-none truncate max-w-[150px]">{activeClinician.name}</h3>
                        <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-widest">{activeClinician.role}</p>
                    </div>
                </div>
                <div onClick={() => setCurrentView(AppView.HISTORY)} className="bg-slate-900 p-8 rounded-[40px] shadow-2xl flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/10 text-white rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Database size={32} />
                      </div>
                      <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Registry</p>
                          <h3 className="text-xl font-black text-white leading-none">Database</h3>
                          <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">{history.length} Cases</p>
                      </div>
                    </div>
                </div>
                <div onClick={() => setCurrentView(AppView.MAILBOX)} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-xl flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-3xl flex items-center justify-center relative group-hover:scale-110 transition-transform">
                          <Mail size={32} />
                          {userEmails.filter(e => !e.isRead && e.recipient === activeClinician.email).length > 0 && (
                             <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-600 rounded-full border-2 border-white animate-pulse"></div>
                          )}
                      </div>
                      <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Communications</p>
                          <h3 className="text-xl font-black text-slate-900 leading-none">Personal Mail</h3>
                          <p className="text-[10px] text-pink-600 font-bold mt-2 uppercase tracking-widest">{userEmails.length} Messages</p>
                      </div>
                    </div>
                </div>
                {activeClinician.isAdmin && (
                  <div onClick={() => setCurrentView(AppView.ADMIN_PANEL)} className="bg-indigo-600 p-8 rounded-[40px] shadow-2xl flex items-center justify-between cursor-pointer hover:bg-indigo-700 transition-all group">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/10 text-white rounded-3xl flex items-center justify-center relative group-hover:scale-110 transition-transform">
                            <ShieldAlert size={32} />
                            {onboardingRequests.filter(r => r.status === 'PENDING').length > 0 && (
                               <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-indigo-600 animate-pulse">
                                 {onboardingRequests.filter(r => r.status === 'PENDING').length}
                               </div>
                            )}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Authority Control</p>
                            <h3 className="text-xl font-black text-white leading-none">Approvals</h3>
                        </div>
                      </div>
                  </div>
                )}
            </div>
          </>
        );
      case AppView.MAILBOX:
        return (
          <Mailbox 
            emails={userEmails}
            clinicians={clinicians}
            activeClinician={activeClinician}
            onMarkRead={(id) => {
              setInternalEmails(prev => {
                const updated = prev.map(e => e.id === id ? { ...e, isRead: true } : e);
                localStorage.setItem('oncovision_emails', JSON.stringify(updated));
                return updated;
              });
            }}
            onDelete={(id) => {
              setInternalEmails(prev => {
                const updated = prev.filter(e => e.id !== id);
                localStorage.setItem('oncovision_emails', JSON.stringify(updated));
                return updated;
              });
            }}
            onSendEmail={handleSendEmail}
          />
        );
      case AppView.DIAGNOSIS: return <DiagnosisDashboard onSaveResult={(rec) => { setHistory(prev => { const updated = [rec, ...prev]; localStorage.setItem('oncovision_history', JSON.stringify(updated)); return updated; }); }} />;
      case AppView.HISTORY: return <HistoryView history={history} onViewRecord={setSelectedRecord} onDeleteRecord={(id) => { setHistory(prev => { const updated = prev.filter(h => h.id !== id); localStorage.setItem('oncovision_history', JSON.stringify(updated)); return updated; }); }} isClinicianVerified={activeClinician.isVerified} />;
      case AppView.ADMIN_PANEL: return (
        <AdminDashboard 
          requests={onboardingRequests} 
          clinicians={clinicians}
          onApprove={handleApproveRequest} 
          onReject={(id) => setOnboardingRequests(prev => { const updated = prev.filter(r => r.id !== id); localStorage.setItem('oncovision_requests', JSON.stringify(updated)); return updated; })}
          onRemoveClinician={handleRemoveClinician}
        />
      );
      default: return <Hero onStart={() => setCurrentView(AppView.DIAGNOSIS)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {notification && (
        <div className={`fixed top-24 right-8 z-[100] max-w-sm bg-white rounded-3xl shadow-2xl border-l-8 ${notification.type === 'alert' ? 'border-red-500' : 'border-green-500'} p-6 animate-in slide-in-from-right-8`}>
          <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-1">{notification.title}</h4>
          <p className="text-xs text-slate-600 font-medium">{notification.message}</p>
        </div>
      )}
      {activeClinician && (
        <Navbar 
          currentView={currentView} 
          setView={setCurrentView} 
          onLogout={() => setActiveClinician(null)} 
          isAdmin={activeClinician.isAdmin}
          unreadMailCount={userEmails.filter(e => !e.isRead && e.recipient === activeClinician.email).length}
        />
      )}
      <main className="flex-grow">{renderView()}</main>
      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">OncoVision XAI Hybrid Framework © 2026</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
