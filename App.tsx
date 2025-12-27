
import React, { useState, useMemo } from 'react';
import { REGISTRATION_STEPS } from './constants';
import StepCard from './components/StepCard';
import ChatWidget from './components/ChatWidget';
import StepVideo from './components/StepVideo';

const App: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const activeStep = useMemo(() => 
    REGISTRATION_STEPS.find(s => s.id === activeStepId) || REGISTRATION_STEPS[0],
    [activeStepId]
  );

  const toggleStepCompletion = (id: number) => {
    setCompletedSteps(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const nextStep = () => {
    if (activeStepId < REGISTRATION_STEPS.length) {
      if (!completedSteps.includes(activeStepId)) {
        toggleStepCompletion(activeStepId);
      }
      setActiveStepId(activeStepId + 1);
    }
  };

  const progress = Math.round((completedSteps.length / REGISTRATION_STEPS.length) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-emerald-800 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white text-emerald-800 p-2 rounded-lg font-bold shadow-sm">JAMB</div>
            <h1 className="text-xl font-bold hidden sm:block">Step-by-Step Registration Guide</h1>
            <h1 className="text-xl font-bold sm:hidden">Registration Guide</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider">Your Progress</p>
                <p className="text-sm font-bold">{progress}% Complete</p>
              </div>
              <div className="w-32 h-2 bg-emerald-900/50 rounded-full overflow-hidden border border-emerald-700">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar - Step List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="mb-6">
              <h2 className="text-xs font-bold text-emerald-800 uppercase tracking-[0.2em] mb-4">Registration Roadmap</h2>
              <div className="space-y-3">
                {REGISTRATION_STEPS.map((step) => (
                  <StepCard
                    key={step.id}
                    step={step}
                    isActive={activeStepId === step.id}
                    isCompleted={completedSteps.includes(step.id)}
                    onClick={() => setActiveStepId(step.id)}
                  />
                ))}
              </div>
            </div>

            {/* Quick Support Card */}
            <div className="p-6 bg-emerald-900 rounded-2xl text-white shadow-xl shadow-emerald-900/10">
              <h3 className="font-bold text-lg mb-2">Need Help?</h3>
              <p className="text-emerald-100/70 text-sm mb-4">Our AI Assistant can answer specific questions about NIN, profile codes, or payment issues.</p>
              <div className="flex items-center gap-2 text-emerald-300 font-medium text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Ask the Chatbot below
              </div>
            </div>
          </div>

          {/* Main Content - Step Details */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-emerald-100 overflow-hidden min-h-[600px] flex flex-col">
              {/* Step Header */}
              <div className={`p-8 ${activeStep.color.includes('emerald') || activeStep.color.includes('green') ? activeStep.color : 'bg-emerald-600'} text-white`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Step {activeStep.id} of {REGISTRATION_STEPS.length}</span>
                    <h2 className="text-3xl font-bold mt-2">{activeStep.title}</h2>
                  </div>
                  <div className="text-6xl hidden md:block opacity-20">
                    {activeStep.icon}
                  </div>
                </div>
              </div>

              {/* Step Body */}
              <div className="p-8 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Detailed Description */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-emerald-800 uppercase mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        What to do
                      </h4>
                      <div className="space-y-4">
                        {activeStep.detailedContent.map((item, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-xs font-bold text-emerald-700 border border-emerald-100">
                              {i + 1}
                            </div>
                            <p className="text-slate-600 leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Video Section Integration */}
                    <div className="pt-6 border-t border-slate-100">
                       <h4 className="text-sm font-bold text-emerald-800 uppercase mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Video Guide
                      </h4>
                      <StepVideo prompt={activeStep.videoPrompt} stepId={activeStep.id} stepTitle={activeStep.title} />
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="text-sm font-bold text-amber-600 uppercase mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Important Tips
                      </h4>
                      <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm italic">
                        {activeStep.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Checklist Section */}
                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                    <h4 className="text-sm font-bold text-emerald-800 uppercase mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Requirement Checklist
                    </h4>
                    <div className="space-y-3">
                      {activeStep.checklist.map((item, i) => (
                        <label key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-emerald-400 transition-colors group">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-slate-700 text-sm font-medium group-hover:text-emerald-700">{item}</span>
                        </label>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-emerald-100 flex flex-col items-center">
                      <button 
                        onClick={() => toggleStepCompletion(activeStepId)}
                        className={`w-full py-3 rounded-xl font-bold transition-all duration-300 shadow-sm ${
                          completedSteps.includes(activeStepId)
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-emerald-800 border-2 border-emerald-200 hover:border-emerald-500'
                        }`}
                      >
                        {completedSteps.includes(activeStepId) ? '✓ Step Completed' : 'Mark as Complete'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                <button
                  disabled={activeStepId === 1}
                  onClick={() => setActiveStepId(prev => prev - 1)}
                  className="px-6 py-2 text-emerald-800 font-bold hover:text-emerald-600 disabled:opacity-30 flex items-center gap-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  className="bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-800 hover:scale-105 transition-all flex items-center gap-2"
                >
                  {activeStepId === REGISTRATION_STEPS.length ? 'Finalize' : 'Next Step'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Assistant Widget */}
      <ChatWidget currentStep={activeStepId} />

      {/* Global Footer */}
      <footer className="bg-emerald-900 py-12 text-center text-emerald-100 text-sm">
        <div className="max-w-4xl mx-auto px-4">
          <p className="font-bold mb-4">Official JAMB Information</p>
          <p className="opacity-70">© 2024 JAMB Registration Helper. This is an informational guide and not an official JAMB portal.</p>
          <p className="mt-2 opacity-70">Always verify information on the official <a href="https://jamb.gov.ng" target="_blank" rel="noopener noreferrer" className="text-emerald-300 font-bold hover:underline">jamb.gov.ng</a> website.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
