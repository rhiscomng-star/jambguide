
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  CreditCard, 
  UserPlus, 
  ChevronRight, 
  Play, 
  X, 
  Smartphone,
  Info,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { StepId } from './types';
import { ProfileCodeContent, PinVendingContent, RegistrationProcessContent } from './components/StepContent';
import { getJambAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [activeStep, setActiveStep] = useState<StepId>(StepId.PROFILE_CODE);
  const [showVideo, setShowVideo] = useState<string | null>(null);
  const [showPwaGuide, setShowPwaGuide] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const steps = [
    {
      id: StepId.PROFILE_CODE,
      title: "1. Profile Code Generation",
      description: "Start your journey by creating your unique profile code.",
      icon: <UserPlus className="text-green-600" />,
      content: <ProfileCodeContent />,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?si=placeholder1"
    },
    {
      id: StepId.PIN_VENDING,
      title: "2. Pin Vending (Payment)",
      description: "Purchase your registration e-PIN via approved channels.",
      icon: <CreditCard className="text-green-600" />,
      content: <PinVendingContent />,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?si=placeholder2"
    },
    {
      id: StepId.REGISTRATION,
      title: "3. JAMB Registration Process",
      description: "Visit a CBT center to complete your data capture.",
      icon: <CheckCircle2 className="text-green-600" />,
      content: <RegistrationProcessContent />,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?si=placeholder3"
    }
  ];

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    const msg = chatMessage;
    setChatMessage("");
    setChatHistory(prev => [...prev, { role: 'user', text: msg }]);
    setIsTyping(true);
    
    const response = await getJambAdvice(msg);
    setIsTyping(false);
    setChatHistory(prev => [...prev, { role: 'bot', text: response || "I couldn't process that. Try again." }]);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-green-700 text-white py-8 px-4 shadow-lg sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">JAMB 2026 GUIDE</h1>
            <p className="text-green-100 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Registration Portal Helper
            </p>
          </div>
          <button 
            onClick={() => setShowPwaGuide(true)}
            className="hidden md:flex items-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            <Smartphone size={18} />
            Install App
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar scroll-smooth">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex-shrink-0 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeStep === step.id 
                ? 'bg-green-700 text-white shadow-md transform scale-105' 
                : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              {activeStep === step.id && <ChevronRight size={16} />}
              {step.title.split('.')[0]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {steps.map((step) => (
              activeStep === step.id && (
                <div key={step.id} className="animate-fadeIn">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-green-100 rounded-2xl">
                      {React.cloneElement(step.icon as React.ReactElement<any>, { size: 32 })}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{step.title}</h2>
                      <p className="text-gray-500">{step.description}</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => setShowVideo(step.videoUrl)}
                    className="group relative h-48 md:h-64 rounded-2xl overflow-hidden cursor-pointer mb-8 shadow-inner bg-gray-900"
                  >
                    <img 
                      src={`https://picsum.photos/seed/${step.id}/800/400`} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" 
                      alt="Tutorial Thumbnail"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <Play fill="white" size={32} className="ml-1" />
                      </div>
                      <p className="mt-4 font-bold tracking-widest uppercase text-sm">Watch Video Guide</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    {step.content}
                  </div>
                </div>
              )
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <h3 className="font-bold text-green-800 flex items-center gap-2 mb-4">
                <Info size={20} />
                Quick Requirements
              </h3>
              <ul className="space-y-3 text-sm text-green-900">
                <li className="flex items-start gap-2">
                  <div className="mt-1"><CheckCircle2 size={14} /></div>
                  Valid National Identity Number (NIN)
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1"><CheckCircle2 size={14} /></div>
                  A personal mobile phone number
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1"><CheckCircle2 size={14} /></div>
                  Active email address
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-2">Important Dates</h3>
              <p className="text-xs text-gray-500 mb-4">Official 2026 tentative schedule</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm font-medium">Registration Starts</span>
                  <span className="text-sm text-green-700 font-bold">Jan 2026</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm font-medium">Registration Ends</span>
                  <span className="text-sm text-red-600 font-bold">Feb 2026</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Main Exam</span>
                  <span className="text-sm text-gray-800 font-bold">April 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
            <button 
              onClick={() => setShowVideo(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
            >
              <X size={24} />
            </button>
            <iframe 
              className="w-full h-full"
              src={showVideo}
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {showPwaGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
            <button onClick={() => setShowPwaGuide(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-3xl mb-6">
                <Smartphone size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Get the App</h2>
              <p className="text-gray-600 mb-8">Install this guide directly from your browser to access it anytime!</p>
              
              <div className="space-y-4 text-left">
                <div className="p-4 bg-gray-50 rounded-2xl flex gap-4">
                  <div className="bg-white p-2 rounded-xl shadow-sm text-green-600 font-bold">1</div>
                  <p className="text-sm text-gray-700">Open this site in Chrome (Android) or Safari (iOS).</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl flex gap-4">
                  <div className="bg-white p-2 rounded-xl shadow-sm text-green-600 font-bold">2</div>
                  <p className="text-sm text-gray-700">Tap the <span className="font-bold underline">Menu</span> or <span className="font-bold underline">Share</span> button.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl flex gap-4">
                  <div className="bg-white p-2 rounded-xl shadow-sm text-green-600 font-bold">3</div>
                  <p className="text-sm text-gray-700">Select <span className="font-bold underline">"Add to Home Screen"</span>.</p>
                </div>
              </div>

              <button 
                onClick={() => setShowPwaGuide(false)}
                className="mt-8 w-full bg-green-700 text-white py-4 rounded-2xl font-bold hover:bg-green-800 transition-colors shadow-lg shadow-green-200"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-40">
        {!chatOpen ? (
          <button 
            onClick={() => setChatOpen(true)}
            className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
          >
            <MessageCircle size={28} />
          </button>
        ) : (
          <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[500px] animate-slideUp">
            <div className="bg-green-700 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <HelpCircle size={20} />
                <span className="font-bold">JAMB Assistant</span>
              </div>
              <button onClick={() => setChatOpen(false)}><X size={20} /></button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 min-h-[300px]">
              {chatHistory.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">Ask me anything about JAMB 2026!</p>
                </div>
              )}
              {chatHistory.map((chat, idx) => (
                <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    chat.role === 'user' 
                    ? 'bg-green-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                  }`}>
                    {chat.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl text-xs text-gray-400 italic">Thinking...</div>
                </div>
              )}
            </div>

            <div className="p-3 bg-white border-t flex gap-2">
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default App;
