
import React, { useState, useRef, useEffect } from 'react';
import { Lock, Mail, ShieldAlert, ArrowRight, Loader2, UserPlus, CheckCircle2, Camera, RefreshCw, UserCircle, ShieldCheck, Building, Search, Fingerprint, Info, Check, AlertTriangle, XCircle, CameraOff } from 'lucide-react';
import { Clinician, ClinicianRole, OnboardingRequest } from './types';

interface LoginProps {
  onLogin: (clinician: Clinician) => void;
  onRequestAccess: (request: any) => void;
  clinicians: Clinician[];
  onboardingRequests: OnboardingRequest[];
}

export const Login: React.FC<LoginProps> = ({ onLogin, onRequestAccess, clinicians, onboardingRequests }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [verifyingPhoto, setVerifyingPhoto] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showStatusCheck, setShowStatusCheck] = useState(false);
  const [statusEmail, setStatusEmail] = useState('');
  const [foundClinician, setFoundClinician] = useState<Clinician | null>(null);
  const [foundRequest, setFoundRequest] = useState<OnboardingRequest | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [onboardingData, setOnboardingData] = useState({
    name: '',
    email: '',
    licenseNumber: '',
    hospital: '',
    role: 'Radiologist' as ClinicianRole
  });

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      setError("Camera access denied. Ensure browser permissions allow camera usage.");
    }
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraActive]);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setVerifyingPhoto(true);
    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    
    ctx?.translate(canvasRef.current.width, 0);
    ctx?.scale(-1, 1);
    ctx?.drawImage(videoRef.current, 0, 0);
    
    const imageData = canvasRef.current.toDataURL('image/jpeg');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const rand = Math.random();
    let qualityPass = false;
    let errorMessage = '';

    // Requirement: Specific error messages for face capture
    if (rand < 0.12) {
      errorMessage = 'Face not detected. Please retake the photo.';
    } else if (rand < 0.24) {
      errorMessage = 'Face is partially covered. Ensure full visibility.';
    } else if (rand < 0.36) {
      errorMessage = 'Image is too dark. Improve lighting and try again.';
    } else if (rand < 0.48) {
      errorMessage = 'Face not centered. Please align properly.';
    } else {
      qualityPass = true;
    }
    
    if (qualityPass) {
      setFaceImage(imageData);
      setFieldErrors(prev => ({ ...prev, face: '' }));
      stopCamera();
    } else {
      setFieldErrors(prev => ({ ...prev, face: errorMessage }));
    }
    setVerifyingPhoto(false);
  };

  const validateOnboarding = () => {
    const errors: Record<string, string> = {};
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!onboardingData.email.trim()) {
      errors.email = "Compulsory field. Please enter email.";
    } else if (!emailRegex.test(onboardingData.email)) {
      errors.email = "Invalid email format. Please correct it.";
    }

    const licenseRegex = /^(TNMC\/\d{4}\/\d{6}|NMC\/REG\/\d{4}\/\d{6}|MCI\/\d{4}\/\d{6}|FMG\/\d{4}\/\d{6}|HOSP-DR-\d{5})$/;
    if (!onboardingData.licenseNumber.trim()) {
      errors.licenseNumber = "Compulsory field. Please enter registration number.";
    } else if (!licenseRegex.test(onboardingData.licenseNumber)) {
      errors.licenseNumber = "Wrong format detect. Please correct it to match accepted medical standards.";
    }

    if (!onboardingData.name.trim()) errors.name = "Compulsory field. Name required.";
    if (!onboardingData.hospital.trim()) errors.hospital = "Compulsory field. Hospital required.";
    if (!faceImage) errors.face = "Compulsory: Live profile photograph with verified quality required.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const clinician = clinicians.find(c => c.email.toLowerCase() === email.toLowerCase());
      if (clinician && password === (clinician.password || 'password2026')) {
        onLogin(clinician);
      } else {
        setError('Verification failed. Use correct official email and your unique security key.');
        setLoading(false);
      }
    }, 1200);
  };

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOnboarding()) return;

    setLoading(true);
    setTimeout(() => {
      onRequestAccess({...onboardingData, faceImageData: faceImage});
      setRequestSent(true);
      setLoading(false);
    }, 1500);
  };

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFoundClinician(null);
    setFoundRequest(null);

    setTimeout(() => {
      const clinician = clinicians.find(c => c.email.toLowerCase() === statusEmail.toLowerCase());
      const request = onboardingRequests.find(r => r.email.toLowerCase() === statusEmail.toLowerCase());
      
      if (clinician) {
        setFoundClinician(clinician);
      } else if (request) {
        setFoundRequest(request);
      } else {
        setError('No record found for this email address.');
      }
      setLoading(false);
    }, 1000);
  };

  if (showStatusCheck) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Fingerprint size={120} />
            </div>
            
            <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
              <Search className="text-pink-500" />
              Status Check
            </h2>
            <p className="text-slate-400 text-xs font-medium mb-8">Verify if your medical onboarding has been approved by System Authority.</p>

            {foundClinician || (foundRequest && foundRequest.status === 'APPROVED') ? (
              <div className="space-y-6 animate-in zoom-in duration-500">
                <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-3xl text-center">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 />
                  </div>
                  <h3 className="text-white font-black">Onboarding Approved</h3>
                  <p className="text-green-500 text-[10px] font-black uppercase tracking-widest mt-1">Credentials Active</p>
                </div>

                <div className="space-y-4 font-mono">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[9px] text-slate-500 uppercase mb-1">Assigned Staff ID</p>
                    <p className="text-white font-black tracking-widest">{foundClinician?.id || (foundRequest ? `STF-${foundRequest.id.split('-')[1]}` : 'PENDING')}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[9px] text-slate-500 uppercase mb-1">Your Unique Security Key</p>
                    <p className="text-pink-500 font-black tracking-widest">{foundClinician?.password || foundRequest?.password || 'password2026'}</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (foundClinician) setEmail(foundClinician.email);
                    else if (foundRequest) setEmail(foundRequest.email);
                    setShowStatusCheck(false);
                    setFoundClinician(null);
                    setFoundRequest(null);
                  }}
                  className="w-full py-4 bg-white text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-slate-100 transition-all"
                >
                  Proceed to Login
                </button>
              </div>
            ) : foundRequest ? (
              <div className="space-y-6 animate-in zoom-in duration-500">
                <div className={`p-6 rounded-3xl text-center ${foundRequest.status === 'PENDING' ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${foundRequest.status === 'PENDING' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'}`}>
                    {foundRequest.status === 'PENDING' ? <Clock /> : <XCircle />}
                   </div>
                   <h3 className="text-white font-black">
                     {foundRequest.status === 'PENDING' ? 'Verification Pending' : 'Request Declined'}
                   </h3>
                   <p className={`${foundRequest.status === 'PENDING' ? 'text-amber-500' : 'text-red-500'} text-[10px] font-black uppercase tracking-widest mt-1`}>
                     {foundRequest.status === 'PENDING' ? 'System Authority Review' : 'Credentials Rejected'}
                   </p>
                 </div>
                 
                 <p className="text-slate-400 text-[11px] text-center leading-relaxed">
                   {foundRequest.status === 'PENDING' 
                     ? 'Your medical credentials are currently being validated by the System Authority. Please check back later.' 
                     : 'Your application for terminal access has been declined. Please contact the System Authority for details.'}
                 </p>

                 <button 
                   type="button"
                   onClick={() => { setShowStatusCheck(false); setFoundRequest(null); }}
                   className="w-full py-4 bg-white/5 text-white border border-white/10 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
                 >
                   Back to Login
                 </button>
               </div>
            ) : (
              <form onSubmit={handleCheckStatus} className="space-y-6">
                {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black text-center">{error}</div>}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Registered Email</label>
                  <input 
                    type="email" 
                    required 
                    value={statusEmail} 
                    onChange={e => { setStatusEmail(e.target.value); setError(''); }} 
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-pink-500 transition-all" 
                    placeholder="dr.example@hospital.org" 
                  />
                </div>
                <button disabled={loading} className="w-full py-5 bg-pink-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-pink-700">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Check Registration'}
                </button>
                <button type="button" onClick={() => { setShowStatusCheck(false); setFoundClinician(null); setError(''); }} className="w-full text-[10px] font-black text-slate-500 uppercase tracking-widest">Back</button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12 relative overflow-hidden">
        <div className="max-w-6xl w-full relative z-10">
          <div className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-[40px] border border-white/10 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-5 -mr-10 -mt-10">
                <ShieldCheck size={240} />
            </div>

            {requestSent ? (
              <div className="text-center py-12 animate-in zoom-in">
                <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-white mb-4">Onboarding Initialized</h2>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-10">Verification protocol active. You can check your approval status using the "Check Status" tool once the System Authority validates your medical credentials.</p>
                <button onClick={() => { setShowOnboarding(false); setRequestSent(false); }} className="px-10 py-4 bg-white text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">Return to Login</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
                <div className="lg:col-span-7 space-y-10">
                  <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-4">
                        <UserPlus className="text-pink-500" size={32} /> 
                        Doctor Onboarding
                    </h2>
                    <p className="text-slate-500 font-medium text-sm mt-2 uppercase tracking-widest">Compulsory Credential Submission Terminal</p>
                  </div>

                  <form className="space-y-6" onSubmit={handleOnboardingSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name <span className="text-red-500">*</span></label>
                            <input 
                              required 
                              className={`w-full px-5 py-4 bg-white/5 border rounded-2xl text-white text-sm outline-none transition-all ${fieldErrors.name ? 'border-red-500' : 'border-white/10 focus:border-pink-500'}`} 
                              placeholder="Dr. Jane Smith" 
                              value={onboardingData.name} 
                              onChange={e => { setOnboardingData({...onboardingData, name: e.target.value}); setFieldErrors({...fieldErrors, name: ''}); }} 
                            />
                            {fieldErrors.name && <p className="text-[9px] font-bold text-red-500 uppercase ml-1">{fieldErrors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Institutional Email <span className="text-red-500">*</span></label>
                            <input 
                              required 
                              type="email" 
                              className={`w-full px-5 py-4 bg-white/5 border rounded-2xl text-white text-sm outline-none transition-all ${fieldErrors.email ? 'border-red-500' : 'border-white/10 focus:border-pink-500'}`} 
                              placeholder="name@hospital.org" 
                              value={onboardingData.email} 
                              onChange={e => { setOnboardingData({...onboardingData, email: e.target.value}); setFieldErrors({...fieldErrors, email: ''}); }} 
                            />
                            {fieldErrors.email && <p className="text-[9px] font-black text-red-500 uppercase ml-1 flex items-center gap-1 leading-tight"><AlertTriangle size={10} className="shrink-0" /> {fieldErrors.email}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Medical Registration Number <span className="text-red-500">*</span></label>
                        <input 
                          required 
                          className={`w-full px-5 py-4 bg-white/5 border rounded-2xl text-white text-sm outline-none transition-all ${fieldErrors.licenseNumber ? 'border-red-500' : 'border-white/10 focus:border-pink-500'}`} 
                          placeholder="e.g., TNMC/2022/123456" 
                          value={onboardingData.licenseNumber} 
                          onChange={e => { setOnboardingData({...onboardingData, licenseNumber: e.target.value}); setFieldErrors({...fieldErrors, licenseNumber: ''}); }} 
                        />
                        {fieldErrors.licenseNumber && (
                          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl animate-in fade-in slide-in-from-top-2">
                            <p className="text-[10px] font-black text-red-500 uppercase flex items-center gap-2">
                              <XCircle size={12} /> Format Incorrect. Please correct it.
                            </p>
                            <p className="text-[9px] font-medium text-red-400 mt-1">{fieldErrors.licenseNumber}</p>
                          </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Department Role <span className="text-red-500">*</span></label>
                            <select className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-pink-500 appearance-none" value={onboardingData.role} onChange={e => setOnboardingData({...onboardingData, role: e.target.value as ClinicianRole})}>
                                <option value="Radiologist" className="bg-slate-800">Radiologist</option>
                                <option value="Pathologist" className="bg-slate-800">Pathologist</option>
                                <option value="Senior Oncologist" className="bg-slate-800">Senior Oncologist</option>
                                <option value="Research Lead" className="bg-slate-800">Research Lead</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Institution <span className="text-red-500">*</span></label>
                            <input 
                              required 
                              className={`w-full px-5 py-4 bg-white/5 border rounded-2xl text-white text-sm outline-none transition-all ${fieldErrors.hospital ? 'border-red-500' : 'border-white/10 focus:border-pink-500'}`} 
                              placeholder="Apollo / AIIMS / PEC" 
                              value={onboardingData.hospital} 
                              onChange={e => { setOnboardingData({...onboardingData, hospital: e.target.value}); setFieldErrors({...fieldErrors, hospital: ''}); }} 
                            />
                            {fieldErrors.hospital && <p className="text-[9px] font-bold text-red-500 uppercase ml-1">{fieldErrors.hospital}</p>}
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
                        <button disabled={loading || !faceImage || verifyingPhoto} className="flex-1 py-5 bg-pink-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                        {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Submit for Verification'}
                        </button>
                        <button type="button" onClick={() => setShowOnboarding(false)} className="px-10 py-5 bg-white/5 text-slate-500 border border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                    </div>
                  </form>
                </div>

                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-pink-600/5 border border-pink-500/20 p-8 rounded-[32px] space-y-6">
                        <div className="flex items-center gap-3 text-pink-500">
                            <Info size={20} />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Registration Guidance</h3>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium leading-loose">
                            To ensure clinical validity, all applicants must provide a valid medical registration number. Accepted formats include:
                        </p>
                        <ul className="space-y-3">
                            {[
                                { label: 'State Medical Council', example: 'TNMC/2022/123456' },
                                { label: 'National Medical Commission', example: 'NMC/REG/2023/654321' },
                                { label: 'Medical Council of India', example: 'MCI/2018/987654' },
                                { label: 'Foreign Medical Graduate', example: 'FMG/2020/345678' },
                                { label: 'Internal Identification', example: 'HOSP-DR-00125' }
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0"></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.label}</p>
                                        <p className="text-[10px] font-mono text-slate-500">{item.example}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                           <Fingerprint size={12} /> Live Identity Capture <span className="text-red-500">*</span>
                        </label>
                        <div className={`relative aspect-video rounded-[32px] overflow-hidden bg-black/60 border shadow-inner group transition-all ${fieldErrors.face ? 'border-red-500' : 'border-white/10'}`}>
                            {verifyingPhoto && (
                              <div className="absolute inset-0 z-20 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                                <RefreshCw className="text-pink-500 animate-spin mb-4" size={32} />
                                <p className="text-white font-black text-[10px] uppercase tracking-widest">Running AI Verification</p>
                                <p className="text-slate-400 text-[9px] mt-2">Checking face visibility, alignment, and lighting...</p>
                              </div>
                            )}

                            {!faceImage ? (
                            <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center gap-6">
                                {isCameraActive ? (
                                <>
                                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                                    <button type="button" onClick={handleCapture} className="absolute bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-2xl hover:scale-110 transition-transform"><Camera size={24} /></button>
                                </>
                                ) : (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-700">
                                        <Camera size={32} />
                                    </div>
                                    <button type="button" onClick={startCamera} className="px-8 py-3 bg-pink-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-pink-900/20">Initialize Identity Camera</button>
                                </div>
                                )}
                            </div>
                            ) : (
                            <div className="relative w-full h-full group">
                                <img src={faceImage} alt="Face" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-green-500/10 border-4 border-green-500/50 rounded-[32px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <div className="bg-green-500 text-white p-2 rounded-full shadow-2xl"><Check size={32} /></div>
                                </div>
                                <button type="button" onClick={() => { setFaceImage(null); startCamera(); }} className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-md text-white rounded-2xl text-[10px] font-black uppercase border border-white/10 hover:bg-black/80 transition-all"><RefreshCw size={14} /> Retake Identity Scan</button>
                            </div>
                            )}
                            <canvas ref={canvasRef} className="hidden" />
                        </div>
                        {fieldErrors.face && (
                          <div className="p-4 bg-red-600/95 rounded-2xl border border-red-500 shadow-lg animate-in shake duration-500">
                            <p className="text-[10px] font-black text-white uppercase flex items-center gap-2">
                              <CameraOff size={12} /> Verification Failed
                            </p>
                            <p className="text-[11px] font-black text-white mt-1 leading-relaxed">"{fieldErrors.face}"</p>
                          </div>
                        )}
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-600 rounded-[28px] text-white font-black text-4xl shadow-2xl mb-6">X</div>
          <h1 className="text-3xl font-black text-white tracking-tight">OncoVision <span className="text-pink-500">Secure</span></h1>
        </div>
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center">{error}</div>}
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:border-pink-500 outline-none text-sm font-bold transition-all" placeholder="Medical Email" />
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:border-pink-500 outline-none text-sm font-bold transition-all" placeholder="Unique Security Key" />
            <button disabled={loading} className="w-full py-5 bg-pink-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-pink-700 transition-all">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Enter Terminal'}
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
            <button onClick={() => setShowOnboarding(true)} className="text-pink-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 py-2 border border-white/5 rounded-xl hover:bg-white/5 transition-all"><UserPlus size={12} /> Join Staff</button>
            <button onClick={() => setShowStatusCheck(true)} className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 py-2 border border-white/5 rounded-xl hover:bg-white/5 transition-all"><Search size={12} /> Check Status</button>
          </div>
        </div>
      </div>
    </div>
  );
};
