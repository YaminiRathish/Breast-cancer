
import React from 'react';
import { DiagnosisResult } from './types';
import { Search, Filter, Calendar, Tag, ChevronRight, Eye, Trash2, Database, ShieldCheck, AlertCircle, BadgeCheck, Lock } from 'lucide-react';

interface HistoryViewProps {
  history: DiagnosisResult[];
  onViewRecord: (record: DiagnosisResult) => void;
  onDeleteRecord: (id: string) => void;
  isClinicianVerified: boolean;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onViewRecord, onDeleteRecord, isClinicianVerified }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <Database className="text-pink-600" size={32} />
            Diagnostic Registry
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-slate-500 font-medium">Role-based administrative database for certified medical staff.</p>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center gap-1.5 text-blue-600 text-[10px] font-black uppercase tracking-widest">
              <BadgeCheck size={12} />
              Verified Access Only
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Records..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-pink-600 hover:border-pink-200 transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ref ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Diagnostic Alert</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Localization</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Severity</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.length > 0 ? history.map((record) => (
                <tr key={record.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6">
                    <span className="font-mono text-xs font-black text-slate-900">{record.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    {record.prediction === 'Malignant' ? (
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <AlertCircle className="text-red-500" size={16} />
                          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                        </div>
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Critical Alert</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="text-slate-300" size={16} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Routine Scan</span>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-500">
                    {new Date(record.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                      {record.localizedFindings || 'Global'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      record.prediction === 'Malignant' ? 'bg-red-100 text-red-600' : 
                      record.prediction === 'Benign' ? 'bg-amber-100 text-amber-600' : 
                      'bg-green-100 text-green-600'
                    }`}>
                      {record.prediction} ({record.severity})
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      {isClinicianVerified ? (
                        <>
                          <button 
                            onClick={() => onViewRecord(record)}
                            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-pink-600 hover:border-pink-200 transition-all shadow-sm"
                            title="Open Authorized Report"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => onDeleteRecord(record.id)}
                            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
                            title="Purge Record (Admin)"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-300 italic text-[10px] font-bold">
                          <Lock size={12} />
                          Verification Required
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center">
                    <div className="max-w-xs mx-auto opacity-20">
                      <Database size={48} className="mx-auto mb-4" />
                      <p className="font-black text-sm uppercase tracking-widest">No Authorized Entries Found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start gap-4 shadow-sm animate-pulse">
        <ShieldCheck className="text-amber-600 shrink-0" size={24} />
        <div>
          <p className="text-xs font-black text-amber-900 uppercase tracking-widest mb-1">Security Notice</p>
          <p className="text-xs text-amber-700 font-medium leading-relaxed">
            All database interactions are logged with Clinician ID and Timestamp. Unauthorized attempts to access Critical Medical Alerts will trigger a security review and temporary credentials suspension.
          </p>
        </div>
      </div>
    </div>
  );
};
