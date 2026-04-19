
import React from 'react';
import { ExternalLink, Github, Cloud, Globe, ShieldCheck, Zap } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 sm:p-12">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-6">About the Project</h1>
          
          <div className="prose prose-pink max-w-none text-slate-600">
            <h3 className="text-xl font-bold text-slate-800">Abstract</h3>
            <p className="mb-4">
              Breast cancer is one of the most prevalent diseases among women worldwide and remains a leading cause of cancer-related deaths. 
              Early detection and diagnosis play a crucial role in reducing mortality rates.
            </p>
            <p className="mb-6">
              This project proposes a <strong>Hybrid Deep Learning and Machine Learning Framework</strong> for Breast Cancer Diagnosis integrated with 
              <strong> Explainable Artificial Intelligence (XAI)</strong> methods. The system leverages Convolutional Neural Networks (CNNs) for automatic feature extraction 
              from images and Machine Learning (ML) algorithms such as K-Nearest Neighbours (KNN), Random Forest (RF), and Support Vector Machine (SVM) 
              for final classification. To ensure transparency, XAI techniques like SHAP (SHapley Additive exPlanations) are used.
            </p>

            {/* Deployment Section */}
            <div className="mt-12 bg-indigo-50 rounded-3xl p-8 border border-indigo-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-lg">
                        <Cloud size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-indigo-900 m-0">Cloud Deployment Guide</h3>
                </div>
                
                <p className="text-indigo-800 text-sm font-medium mb-6">
                    To access this application on any device via a permanent link (e.g., <code>oncovision-xai.vercel.app</code>), follow these professional deployment steps:
                </p>

                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-white border border-indigo-200 rounded-full flex items-center justify-center font-bold text-indigo-600 shadow-sm">1</div>
                        <div>
                            <p className="font-bold text-indigo-900 text-sm uppercase tracking-wide">Version Control</p>
                            <p className="text-xs text-indigo-700 mt-1">Upload this source code to a <strong>GitHub</strong> or <strong>GitLab</strong> repository.</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-white border border-indigo-200 rounded-full flex items-center justify-center font-bold text-indigo-600 shadow-sm">2</div>
                        <div>
                            <p className="font-bold text-indigo-900 text-sm uppercase tracking-wide">Connect to Vercel/Netlify</p>
                            <p className="text-xs text-indigo-700 mt-1">Link your repository to <a href="https://vercel.com" target="_blank" className="font-bold underline">Vercel</a>. It will automatically detect the React framework.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-white border border-indigo-200 rounded-full flex items-center justify-center font-bold text-indigo-600 shadow-sm">3</div>
                        <div>
                            <p className="font-bold text-indigo-900 text-sm uppercase tracking-wide">Set Environment Variables</p>
                            <p className="text-xs text-indigo-700 mt-1">In the Vercel Dashboard, add <code>API_KEY</code> from your Google AI Studio to enable the Gemini Clinical Insights.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-indigo-200/50 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                        <Zap size={14} /> Auto Scaling
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                        <Globe size={14} /> Global CDN
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mt-12">Project Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="font-bold text-slate-900">Lokeshwari S</p>
                <p className="text-sm text-slate-500">313522104084</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="font-bold text-slate-900">Soundarya Devi K</p>
                <p className="text-sm text-slate-500">313522104158</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="font-bold text-slate-900">Sree Varsha M</p>
                <p className="text-sm text-slate-500">313522104159</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="font-bold text-slate-900">Yamini R</p>
                <p className="text-sm text-slate-500">313522104180</p>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Institution</p>
              <p className="font-bold text-slate-900 text-lg">Panimalar Engineering College, Chennai</p>
              <p className="text-slate-600">Department of Computer Science and Engineering</p>
              <p className="text-slate-500 text-sm mt-1">May 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
