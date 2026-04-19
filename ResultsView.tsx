
import React, { useState } from 'react';
import { DiagnosisResult, SeverityLevel } from './types';
import { Download, Sparkles, UserCheck, ShieldCheck, FileText, Check, Crosshair, AlertTriangle, Layers, BarChart as BarChartIcon, Info, Activity, FileSearch } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface ResultsViewProps {
  result: DiagnosisResult;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result }) => {
  const [showROI, setShowROI] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const isCancer = result.prediction === 'Malignant';
  const isCyst = result.prediction === 'Cyst';
  const isNormal = result.prediction === 'Normal';
  
  const conditionLabel = isCancer ? "Malignant Carcinoma" : 
                         isCyst ? `Cystic Condition: ${result.cystType}` :
                         !isNormal ? "Benign Mass Detected" : 
                         "Normal Breast Tissue";

  const getStatusStyles = (prediction: string) => {
      switch (prediction) {
          case 'Malignant':
              return {
                  bg: 'bg-red-50/50',
                  border: 'border-red-100',
                  badge: 'bg-red-600 text-white',
                  bar: 'bg-red-500',
                  text: 'text-red-900',
                  glow: 'shadow-red-200',
                  icon: 'text-red-600',
                  label: 'Malignant (Cancer Detected)'
              };
          case 'Cyst':
              return {
                  bg: 'bg-blue-50/50',
                  border: 'border-blue-100',
                  badge: 'bg-blue-600 text-white',
                  bar: 'bg-blue-500',
                  text: 'text-blue-900',
                  glow: 'shadow-blue-200',
                  icon: 'text-blue-600',
                  label: 'Cyst (Non-Cancerous)'
              };
          case 'Benign':
              return {
                  bg: 'bg-amber-50/50',
                  border: 'border-amber-100',
                  badge: 'bg-amber-600 text-white',
                  bar: 'bg-amber-500',
                  text: 'text-amber-900',
                  glow: 'shadow-amber-200',
                  icon: 'text-amber-600',
                  label: 'Benign (Non-Cancerous)'
              };
          default:
               return {
                  bg: 'bg-green-50/50',
                  border: 'border-green-100',
                  badge: 'bg-green-600 text-white',
                  bar: 'bg-green-500',
                  text: 'text-green-900',
                  glow: 'shadow-green-200',
                  icon: 'text-green-600',
                  label: 'Normal (Clear Scan)'
              };
      }
  };

  const styles = getStatusStyles(result.prediction);

  const handleDownloadReport = () => {
    setDownloading(true);
    const reportContent = `
ONCOVISION XAI - CANCER PATHOLOGY REPORT
------------------------------------------
Report ID: ${result.id}
Generated: ${new Date(result.timestamp).toLocaleString()}

DIAGNOSTIC STATUS: ${result.prediction.toUpperCase()}
IDENTIFIED NATURE: ${conditionLabel}
${result.cystType ? `CYST CLASSIFICATION: ${result.cystType}` : ''}
ONCOLOGY STAGE: ${result.severity}
DETECTION CONFIDENCE: ${(result.confidence * 100).toFixed(2)}%
QUADRANT: ${result.localizedFindings}

AI CLINICAL INTERPRETATION:
${result.aiInterpretation}

SHAP FEATURE CONTRIBUTIONS:
${result.shapValues.map(s => `${s.feature}: ${s.value.toFixed(4)}`).join('\n')}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OncoVision_Cancer_Report_${result.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
        setDownloading(false);
        setDownloadComplete(true);
        setTimeout(() => setDownloadComplete(false), 2000);
    }, 800);
  };

  return (
    <div className="bg-white rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom duration-500">
      
      <div className={`p-10 border-b ${styles.bg} ${styles.border} relative`}>
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-white text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200 shadow-sm">Hybrid Hybrid DL/ML Engine</span>
                <span className="text-slate-400 font-mono text-[10px]">{result.id}</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Pathology Summary</h2>
            <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl border border-white/80">
                    <Crosshair size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-700">{result.localizedFindings}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl border border-white/80">
                    <Activity size={14} className={styles.icon} />
                    <span className="text-xs font-bold text-slate-700">
                        {isNormal ? 'Normal Presentation' : 'Suspicious Morphology'}
                    </span>
                </div>
            </div>
          </div>
          
          <button 
              onClick={handleDownloadReport}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl shadow-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  downloadComplete ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
          >
              {downloadComplete ? <Check size={16} /> : <Download size={16} />}
              {downloadComplete ? 'Export Ready' : 'Download Clinical Report'}
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-8 rounded-3xl border-2 flex flex-col justify-center shadow-2xl md:col-span-2 ${styles.badge} ${styles.glow}`}>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-2">Automated Staging Result</span>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                    <div className="flex flex-col">
                        <span className="text-5xl font-black tracking-tighter leading-none">{result.prediction}</span>
                        <span className="text-xs font-black uppercase tracking-widest mt-2 opacity-80">{conditionLabel}</span>
                    </div>
                    {!isNormal && (
                        <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm flex flex-col items-center">
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-1">
                                Oncology Stage
                            </span>
                            <span className="text-xl font-black tracking-widest">{result.severity}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-lg flex flex-col justify-center">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Framework Confidence</span>
                 <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-800">{(result.confidence * 100).toFixed(1)}</span>
                    <span className="text-lg font-bold text-slate-400">%</span>
                 </div>
                 <div className="mt-4 w-full h-2 bg-slate-200/50 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${styles.bar}`} style={{width: `${result.confidence * 100}%`}}></div>
                 </div>
            </div>
        </div>
      </div>

      <div className="p-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={`p-8 rounded-[32px] border ${styles.border} ${styles.bg}`}>
            <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${styles.text}`}>
              {isCyst ? 'Cyst Classification' : 'Malignancy Classification'}
            </h4>
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white ${isCancer ? 'bg-red-600' : isCyst ? 'bg-blue-600' : 'bg-green-600'}`}>
                {isCancer ? <AlertTriangle size={32} /> : isCyst ? <Layers size={32} /> : <Check size={32} />}
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">
                    {isCancer ? 'Malignant Carcinoma' : isCyst ? result.cystType : 'No Signs Detected'}
                </p>
                <p className="text-xs font-medium text-slate-500 mt-1">
                    {isCancer ? 'Presence of abnormal solid masses and cellular irregularity confirmed.' : 
                     isCyst ? 'Fluid-filled sac detected. Morphology consistent with non-cancerous cystic conditions.' :
                     'Morphology is consistent with healthy breast tissue standards.'}
                </p>
              </div>
            </div>
          </div>
          <div className="p-8 rounded-[32px] border border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-400">
                    <FileSearch size={24} />
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Severity Rating</h4>
                    <p className="text-sm font-black text-slate-900">{result.severity}</p>
                </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-950 rounded-[40px] p-10 text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-400/20">
                        <Sparkles size={16} className="text-indigo-300" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-300">AI Clinical Summary</span>
                </div>
                <div className="prose prose-invert max-w-none">
                    <p className="text-lg leading-relaxed font-medium text-indigo-50 italic">
                        "{result.aiInterpretation}"
                    </p>
                </div>
                <div className="mt-8 flex items-center gap-4 text-indigo-400/60 font-bold text-[10px] uppercase tracking-widest border-t border-white/5 pt-6">
                    <UserCheck size={14} />
                    <span>Hybrid XAI Diagnosis Framework Verification</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="font-black text-slate-900 text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                        <Layers size={14} className="text-pink-500" />
                        Region of Interest (ROI)
                    </h3>
                    <button 
                        onClick={() => setShowROI(!showROI)}
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg transition-all ${
                            showROI ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-400'
                        }`}
                    >
                        {showROI ? 'Active' : 'Hidden'}
                    </button>
                </div>
                
                <div className="relative rounded-[40px] overflow-hidden border border-slate-200 bg-slate-900 aspect-square shadow-2xl group">
                    {result.imageUrl ? (
                        <>
                            <img src={result.imageUrl} alt="Cancer Scan" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            {showROI && result.roi && result.roi.width > 0 && (
                                    <div 
                                        className={`absolute border-2 border-dashed animate-pulse transition-all duration-1000 ${
                                            isCancer ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 
                                            isCyst ? 'border-blue-500 shadow-[0_0_20_rgba(59,130,246,0.5)]' :
                                            'border-green-500'
                                        }`}
                                        style={{
                                            left: `${result.roi.x}%`,
                                            top: `${result.roi.y}%`,
                                            width: `${result.roi.width}%`,
                                            height: `${result.roi.height}%`
                                        }}
                                    >
                                        <div className="absolute -top-6 left-0 bg-slate-900 text-white text-[8px] px-2 py-0.5 rounded font-black uppercase whitespace-nowrap">
                                            {isCyst ? `Cystic Region: ${result.cystType}` : `Pathological Region: ${result.severity}`}
                                        </div>
                                    </div>
                            )}
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-500 font-bold uppercase text-[10px] tracking-widest p-12 text-center leading-loose">
                            ML Feature extraction complete.<br/>Visual scan not attached to this clinical session.
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="font-black text-slate-900 text-xs uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                    <BarChartIcon size={14} className="text-pink-500" />
                    Feature Weights (SHAP)
                </h3>
                <div className="bg-slate-50/50 rounded-[40px] p-8 border border-slate-100 shadow-inner h-[420px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={result.shapValues} margin={{ top: 10, right: 30, left: 40, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="feature" type="category" width={100} tick={{fontSize: 9, fontWeight: '900', fill: '#94a3b8'}} />
                            <Tooltip 
                                contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', fontSize: '11px', fontWeight: 'bold'}}
                                cursor={{fill: 'transparent'}}
                            />
                            <ReferenceLine x={0} stroke="#cbd5e1" />
                            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                                {result.shapValues.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#ef4444' : '#3b82f6'} fillOpacity={0.8} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
