
import React, { useState } from 'react';
import { InternalEmail, Clinician } from './types';
import { Mail, Inbox, ShieldCheck, ChevronRight, Clock, User, Trash2, Eye, Plus, Send, X, AlertCircle, MessageSquare, Megaphone, Fingerprint, Reply } from 'lucide-react';

interface MailboxProps {
  emails: InternalEmail[];
  clinicians: Clinician[];
  activeClinician: Clinician;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onSendEmail: (email: Omit<InternalEmail, 'id' | 'timestamp' | 'isRead'>) => void;
}

export const Mailbox: React.FC<MailboxProps> = ({ emails, clinicians, activeClinician, onMarkRead, onDelete, onSendEmail }) => {
  const [selectedId, setSelectedId] = useState<string | null>(emails.length > 0 ? emails[0].id : null);
  const [isComposing, setIsComposing] = useState(false);
  const [isComplaintMode, setIsComplaintMode] = useState(false);
  
  const [composeData, setComposeData] = useState({
    recipient: '',
    subject: '',
    body: ''
  });

  const selectedEmail = emails.find(e => e.id === selectedId);

  // STAFF can only message SENIOR STAFF (Admins)
  // ADMINS can message ANYONE
  const availableRecipients = activeClinician.isAdmin 
    ? clinicians.filter(c => c.email !== activeClinician.email)
    : clinicians.filter(c => c.isAdmin && c.email !== activeClinician.email);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeData.recipient || !composeData.subject || !composeData.body) return;

    onSendEmail({
      sender: activeClinician.name,
      senderEmail: activeClinician.email,
      recipient: composeData.recipient,
      subject: composeData.subject,
      body: composeData.body,
      type: isComplaintMode ? 'COMPLAINT' : 'GENERAL'
    });

    setIsComposing(false);
    setIsComplaintMode(false);
    setComposeData({ recipient: '', subject: '', body: '' });
  };

  const handleReply = () => {
    if (!selectedEmail) return;
    setIsComposing(true);
    setComposeData({
      recipient: selectedEmail.senderEmail,
      subject: `RE: ${selectedEmail.subject}`,
      body: `\n\n--- Original Message from ${selectedEmail.sender} ---\n${selectedEmail.body}`
    });
  };

  const openComplaintBox = () => {
    setIsComposing(true);
    setIsComplaintMode(true);
    // Find first available senior staff email if none selected
    const adminEmail = clinicians.find(c => c.isAdmin)?.email || 'system@oncovision.ai';
    setComposeData({
      recipient: adminEmail,
      subject: '[GRIEVANCE] Official Complaint Filed',
      body: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <Inbox className="text-pink-600" size={32} />
            Communication Hub
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            {activeClinician.isAdmin 
              ? "Senior Staff Terminal: Oversee clinical grievances and staff reporting."
              : "Institutional Messaging: Direct channel to Senior Medical Authority."
            }
          </p>
        </div>
        
        <div className="flex gap-3">
          {!activeClinician.isAdmin && (
            <button 
              onClick={openComplaintBox}
              className="flex items-center gap-2 px-6 py-3.5 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
            >
              <AlertCircle size={16} />
              Report Grievance
            </button>
          )}
          <button 
            onClick={() => setIsComposing(true)}
            className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <Plus size={16} />
            New Message
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[650px]">
        {/* List Side */}
        <div className="lg:col-span-4 bg-white rounded-[40px] border border-slate-200 shadow-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <Mail size={14} />
               Staff Inbox
             </h3>
             <div className="bg-white px-3 py-1 rounded-full border border-slate-200 text-[9px] font-black text-slate-400">
               {emails.length} TOTAL
             </div>
          </div>
          <div className="flex-grow overflow-y-auto divide-y divide-slate-50">
            {emails.length > 0 ? emails.map(email => (
              <button
                key={email.id}
                onClick={() => {
                  setSelectedId(email.id);
                  onMarkRead(email.id);
                }}
                className={`w-full text-left p-6 transition-all hover:bg-slate-50 flex gap-4 ${
                  selectedId === email.id ? 'bg-pink-50/30' : ''
                }`}
              >
                <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${email.isRead ? 'opacity-0' : (email.type === 'COMPLAINT' ? 'bg-red-600 animate-pulse' : 'bg-pink-600 animate-pulse')}`}></div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`text-[10px] font-black uppercase tracking-widest truncate ${email.type === 'COMPLAINT' ? 'text-red-600' : 'text-pink-600'}`}>
                        {email.senderEmail === activeClinician.email ? `TO: ${email.recipient}` : email.sender}
                    </p>
                    <p className="text-[8px] font-bold text-slate-400">{new Date(email.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  <h4 className={`text-sm tracking-tight truncate ${email.isRead ? 'text-slate-600 font-medium' : 'text-slate-900 font-black'}`}>
                    {email.subject}
                  </h4>
                  {email.type === 'COMPLAINT' && (
                    <span className="inline-block mt-2 px-1.5 py-0.5 bg-red-50 text-red-600 text-[8px] font-black uppercase tracking-widest rounded border border-red-100">Senior Oversight Required</span>
                  )}
                </div>
              </button>
            )) : (
              <div className="h-full flex flex-col items-center justify-center p-10 text-center text-slate-300 opacity-40">
                <Inbox size={48} className="mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">Archive Empty</p>
              </div>
            )}
          </div>
        </div>

        {/* View Side */}
        <div className="lg:col-span-8 bg-white rounded-[40px] border border-slate-200 shadow-2xl flex flex-col overflow-hidden relative">
          {isComposing ? (
            <div className="h-full flex flex-col animate-in zoom-in duration-300">
               <div className={`p-10 border-b flex items-center justify-between ${isComplaintMode ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                  <div>
                    <h3 className={`text-2xl font-black tracking-tight ${isComplaintMode ? 'text-red-900' : 'text-slate-900'}`}>
                      {isComplaintMode ? 'File Official Grievance' : 'Secure Transmission'}
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      {isComplaintMode ? 'Targeted to Senior Medical Authority' : 'Internal Clinical Communication'}
                    </p>
                  </div>
                  <button onClick={() => { setIsComposing(false); setIsComplaintMode(false); }} className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all">
                    <X size={20} />
                  </button>
               </div>
               
               <form onSubmit={handleSend} className="flex-grow flex flex-col p-10 space-y-6 overflow-y-auto">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recipient Professional</label>
                    <select 
                      required
                      value={composeData.recipient}
                      onChange={e => setComposeData({...composeData, recipient: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all"
                    >
                      <option value="">Select Authorized Recipient...</option>
                      {availableRecipients.map(c => (
                        <option key={c.id} value={c.email}>{c.name} {c.isAdmin ? '(Senior Staff)' : `(${c.role})`}</option>
                      ))}
                    </select>
                    {!activeClinician.isAdmin && (
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight ml-1 italic">Note: Staff communications are limited to Senior Authorities.</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject Header</label>
                    <input 
                      required
                      type="text"
                      value={composeData.subject}
                      onChange={e => setComposeData({...composeData, subject: e.target.value})}
                      placeholder="Enter subject..."
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all"
                    />
                  </div>
                  
                  <div className="flex-grow space-y-2 flex flex-col min-h-[150px]">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message Content</label>
                    <textarea 
                      required
                      value={composeData.body}
                      onChange={e => setComposeData({...composeData, body: e.target.value})}
                      placeholder={isComplaintMode ? "Describe the clinical grievance or professional issue..." : "Type your professional correspondence..."}
                      className="flex-grow w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all resize-none"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className={`w-full py-5 rounded-[24px] text-white font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 ${
                        isComplaintMode ? 'bg-red-600 hover:bg-red-700 shadow-red-100' : 'bg-pink-600 hover:bg-pink-700 shadow-pink-100'
                    }`}
                  >
                    <Send size={18} />
                    {isComplaintMode ? 'Transmit Official Grievance' : 'Transmit Message'}
                  </button>
               </form>
            </div>
          ) : selectedEmail ? (
            <>
              <div className={`p-10 border-b flex items-center justify-between ${selectedEmail.type === 'COMPLAINT' ? 'bg-red-50 border-red-100' : 'bg-slate-50/30 border-slate-100'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black shadow-lg ${selectedEmail.type === 'COMPLAINT' ? 'bg-red-900 text-white' : 'bg-slate-900 text-white'}`}>
                    {selectedEmail.type === 'COMPLAINT' ? 'G' : 'OV'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedEmail.subject}</h3>
                    <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-400">
                      <span className="uppercase">From: {selectedEmail.sender}</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <span>To: {selectedEmail.recipient}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activeClinician.isAdmin && selectedEmail.senderEmail !== activeClinician.email && (
                    <button 
                      onClick={handleReply}
                      className="p-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-all shadow-lg shadow-pink-100"
                      title="Reply to Staff"
                    >
                      <Reply size={20} />
                    </button>
                  )}
                  <button 
                    onClick={() => onDelete(selectedEmail.id)}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete Message"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-grow p-10 overflow-y-auto bg-white relative">
                <div className="max-w-2xl mx-auto space-y-8">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Logged: {new Date(selectedEmail.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {selectedEmail.type === 'COMPLAINT' && (
                        <div className="flex items-center gap-2 text-red-600">
                            <Megaphone size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Priority Authority Oversight</span>
                        </div>
                    )}
                  </div>
                  
                  <div className="prose prose-slate max-w-none">
                    <div className="whitespace-pre-line text-slate-700 font-medium leading-relaxed bg-slate-50/50 p-8 rounded-[32px] border border-slate-100">
                      {selectedEmail.body}
                    </div>
                  </div>

                  {selectedEmail.type === 'CREDENTIALS' && (
                    <div className="mt-12 p-8 bg-slate-900 rounded-[32px] text-white border-l-8 border-pink-600 shadow-2xl relative overflow-hidden">
                       <ShieldCheck className="absolute top-[-20%] right-[-10%] w-48 h-48 text-white/5 pointer-events-none" />
                       <div className="relative z-10">
                          <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.4em] mb-6">Security Credential Block</p>
                          <div className="space-y-4 font-mono text-sm tracking-wider">
                             <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="text-slate-500 uppercase text-[9px]">Staff ID Reference:</span>
                                <span className="font-black">OV-{selectedEmail.id.slice(0,4)}</span>
                             </div>
                             <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="text-slate-500 uppercase text-[9px]">Security Access Key:</span>
                                <span className="font-black">password2026</span>
                             </div>
                             <div className="flex justify-between">
                                <span className="text-slate-500 uppercase text-[9px]">Validation:</span>
                                <span className="text-green-500 font-black">ACTIVE / CERTIFIED</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-8 border-t border-slate-100 text-center flex justify-center items-center gap-6">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">Institutional Private Network Transmission</p>
                <div className="h-3 w-px bg-slate-100"></div>
                <div className="flex items-center gap-2 text-slate-300">
                    <Fingerprint size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">End-to-End Encrypted</span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-20 text-center">
               <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mb-8 text-slate-200">
                  <MessageSquare size={48} />
               </div>
               <h3 className="text-2xl font-black text-slate-800 tracking-tight">Messaging Terminal</h3>
               <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto mt-4 leading-relaxed">Choose an entry from your inbox to read or use the <strong>Compose</strong> tools to start a conversation with Senior Authorities.</p>
               <div className="mt-10 flex gap-4">
                  <div className="px-4 py-2 bg-slate-50 rounded-full border border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">Select to read</div>
                  <div className="px-4 py-2 bg-slate-50 rounded-full border border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">Compose to write</div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
