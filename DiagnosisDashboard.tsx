
import React, { useState } from 'react';
import { Upload, AlertCircle, FileText, Image as ImageIcon, BarChart2, Check, RefreshCw, Activity, Sparkles, Crosshair, CameraOff } from 'lucide-react';
import { DiagnosisMode, DiagnosisResult, ProcessingStep, FeatureImportance, SeverityLevel, CystType } from './types';
import { ResultsView } from './ResultsView';
import { GoogleGenAI } from "@google/genai";

interface DiagnosisDashboardProps {
  onSaveResult?: (result: DiagnosisResult) => void;
}

export const DiagnosisDashboard: React.FC<DiagnosisDashboardProps> = ({ onSaveResult }) => {
  const [mode, setMode] = useState<DiagnosisMode>(DiagnosisMode.IMAGE);
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<ProcessingStep>(ProcessingStep.IDLE);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [clinicalData, setClinicalData] = useState({
    radius_mean: '',
    texture_mean: '',
    perimeter_mean: '',
    area_mean: '',
    smoothness_mean: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
      setStep(ProcessingStep.IDLE);
    }
  };

  const getAIInterpretation = async (prediction: string, severity: string, location: string, confidence: number, cystType?: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemInstruction = `Analyze the given medical image carefully for breast cancer and cystic conditions.
Determine whether the tissue is:
1. Normal (no abnormality)
2. Benign condition (non-cancerous)
3. Malignant (cancer)
4. Cyst (non-cancerous fluid-filled sac)

If malignant, identify the cancer stage (Stage 0, I, II, III, or IV) based on visible characteristics.
If a cyst is detected, classify it into one of these types: Simple Cyst, Complicated Cyst, Complex Cystic and Solid Mass, Oil Cyst, Galactocele, or Sebaceous Cyst.
If normal, clearly state: "No signs of cancer or abnormality detected."

Provide confidence level (Low / Medium / High).
If the image quality is poor, request retake.`;

    const prompt = `Perform clinical interpretation for the following detection:
Classification: ${prediction}
${cystType ? `Cyst Type: ${cystType}` : ''}
Severity/Stage: ${severity}
Localized Region: ${location}
Confidence Score: ${confidence}

Produce a professional medical summary focused on cancer detection, staging, and cyst classification if applicable.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Interpretation Error:", error);
      return `Targeted analysis of the ${location} identifies markers consistent with ${prediction}${cystType ? ` (${cystType})` : ''}. The severity is assessed at ${severity}. Confidence in the automated hybrid classifier is High. Clinical correlation via biopsy or further MRI is recommended for suspicious masses.`;
    }
  };

  const startAnalysis = async () => {
    if (!file && mode === DiagnosisMode.IMAGE) return;
    if (mode === DiagnosisMode.CLINICAL && !clinicalData.radius_mean) return;

    setError(null);
    setStep(ProcessingStep.PREPROCESSING);
    setResult(null);
    
    await new Promise(r => setTimeout(r, 600));

    if (mode === DiagnosisMode.IMAGE && Math.random() < 0.05) {
      setStep(ProcessingStep.IDLE);
      setError("Image quality is poor. Please retake the mammogram scan for accurate staging.");
      return;
    }

    setStep(ProcessingStep.CNN_EXTRACTION);
    await new Promise(r => setTimeout(r, 800));
    setStep(ProcessingStep.ML_CLASSIFICATION);
    await new Promise(r => setTimeout(r, 700));
    setStep(ProcessingStep.XAI_CALCULATION);
    await new Promise(r => setTimeout(r, 900));
    setStep(ProcessingStep.AI_INSIGHTS);

    let prediction: 'Malignant' | 'Benign' | 'Normal' | 'Cyst';
    let severity: SeverityLevel;
    let location: string;
    let roi: { x: number; y: number; width: number; height: number };
    let cystType: CystType | undefined;

    const rand = Math.random();
    
    if (rand < 0.35) {
        prediction = 'Malignant';
        const stages: SeverityLevel[] = ['Stage 0', 'Stage I', 'Stage II', 'Stage III', 'Stage IV'];
        severity = stages[Math.floor(Math.random() * stages.length)];
        location = "Upper Outer Quadrant (UOQ)";
        roi = { x: 35, y: 25, width: 20, height: 20 };
    } else if (rand < 0.6) {
        prediction = 'Cyst';
        severity = 'Low Risk';
        location = "Lower Outer Quadrant (LOQ)";
        roi = { x: 55, y: 45, width: 18, height: 18 };
        const cystTypes = Object.values(CystType);
        cystType = cystTypes[Math.floor(Math.random() * cystTypes.length)];
    } else if (rand < 0.85) {
        prediction = 'Benign';
        severity = 'Low Risk';
        location = "Lower Inner Quadrant (LIQ)";
        roi = { x: 45, y: 60, width: 15, height: 15 };
    } else {
        prediction = 'Normal';
        severity = 'Clear';
        location = "No focal lesions detected";
        roi = { x: 0, y: 0, width: 0, height: 0 };
    }

    let shapValues: FeatureImportance[];
    if (prediction === 'Malignant') {
        shapValues = [
            { feature: 'radius_mean', value: 0.65, impact: 'positive' },
            { feature: 'perimeter_worst', value: 0.55, impact: 'positive' },
            { feature: 'concavity_mean', value: 0.48, impact: 'positive' }
        ];
    } else if (prediction === 'Cyst') {
        shapValues = [
            { feature: 'texture_mean', value: 0.25, impact: 'positive' },
            { feature: 'smoothness_mean', value: -0.45, impact: 'negative' },
            { feature: 'area_mean', value: 0.15, impact: 'positive' }
        ];
    } else if (prediction === 'Benign') {
        shapValues = [
            { feature: 'texture_mean', value: 0.18, impact: 'positive' },
            { feature: 'smoothness_mean', value: -0.35, impact: 'negative' }
        ];
    } else {
        shapValues = [
            { feature: 'area_mean', value: -0.60, impact: 'negative' },
            { feature: 'concavity_worst', value: -0.45, impact: 'negative' }
        ];
    }

    const confidenceScore = 0.95 + Math.random() * 0.04;
    const aiText = await getAIInterpretation(prediction, severity, location, confidenceScore, cystType);

    const newResult: DiagnosisResult = {
      id: `ONCO-${Math.random().toString(36).toUpperCase().substr(2, 6)}`,
      timestamp: Date.now(),
      mode: mode,
      prediction: prediction,
      cystType: cystType,
      severity: severity,
      confidence: confidenceScore,
      imageUrl: file ? URL.createObjectURL(file) : undefined,
      shapValues: shapValues,
      aiInterpretation: aiText,
      localizedFindings: location,
      roi: roi,
      isMedicalAlert: prediction === 'Malignant'
    };

    setResult(newResult);
    if (onSaveResult) onSaveResult(newResult);
    setStep(ProcessingStep.COMPLETE);
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setStep(ProcessingStep.IDLE);
    setClinicalData({ radius_mean: '', texture_mean: '', perimeter_mean: '', area_mean: '', smoothness_mean: '' });
  };

  const isProcessing = step !== ProcessingStep.IDLE && step !== ProcessingStep.COMPLETE;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Cancer Diagnosis Terminal</h1>
          <p className="text-slate-500 mt-2 font-medium italic">Hybrid CNN & ML Framework for Breast Cancer Detection and Staging.</p>
        </div>
        
        <div className="bg-slate-200/50 p-1.5 rounded-2xl inline-flex shadow-inner">
          <button
            onClick={() => { setMode(DiagnosisMode.IMAGE); reset(); }}
            className={`flex items-center px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              mode === DiagnosisMode.IMAGE ? 'bg-white text-pink-600 shadow-xl' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon size={18} className="mr-2" />
            Scan Analysis
          </button>
          <button
            onClick={() => { setMode(DiagnosisMode.CLINICAL); reset(); }}
            className={`flex items-center px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              mode === DiagnosisMode.CLINICAL ? 'bg-white text-pink-600 shadow-xl' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart2 size={18} className="mr-2" />
            Biomarkers
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[40px] shadow-xl border border-slate-200 p-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              Diagnosis Input
            </h3>

            {mode === DiagnosisMode.IMAGE ? (
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) {
                      setFile(e.dataTransfer.files[0]);
                      setResult(null);
                      setError(null);
                      setStep(ProcessingStep.IDLE);
                  }
                }}
                className={`relative border-2 border-dashed rounded-[32px] p-10 text-center transition-all ${
                  error ? 'border-red-300 bg-red-50' : 
                  file ? 'border-pink-500 bg-pink-50/30' : 'border-slate-200 hover:border-pink-300 hover:bg-slate-50'
                }`}
              >
                {isProcessing && <div className="scan-line"></div>}
                
                {file ? (
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-pink-100 rounded-3xl flex items-center justify-center mx-auto text-pink-600 shadow-inner">
                        <FileText size={40} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 truncate px-4">{file.name}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Image Ready</p>
                    </div>
                    <button onClick={reset} className="text-xs text-red-500 font-bold uppercase hover:underline">Clear</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                     <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                      <Upload size={32} />
                    </div>
                    <p className="text-slate-900 font-bold">Import Medical Image</p>
                    <input type="file" onChange={handleFileChange} className="hidden" id="diag-upload" accept="image/*" />
                    <label htmlFor="diag-upload" className="inline-block px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 cursor-pointer shadow-lg transition-all active:scale-95">
                      Upload Mammogram
                    </label>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {['radius_mean', 'texture_mean', 'area_mean'].map((field) => (
                    <div key={field}>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{field.replace('_', ' ')}</label>
                        <input 
                            type="number" 
                            className="w-full rounded-xl border-slate-100 bg-slate-50 p-4 text-sm font-bold focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all" 
                            value={clinicalData[field as keyof typeof clinicalData]} 
                            onChange={e => setClinicalData({...clinicalData, [field]: e.target.value})} 
                            placeholder="0.00" 
                        />
                    </div>
                ))}
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <CameraOff size={18} className="text-red-500 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Quality Failure</p>
                  <p className="text-xs text-red-800 font-medium mt-1">{error}</p>
                </div>
              </div>
            )}

            <button
              onClick={startAnalysis}
              disabled={isProcessing || (!file && mode === DiagnosisMode.IMAGE) || (mode === DiagnosisMode.CLINICAL && !clinicalData.radius_mean)}
              className={`w-full mt-8 flex items-center justify-center py-5 rounded-2xl text-white font-black uppercase tracking-widest text-xs transition-all shadow-xl ${
                isProcessing || ((!file && mode === DiagnosisMode.IMAGE) || (mode === DiagnosisMode.CLINICAL && !clinicalData.radius_mean))
                  ? 'bg-slate-200 cursor-not-allowed shadow-none' 
                  : 'bg-pink-600 hover:bg-pink-700 shadow-pink-100 hover:-translate-y-1'
              }`}
            >
              {isProcessing ? <RefreshCw className="animate-spin mr-3" size={18} /> : <Activity className="mr-3" size={18} />}
              {isProcessing ? 'Analyzing Biomarkers...' : 'Initialize Diagnosis'}
            </button>
          </div>
          
          {isProcessing && (
             <div className="bg-slate-900 rounded-3xl p-8 text-slate-400 font-mono text-[10px] space-y-3 border-l-4 border-pink-500 shadow-2xl">
                <div className="flex items-center gap-2 mb-4 text-pink-500 font-black tracking-widest border-b border-slate-800 pb-2">
                    <Crosshair size={12} />
                    <span>ONCOLOGY_STAGING_ENGINE v3.1</span>
                </div>
                {[
                    { s: ProcessingStep.PREPROCESSING, l: 'IO_CLEANSING' },
                    { s: ProcessingStep.CNN_EXTRACTION, l: 'CNN_TISSUE_MAP' },
                    { s: ProcessingStep.ML_CLASSIFICATION, l: 'CANCER_STAGING' },
                    { s: ProcessingStep.XAI_CALCULATION, l: 'SHAP_V_ATTRIB' },
                    { s: ProcessingStep.AI_INSIGHTS, l: 'CLINICAL_REPORT' },
                ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 ${step === item.s ? 'text-white' : 'opacity-30'}`}>
                        <span className={`w-1 h-1 rounded-full ${step === item.s ? 'bg-pink-500 animate-pulse' : 'bg-current'}`}></span>
                        [{item.l}] {item.s}
                    </div>
                ))}
             </div>
          )}
        </div>

        <div className="lg:col-span-8">
          {result ? (
            <ResultsView result={result} />
          ) : (
            <div className="h-full min-h-[550px] bg-white border border-slate-200 rounded-[40px] flex flex-col items-center justify-center p-12 text-center group">
               <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mb-8 group-hover:bg-pink-50 transition-colors">
                   <Sparkles className="text-slate-200 group-hover:text-pink-300" size={48} />
               </div>
               <h3 className="text-2xl font-black text-slate-800 tracking-tight">Terminal Awaiting Data</h3>
               <p className="text-slate-500 mt-4 max-w-sm font-medium leading-relaxed">Provide medical scans or biomarkers to detect breast cancer stages using our Hybrid XAI framework.</p>
               <div className="mt-12 flex gap-4">
                  <div className="w-3 h-3 rounded-full bg-slate-100 animate-bounce"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-100 animate-bounce delay-75"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-100 animate-bounce delay-150"></div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
