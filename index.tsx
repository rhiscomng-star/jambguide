import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import { GoogleGenAI } from "@google/genai";
import {
  CheckCircle2,
  CreditCard,
  UserPlus,
  Play,
  X,
  Smartphone,
  Info,
  MessageCircle,
  HelpCircle,
  Download,
  Send,
} from "lucide-react";

// --- Types & Constants ---
enum StepId {
  PROFILE_CODE = "profile-code",
  PIN_VENDING = "pin-vending",
  REGISTRATION = "registration",
}

// --- AI Service ---
const getJambAdvice = async (userQuery: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User asks: ${userQuery}. Provide a helpful, encouraging, and accurate answer regarding JAMB 2026 registration procedures in Nigeria. Focus on NIN requirements, SMS codes (55019/66019), and CBT center procedures. Keep the tone professional and supportive.`,
      config: {
        systemInstruction:
          "You are an expert JAMB (Joint Admissions and Matriculation Board) consultant. You help Nigerian students navigate the registration process. Do not mention specific prices as they vary. Always emphasize using the correct NIN and active mobile numbers.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the JAMB help database. Please ensure your internet is active and try again.";
  }
};

// --- Main App Component ---
const App: React.FC = () => {
  const [activeStep, setActiveStep] = useState<StepId>(StepId.PROFILE_CODE);
  const [showVideo, setShowVideo] = useState<string | null>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "bot"; text: string }[]
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  // PWA/SW Registration
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .catch((err) => console.log("SW failed", err));
      });
    }
  }, []);

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    const msg = chatMessage;
    setChatMessage("");
    setChatHistory((prev) => [...prev, { role: "user", text: msg }]);
    setIsTyping(true);
    const response = await getJambAdvice(msg);
    setIsTyping(false);
    setChatHistory((prev) => [...prev, { role: "bot", text: response }]);
  };

  const steps = [
    {
      id: StepId.PROFILE_CODE,
      title: "1. Profile Code",
      description: "Generate your 10-character code using NIN.",
      icon: <UserPlus />,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      content: (
        <div className="space-y-4 animate-fadeIn">
          <p className="text-gray-700">
            The profile code is your unique identifier for the entire JAMB
            season.
          </p>
          <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
            <h4 className="font-bold text-green-800 flex items-center gap-2 mb-2">
              <Smartphone size={18} /> SMS Method
            </h4>
            <div className="bg-white p-4 rounded-xl border border-dashed border-green-300 font-mono text-center">
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-widest">
                Type and Send to 55019 or 66019
              </p>
              <p className="text-xl font-bold text-green-700">
                NIN 12345678901
              </p>
            </div>
          </div>
          <div className="bg-white p-4 border border-gray-100 rounded-2xl shadow-sm">
            <h4 className="font-bold text-gray-800 mb-2">Requirements:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span>•</span> <span>One NIN per profile code.</span>
              </li>
              <li className="flex gap-2">
                <span>•</span> <span>Active mobile number (SIM card).</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>{" "}
                <span>Airtime for SMS charges (Standard rates apply).</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: StepId.PIN_VENDING,
      title: "2. Pin Vending",
      description: "Secure your registration e-PIN.",
      icon: <CreditCard />,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      content: (
        <div className="space-y-4 animate-fadeIn">
          <p className="text-gray-700">
            Once you have your profile code, purchase the e-PIN to unlock the
            registration portal.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 border border-gray-100 rounded-2xl bg-white hover:border-green-500 transition-all group">
              <h5 className="font-bold group-hover:text-green-700">
                Online Channels
              </h5>
              <p className="text-xs text-gray-500">
                Remita, Interswitch, Paga, or Quickteller.
              </p>
            </div>
            <div className="p-4 border border-gray-100 rounded-2xl bg-white hover:border-green-500 transition-all group">
              <h5 className="font-bold group-hover:text-green-700">
                Commercial Banks
              </h5>
              <p className="text-xs text-gray-500">
                FirstBank, Zenith, GTB, Union Bank, etc.
              </p>
            </div>
          </div>
          <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 italic">
            * Ensure the profile code you provide at the point of payment is
            100% correct.
          </p>
        </div>
      ),
    },
    {
      id: StepId.REGISTRATION,
      title: "3. Final Registration",
      description: "Visit a center for biometric capture.",
      icon: <CheckCircle2 />,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      content: (
        <div className="space-y-4 animate-fadeIn">
          <p className="text-gray-700">
            Complete your registration at any{" "}
            <strong>Accredited JAMB CBT Center</strong> nationwide.
          </p>
          <div className="space-y-3">
            {[
              "Biometric capture (10 fingerprints and facial image)",
              "Upload O'Level results (if available)",
              "Select 4 UTME subjects (Use JAMB syllabus)",
              "Print the official Registration Slip",
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex gap-3 items-center bg-white p-4 rounded-xl border border-gray-50 shadow-sm"
              >
                <div className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </div>
                <p className="text-sm text-gray-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-green-100 selection:text-green-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center text-white shadow-lg">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-gray-900">
                JAMB 2026
              </h1>
              <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest leading-none">
                Registration Guide
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInstallGuide(true)}
            className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-green-800 transition-all shadow-md active:scale-95"
          >
            <Download size={14} />
            <span className="md:inline hidden">Install App (APK)</span>
            <span className="md:hidden inline">Install</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeStep === step.id
                  ? "bg-green-700 text-white shadow-lg scale-105"
                  : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
              }`}
            >
              {step.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Step Detail Area */}
          <div className="lg:col-span-8 space-y-8">
            {steps.map(
              (step) =>
                activeStep === step.id && (
                  <div key={step.id} className="animate-fadeIn">
                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5 text-green-700">
                        {/* Fix: Explicitly cast to ReactElement<any> to resolve type error regarding 'size' prop */}
                        {React.cloneElement(
                          step.icon as React.ReactElement<any>,
                          { size: 120 }
                        )}
                      </div>

                      <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-2 text-gray-900">
                          {step.title}
                        </h2>
                        <p className="text-gray-500 mb-8 font-medium">
                          {step.description}
                        </p>

                        {/* Video Player Mockup */}
                        <div
                          onClick={() => setShowVideo(step.videoUrl)}
                          className="aspect-video w-full rounded-3xl bg-gray-900 mb-8 relative cursor-pointer group shadow-2xl overflow-hidden"
                        >
                          <img
                            src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200`}
                            className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                            alt="Video Background"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 bg-green-700 rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                              <Play fill="white" size={32} />
                            </div>
                          </div>
                          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-white text-xs font-bold uppercase tracking-widest opacity-80">
                            <span>Video Tutorial</span>
                            <span>4:20 min</span>
                          </div>
                        </div>

                        <div className="prose max-w-none">{step.content}</div>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                <Info size={20} className="text-green-700" />
                Quick Checklist
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Correct NIN", sub: "Matches your birth cert" },
                  { label: "Active Email", sub: "For profile login" },
                  { label: "Unique SIM Card", sub: "Not used by others" },
                  { label: "JAMB Syllabus", sub: "Subject combinations" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 items-start p-3 bg-gray-50 rounded-2xl"
                  >
                    <div className="w-5 h-5 mt-1 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={12} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-gray-500 font-medium">
                        {item.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-700 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
              <h3 className="text-lg font-black mb-2 relative z-10">
                Need Help?
              </h3>
              <p className="text-xs text-green-100 mb-6 font-medium relative z-10">
                Our AI Assistant is available 24/7 to guide you through
                registration issues.
              </p>
              <button
                onClick={() => setChatOpen(true)}
                className="w-full bg-white text-green-700 py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-green-50 transition-colors relative z-10"
              >
                Start Chatting
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chat UI */}
      {!chatOpen ? (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-green-700 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 group"
        >
          <MessageCircle size={28} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
        </button>
      ) : (
        <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-96 bg-white md:rounded-[2rem] shadow-2xl z-50 flex flex-col max-h-[100dvh] md:max-h-[600px] border border-gray-100 animate-slideUp overflow-hidden">
          <div className="bg-green-700 p-5 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <HelpCircle size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm">JAMB AI Consultant</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-bold text-green-100 uppercase tracking-widest">
                    Online
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 h-[400px]">
            {chatHistory.length === 0 && (
              <div className="text-center py-12 px-6">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={32} />
                </div>
                <h5 className="font-bold text-gray-800 mb-1">
                  Hello Future Candidate!
                </h5>
                <p className="text-xs text-gray-500 font-medium">
                  Ask me anything about NIN, Profile Codes, or CBT Centers.
                </p>
              </div>
            )}
            {chatHistory.map((chat, idx) => (
              <div
                key={idx}
                className={`flex ${
                  chat.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-3xl text-sm shadow-sm ${
                    chat.role === "user"
                      ? "bg-green-700 text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                  }`}
                >
                  {chat.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border p-4 rounded-3xl flex gap-1.5 shadow-sm">
                  <div className="w-2 h-2 bg-green-200 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-200 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-green-200 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
            <input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask a question..."
              className="flex-1 bg-gray-100 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-green-700 transition-all font-medium"
            />
            <button
              onClick={handleSendMessage}
              disabled={!chatMessage.trim() || isTyping}
              className="bg-green-700 text-white p-3 rounded-2xl shadow-lg hover:bg-green-800 transition-all disabled:opacity-50 disabled:scale-100 active:scale-90"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20">
            <button
              onClick={() => setShowVideo(null)}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all"
            >
              <X size={24} />
            </button>
            <iframe
              className="w-full h-full"
              src={showVideo}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Install Guide Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative text-center">
            <button
              onClick={() => setShowInstallGuide(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <div className="w-24 h-24 bg-green-100 text-green-700 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Download size={48} />
            </div>
            <h2 className="text-2xl font-black mb-2">Get the App</h2>
            <p className="text-gray-500 text-sm mb-8 font-medium">
              Install this guide to your device for offline access and faster
              updates.
            </p>

            <div className="space-y-4 text-left mb-8">
              {[
                { s: "1", t: "Open in Chrome/Safari on your phone." },
                { s: "2", t: "Tap the browser's menu (⋮) or share icon." },
                { s: "3", t: "Select 'Add to Home Screen' or 'Install'." },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100"
                >
                  <div className="w-8 h-8 bg-green-700 text-white text-xs font-black flex items-center justify-center rounded-xl">
                    {item.s}
                  </div>
                  <p className="text-sm font-bold text-gray-700">{item.t}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowInstallGuide(false)}
              className="w-full bg-green-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-200 hover:bg-green-800 transition-all active:scale-95"
            >
              Close and Continue
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(100px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
