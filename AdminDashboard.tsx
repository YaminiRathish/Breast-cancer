
import React, { useState } from 'react';
import { OnboardingRequest, Clinician } from './types';
import { ShieldCheck, UserCheck, UserX, Clock, Building, Mail, CreditCard, CheckCircle2, AlertCircle, Scan, ShieldAlert, FileSearch, Users, Trash2, ShieldOff, UserMinus, Shield, X, AlertOctagon, UserCircle } from 'lucide-react';

interface AdminDashboardProps {
  requests: OnboardingRequest[];
  clinicians: Clinician[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRemoveClinician: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ requests, clinicians, onApprove, onReject, onRemoveClinician }) => {
  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'STAFF'>('REQUESTS');
  const [revokingId, setRevokingId] = useState<string | null>(null);
  
  const pending = requests.filter(r => r.status === 'PENDING');

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                  <ShieldAlert className="text-pink-600" size={32} />
                  Authority Control Panel
              </h1>
              <div className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-pink-100 shadow-sm">
                  Lead Doctor Terminal
              </div>
          </div>
          <p className="text-slate-500 font-medium">Institutional staff registry and clinical access management.</p>
        </div>
        
        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 shadow-inner">
            <button 
                onClick={() => setActiveTab('REQUESTS')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === 'REQUESTS' ? 'bg-white text-pink-600 shadow-lg' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
                <Clock size={16} />
                Approvals {pending.length > 0 && `(${pending.length})`}
            </button>
            <button 
                onClick={() => setActiveTab('STAFF')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === 'STAFF' ? 'bg-white text-pink-600 shadow-lg' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
                <Users size={16} />
                Registry ({clinicians.length})
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
            {activeTab === 'REQUESTS' ? (
                <div className="space-y-6">
                    <h3 className="font-black text-slate-900 text-xs uppercase tracking-[0.2em] flex items-center gap-2 px-2">
                        <Clock size={14} className="text-amber-500" />
                        Onboarding Pipeline
                    </h3>

                    {pending.length > 0 ? pending.map((req) => (
                    <div key={req.id} className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-2xl overflow-hidden relative">
                        <div className="flex flex-col md:flex-row items-start gap-10">
                        <div className="flex-shrink-0 w-full md:w-56 space-y-4">
                            <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden bg-slate-900 border-4 border-slate-50 shadow-2xl">
                                {req.faceImageData ? (
                                    <img src={req.faceImageData} alt="Biometric ID" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-700 font-black text-[10px] uppercase tracking-widest">Awaiting Scan</div>
                                )}
                            </div>
                        </div>

                        <div className="flex-grow space-y-8">
                            <div>
                                <h4 className="font-black text-slate-900 text-2xl tracking-tight mb-2">{req.name}</h4>
                                <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-lg border border-pink-100">{req.role}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-[32px] border border-slate-100">
                                <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">License</p><p className="text-sm font-black font-mono text-slate-900">{req.licenseNumber}</p></div>
                                <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Hospital</p><p className="text-sm font-bold text-slate-700">{req.hospital}</p></div>
                            </div>
                            <div className="flex flex-row gap-4">
                                <button onClick={() => onApprove(req.id)} className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3"><ShieldCheck size={18} /> Grant Access</button>
                                <button onClick={() => onReject(req.id)} className="px-8 py-4 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Decline</button>
                            </div>
                        </div>
                        </div>
                    </div>
                    )) : (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] p-20 text-center">
                        <CheckCircle2 size={40} className="mx-auto mb-6 text-slate-200" />
                        <h3 className="text-xl font-black text-slate-800 mb-2">No Active Requests</h3>
                        <p className="text-sm text-slate-400 font-medium">Institutional onboarding queue is currently clear.</p>
                    </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    <h3 className="font-black text-slate-900 text-xs uppercase tracking-[0.2em] flex items-center gap-2 px-2">
                        <Users size={14} className="text-pink-500" />
                        Clinical Staff Registry
                    </h3>
                    <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Professional</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Access Management</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {clinicians.map(staff => (
                                        <tr key={staff.id} className={`group transition-all ${revokingId === staff.id ? 'bg-red-50/50' : 'hover:bg-slate-50/50'}`}>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-slate-900 text-pink-500 rounded-2xl flex items-center justify-center font-black overflow-hidden shadow-inner">
                                                        {staff.avatar ? (
                                                            <img src={staff.avatar} alt={staff.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <UserCircle size={28} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900">{staff.name}</p>
                                                        <p className="text-[10px] font-medium text-slate-400 font-mono">{staff.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                                                    {staff.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {staff.isAdmin ? (
                                                    <div className="flex items-center justify-end gap-2 text-blue-600 font-black text-[9px] uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                                                        <Shield size={12} /> Authority Node
                                                    </div>
                                                ) : revokingId === staff.id ? (
                                                    <div className="flex items-center justify-end gap-2 animate-in slide-in-from-right-2">
                                                        <button 
                                                            onClick={() => { onRemoveClinician(staff.id); setRevokingId(null); }}
                                                            className="px-4 py-2 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700"
                                                        >
                                                            Confirm Purge
                                                        </button>
                                                        <button 
                                                            onClick={() => setRevokingId(null)}
                                                            className="p-2 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => setRevokingId(staff.id)}
                                                        className="flex items-center gap-2 ml-auto px-4 py-2 bg-white text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all shadow-sm"
                                                    >
                                                        <UserMinus size={14} /> 
                                                        Revoke Credentials
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={120} /></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 mb-8">Registry Control</h3>
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4"><p className="text-xs font-black uppercase tracking-widest text-slate-500">Authorized Doctors</p><p className="text-xl font-black">{clinicians.length}</p></div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-4"><p className="text-xs font-black uppercase tracking-widest text-slate-500">Pipeline Requests</p><p className="text-xl font-black text-pink-500">{pending.length}</p></div>
                    <p className="text-[10px] font-bold text-slate-400 italic leading-relaxed">System logs all credential revocations for compliance auditing.</p>
                </div>
            </div>
            <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-xl">
                 <div className="flex items-center gap-3 mb-6"><AlertOctagon className="text-amber-500" size={24} /><h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Revocation Help</h4></div>
                 <p className="text-xs text-slate-500 font-medium leading-loose">To remove a previously accepted doctor, switch to the <strong>Registry</strong> tab, find the clinician, and click <strong>Revoke Credentials</strong>. You will be asked to confirm before the ID is purged.</p>
            </div>
        </div>
      </div>
    </div>
  );
};
