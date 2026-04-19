import React from 'react';

export const Architecture: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900">System Architecture</h2>
        <p className="mt-4 text-lg text-slate-500">
          Visual representation of the Hybrid Deep Learning and Machine Learning Framework.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 p-8">
        
        {/* Main Flow Diagram */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
          
          {/* Step 1 */}
          <div className="flex-1 min-w-[150px] p-4 bg-slate-50 rounded-lg border border-slate-200 text-center relative">
            <div className="font-bold text-slate-900">Data Input</div>
            <div className="text-xs text-slate-500 mt-2">Clinical Data & Medical Images</div>
          </div>

          <div className="hidden md:block w-8 h-0.5 bg-slate-300 relative">
             <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-slate-300 transform rotate-45"></div>
          </div>
          <div className="md:hidden h-8 w-0.5 bg-slate-300"></div>

          {/* Step 2 */}
          <div className="flex-1 min-w-[150px] p-4 bg-blue-50 rounded-lg border border-blue-200 text-center relative">
            <div className="font-bold text-blue-900">Preprocessing</div>
            <div className="text-xs text-blue-600 mt-2">Normalization, Resizing, Augmentation</div>
          </div>

          <div className="hidden md:block w-8 h-0.5 bg-slate-300 relative">
             <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-slate-300 transform rotate-45"></div>
          </div>
          <div className="md:hidden h-8 w-0.5 bg-slate-300"></div>

          {/* Step 3 */}
          <div className="flex-1 min-w-[150px] p-4 bg-purple-50 rounded-lg border border-purple-200 text-center relative shadow-sm">
            <div className="font-bold text-purple-900">Feature Extraction (CNN)</div>
            <div className="text-xs text-purple-600 mt-2">Conv Layers, Pooling, Flattening</div>
          </div>

           <div className="hidden md:block w-8 h-0.5 bg-slate-300 relative">
             <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-slate-300 transform rotate-45"></div>
          </div>
          <div className="md:hidden h-8 w-0.5 bg-slate-300"></div>

          {/* Step 4 */}
          <div className="flex-1 min-w-[150px] p-4 bg-pink-50 rounded-lg border border-pink-200 text-center relative shadow-sm">
            <div className="font-bold text-pink-900">ML Classification</div>
            <div className="text-xs text-pink-600 mt-2">Random Forest, SVM, KNN</div>
          </div>

           <div className="hidden md:block w-8 h-0.5 bg-slate-300 relative">
             <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-slate-300 transform rotate-45"></div>
          </div>
          <div className="md:hidden h-8 w-0.5 bg-slate-300"></div>

           {/* Step 5 */}
           <div className="flex-1 min-w-[150px] p-4 bg-green-50 rounded-lg border border-green-200 text-center relative shadow-md ring-2 ring-green-100">
            <div className="font-bold text-green-900">Explainable AI (XAI)</div>
            <div className="text-xs text-green-600 mt-2">SHAP Values, PDP, Heatmaps</div>
          </div>

        </div>

        {/* Detailed Breakdown */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">CNN Architecture (Feature Extractor)</h3>
                <ul className="space-y-3">
                    <li className="flex items-center text-sm text-slate-600">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Conv1: 3x3 Kernel, 16 Channels (28x28 Output)
                    </li>
                    <li className="flex items-center text-sm text-slate-600">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Conv2: 3x3 Kernel, 32 Channels (14x14 Output)
                    </li>
                    <li className="flex items-center text-sm text-slate-600">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Conv3: 3x3 Kernel, 64 Channels (14x14 Output)
                    </li>
                    <li className="flex items-center text-sm text-slate-600">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Conv4: 3x3 Kernel, 128 Channels (7x7 Output)
                    </li>
                    <li className="flex items-center text-sm text-slate-600">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Dropout & Fully Connected Layers
                    </li>
                </ul>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Explainable AI Components</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-slate-700 text-sm">SHAP (SHapley Additive exPlanations)</h4>
                        <p className="text-xs text-slate-500 mt-1">Assigns contribution scores to each feature (pixel or clinical attribute) to highlight important predictors.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-700 text-sm">PDP (Partial Dependence Plots)</h4>
                        <p className="text-xs text-slate-500 mt-1">Shows the relationship between selected features and prediction outcomes to understand marginal effects.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};