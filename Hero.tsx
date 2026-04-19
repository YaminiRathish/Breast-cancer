
import React from 'react';
import { ArrowRight, CheckCircle, ShieldCheck, Cpu, Activity } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-semibold tracking-wide uppercase mb-4">
                Project Report 2026
              </div>
              <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Hybrid Deep Learning</span>{' '}
                <span className="block text-pink-600 xl:inline">Breast Cancer Diagnosis</span>
              </h1>
              <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-auto">
                An advanced framework integrating Convolutional Neural Networks (CNN) for feature extraction and Machine Learning (SVM/RF) for classification, enhanced with Explainable AI (SHAP).
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <button
                    onClick={onStart}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 md:py-4 md:text-lg transition-all"
                  >
                    Start Diagnosis
                    <ArrowRight className="ml-2" size={20} />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-slate-50 border-l border-slate-100 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4 p-8 opacity-80 transform rotate-3">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                <Cpu className="text-blue-500 mb-3" size={32} />
                <h3 className="font-bold text-slate-900">Hybrid CNN+ML</h3>
                <p className="text-sm text-slate-500 mt-1">Combining deep feature extraction with robust ML classification.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 mt-8">
                <ShieldCheck className="text-green-500 mb-3" size={32} />
                <h3 className="font-bold text-slate-900">High Accuracy</h3>
                <p className="text-sm text-slate-500 mt-1">~98% accuracy on WBCD and WDBC benchmark datasets.</p>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 -mt-8">
                <CheckCircle className="text-purple-500 mb-3" size={32} />
                <h3 className="font-bold text-slate-900">Explainable AI</h3>
                <p className="text-sm text-slate-500 mt-1">SHAP & PDP plots providing clinical transparency.</p>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                <Activity className="text-pink-500 mb-3" size={32} />
                <h3 className="font-bold text-slate-900">Early Detection</h3>
                <p className="text-sm text-slate-500 mt-1">Assisting clinicians in early and accurate diagnosis.</p>
            </div>
        </div>
      </div>
    </div>
  );
};
