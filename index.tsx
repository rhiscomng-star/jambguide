import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import { GoogleGenAI } from "@google/genai";
import {
  CheckCircle2,
  CreditCard,
  UserPlus,
  X,
  Smartphone,
  MessageCircle,
  Send,
  User,
  Bell,
  Scan,
  ShieldCheck,
  Headphones,
  FileText,
  MapPin,
  Fingerprint,
  UploadCloud,
  Printer,
  ChevronRight,
  Info,
  Calendar,
  Play,
  ClipboardList,
  Navigation,
  Loader2,
  ExternalLink,
} from "lucide-react";

// --- Data Structures ---
interface Step {
  id: number;
  title: string;
  shortLabel: string;
  description: string;
  icon: React.ElementType;
  color: string;
  details: React.ReactNode;
}

const REG_STEPS: Step[] = [
  {
    id: 1,
    title: "NIMC Registration",
    shortLabel: "NIN",
    description: "National Identity Number Registration",
    icon: UserPlus,
    color: "text-blue-600",
    details: (
      <div className="space-y-4">
        <p>
          The first requirement for JAMB registration is a valid{" "}
          <strong>National Identity Number (NIN)</strong>.
        </p>

        <div className="space-y-3 bg-gray-50 p-5 rounded-2xl border border-gray-100">
          <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Info size={16} className="text-blue-600" />
            How to Obtain your NIN:
          </h4>
          <ol className="list-decimal ml-5 space-y-3 text-sm text-gray-600">
            <li>
              <strong>Locate a Center:</strong> Visit the nearest NIMC
              enrollment center. These are found at NIMC offices, major bank
              branches, or Local Government Secretariats.
            </li>
            <li>
              <strong>Prepare Documents:</strong> Bring one valid supporting
              document such as your <strong>Birth Certificate</strong>,{" "}
              <strong>School ID Card</strong>, or{" "}
              <strong>LGA Identification Letter</strong>.
            </li>
            <li>
              <strong>Complete Enrollment:</strong> Fill the enrollment form and
              undergo biometric capture (all 10 fingerprints and a digital
              headshot).
            </li>
            <li>
              <strong>Tracking Slip:</strong> You will be issued an{" "}
              <strong>NIN Tracking Slip</strong> immediately after enrollment.
            </li>
            <li>
              <strong>Retrieval:</strong> Your NIN is usually ready within 1-5
              working days. If you have enrolled before but lost it, simply dial{" "}
              <a className="font-bold text-blue-700" href="tel:*346#">
                *346#
              </a>{" "}
              from your registered number.
            </li>
          </ol>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600 mt-2">
          <p className="text-xs text-blue-800 font-semibold italic">
            Important: Ensure the name and date of birth on your NIN match your
            school records exactly to avoid profile discrepancies.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "GSM Line Setup",
    shortLabel: "SIM",
    description: "New SIM card for Registration",
    icon: Smartphone,
    color: "text-orange-600",
    details: (
      <div className="space-y-4">
        <p>
          You need a personal mobile number that has{" "}
          <strong>never been used</strong> for a previous JAMB registration.
        </p>
        <ul className="list-disc ml-5 space-y-2 text-sm text-gray-600">
          <li>One SIM can only be used by one candidate.</li>
          <li>
            Ensure the SIM is registered in your name or a close relative's
            name.
          </li>
          <li>
            Keep this SIM active; all JAMB communications will come through it.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 3,
    title: "Profile Code Generation",
    shortLabel: "Profile",
    description: "Generate 10-character code",
    icon: ShieldCheck,
    color: "text-indigo-600",
    details: (
      <div className="space-y-4">
        <p>
          Generate your unique Profile Code by sending an SMS from your
          registered SIM.
        </p>
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
          <p className="text-sm font-bold text-indigo-800">SMS Format:</p>
          <p className="text-lg font-mono bg-white p-2 rounded mt-2 border border-indigo-200">
            NIN 12345678901
          </p>
          <p className="text-xs text-indigo-600 mt-2">
            Send to <strong>55019</strong> or <strong>66019</strong>
          </p>
        </div>
        <p className="text-xs text-gray-500 italic">
          * Ensure you have sufficient airtime for SMS service charges.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    title: "Form Purchase (ePIN)",
    shortLabel: "ePIN",
    description: "Buy Registration ePIN",
    icon: CreditCard,
    color: "text-green-600",
    details: (
      <div className="space-y-4">
        <p>
          Purchase your UTME/DE registration ePIN using your 10-character
          Profile Code.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 border rounded-lg bg-white">
            <p className="font-bold text-sm">Online Channels</p>
            <p className="text-xs text-gray-500">Remita, OPay, Interswitch</p>
          </div>
          <div className="p-3 border rounded-lg bg-white">
            <p className="font-bold text-sm">Bank Branches</p>
            <p className="text-xs text-gray-500">
              FirstBank, GTB, Zenith, etc.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: "Find Accredited Center",
    shortLabel: "CBT",
    description: "Locate JAMB CBT Center",
    icon: MapPin,
    color: "text-purple-600",
    details: (
      <div className="space-y-4">
        <p>
          Only register at <strong>Accredited JAMB CBT Centers</strong>. Do not
          use cyber cafes.
        </p>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800 flex gap-2">
            <Info size={16} className="shrink-0" />
            Registration at unaccredited centers will be invalidated.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: "Registration Template",
    shortLabel: "Form",
    description: "Fill the Offline Template",
    icon: FileText,
    color: "text-pink-600",
    details: (
      <div className="space-y-4">
        <p>
          Complete the JAMB registration template offline to avoid mistakes
          during data entry at the center.
        </p>
        <ul className="list-disc ml-5 space-y-2 text-sm text-gray-600">
          <li>Check correct spelling of names.</li>
          <li>Verify your date of birth.</li>
          <li>Choose your preferred institutions and courses.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 7,
    title: "Biometric Capture",
    shortLabel: "Finger",
    description: "10-Fingerprint Capture",
    icon: Fingerprint,
    color: "text-red-600",
    details: (
      <div className="space-y-4">
        <p>
          Present yourself for biometric capture at the CBT center. Facial
          recognition is also required.
        </p>
        <div className="bg-red-50 p-3 rounded text-xs text-red-700 font-medium">
          Note: If your fingerprints cannot be captured, you will be scheduled
          for a special "No-Biometric" exam.
        </div>
      </div>
    ),
  },
  {
    id: 8,
    title: "Document Upload",
    shortLabel: "Upload",
    description: "Scan and Upload Results",
    icon: UploadCloud,
    color: "text-cyan-600",
    details: (
      <div className="space-y-4">
        <p>
          Scan and upload your O'Level (WAEC/NECO/NABTEB) results to the JAMB
          portal.
        </p>
        <p className="text-sm text-gray-600">
          If you are using Awaiting Result (AR), you must upload it as soon as
          it is released to be eligible for admission.
        </p>
      </div>
    ),
  },
  {
    id: 9,
    title: "Confirmation & Review",
    shortLabel: "Review",
    description: "Verify all Entered Data",
    icon: CheckCircle2,
    color: "text-teal-600",
    details: (
      <div className="space-y-4">
        <p>
          Review the details on the screen before final submission. Confirm with
          your thumbprint.
        </p>
        <p className="text-sm font-bold text-red-600 uppercase tracking-tighter">
          Errors corrected after submission will attract a correction fee.
        </p>
      </div>
    ),
  },
  {
    id: 10,
    title: "Collect Slip & Book",
    shortLabel: "Slip",
    description: "Final Printout & Novel",
    icon: Printer,
    color: "text-gray-800",
    details: (
      <div className="space-y-4">
        <p>
          Collect your <strong>Registration Slip</strong> and the recommended{" "}
          <strong>Literature Novel</strong>.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm font-bold">Registration Slip Contains:</p>
          <ul className="text-xs space-y-1 mt-2 list-inside list-disc">
            <li>Registration Number</li>
            <li>UTME Subject Combination</li>
            <li>Exam Date & Venue (To be printed later)</li>
          </ul>
        </div>
      </div>
    ),
  },
];

const App: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "bot"; text: string }[]
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const [locating, setLocating] = useState(false);
  const [nearbyCenters, setNearbyCenters] = useState<
    { title: string; uri?: string }[]
  >([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("jamb_v2_progress");
    if (saved) setCompletedSteps(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("jamb_v2_progress", JSON.stringify(completedSteps));
  }, [completedSteps]);

  useEffect(() => {
    if (chatOpen) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping, chatOpen]);

  const toggleComplete = (id: number) => {
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleNearbyCenters = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents:
              "Find and list the nearest accredited JAMB CBT registration centers to my current location in Nigeria.",
            config: {
              tools: [{ googleMaps: {} }],
              toolConfig: {
                retrievalConfig: {
                  latLng: { latitude, longitude },
                },
              },
            },
          });

          const chunks =
            response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
          const extractedCenters = chunks
            .filter((chunk) => chunk.maps)
            .map((chunk) => ({
              title: chunk.maps?.title || "Center",
              uri: chunk.maps?.uri,
            }));

          setNearbyCenters(extractedCenters);
        } catch (error) {
          console.error("Maps grounding error:", error);
          alert("Failed to find centers using Maps. Please try again.");
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        console.error(error);
        setLocating(false);
        alert("Unable to retrieve your location.");
      }
    );
  };

  const activeStep = REG_STEPS.find((s) => s.id === activeStepId)!;

  const handleSupport = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput("");
    setChatHistory((prev) => [...prev, { role: "user", text: msg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: msg,
        config: {
          systemInstruction:
            "You are a professional JAMB Registration Assistant. Provide clear, accurate, and helpful advice for Nigerian students registering for the 2026 UTME. Use simple language and keep responses concise.",
        },
      });
      setIsTyping(false);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            response.text || "I'm sorry, I couldn't get a response. Try again.",
        },
      ]);
    } catch (e) {
      setIsTyping(false);
      setChatHistory((prev) => [
        ...prev,
        { role: "bot", text: "Network error. Please try again later." },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navigation / Header */}
      <header className="bg-green-700 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg text-green-700">
              <ClipboardList size={24} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight uppercase">
                JAMB 2026 Guide
              </h1>
              <p className="text-[10px] text-green-100 font-bold uppercase tracking-widest opacity-80">
                Official Step-by-Step Portal
              </p>
            </div>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-bold uppercase tracking-tighter">
            <button
              onClick={() => setActiveStepId(1)}
              className="hover:text-green-200 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => setActiveStepId(5)}
              className="hover:text-green-200 transition-colors"
            >
              Centers
            </button>
            <button
              onClick={() => setChatOpen(true)}
              className="hover:text-green-200 transition-colors"
            >
              Help
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Horizontal Progress Bar / Step Switcher */}
        <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth mb-10">
          {REG_STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStepId(step.id)}
              className={`flex-shrink-0 px-5 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-2 border-2 ${
                activeStepId === step.id
                  ? "bg-green-700 text-white border-green-700 shadow-lg scale-105"
                  : "bg-white text-gray-500 border-gray-100 hover:border-green-200 hover:bg-green-50"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  activeStepId === step.id
                    ? "bg-white text-green-700"
                    : "bg-gray-100"
                }`}
              >
                {completedSteps.includes(step.id) ? (
                  <CheckCircle2 size={12} strokeWidth={3} />
                ) : (
                  step.id
                )}
              </div>
              {step.shortLabel}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Active Step Display */}
          <div className="lg:col-span-8 space-y-8 animate-fadeIn">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-5 mb-8">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-50 ${activeStep.color} border border-gray-100`}
                >
                  <activeStep.icon size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 leading-none mb-1">
                    Step {activeStep.id}: {activeStep.title}
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">
                    {activeStep.description}
                  </p>
                </div>
              </div>

              {/* Tutorial Media Placeholder */}
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-900 mb-8 shadow-inner group cursor-pointer">
                <img
                  src={`https://blocks.astratic.com/img/general-img-landscape.png`}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  alt="Step Tutorial"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play fill="white" size={28} className="ml-1" />
                  </div>
                  <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em]">
                    Watch Guide Video
                  </p>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700">
                {activeStep.details}
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleComplete(activeStep.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                      completedSteps.includes(activeStep.id)
                        ? "bg-green-100 text-green-700"
                        : "bg-green-700 text-white shadow-lg shadow-green-100"
                    }`}
                  >
                    <CheckCircle2 size={18} />
                    {completedSteps.includes(activeStep.id)
                      ? "Completed"
                      : "Mark as Done"}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={activeStepId === 1}
                    onClick={() => setActiveStepId((prev) => prev - 1)}
                    className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 disabled:opacity-30"
                  >
                    <ChevronRight size={20} className="rotate-180" />
                  </button>
                  <button
                    disabled={activeStepId === 10}
                    onClick={() => setActiveStepId((prev) => prev + 1)}
                    className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 disabled:opacity-30"
                  >
                    Next Step
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Checklist View */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">
                Your Progress Checklist
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {REG_STEPS.map((step) => (
                  <div
                    key={step.id}
                    onClick={() => setActiveStepId(step.id)}
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      activeStepId === step.id
                        ? "border-green-600 bg-green-50/30"
                        : "border-gray-50 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          completedSteps.includes(step.id)
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-300"
                        }`}
                      >
                        <CheckCircle2
                          size={16}
                          strokeWidth={completedSteps.includes(step.id) ? 3 : 2}
                        />
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          completedSteps.includes(step.id)
                            ? "text-gray-400 line-through"
                            : "text-gray-700"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Info */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Nearest Center Search */}
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-black text-gray-900 mb-4">
                <MapPin size={18} className="text-green-600" />
                Find Nearby Center
              </h3>
              <p className="text-[11px] text-gray-500 mb-4 font-medium leading-relaxed">
                Click below to detect your location and find the closest
                accredited JAMB CBT centers for registration.
              </p>
              <button
                onClick={handleNearbyCenters}
                disabled={locating}
                className="w-full bg-green-50 text-green-700 py-3 rounded-xl text-xs font-bold hover:bg-green-100 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {locating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Navigation size={16} />
                )}
                {locating ? "LOCATING..." : "FIND CENTERS NEAR ME"}
              </button>

              {nearbyCenters.length > 0 && (
                <div className="mt-6 space-y-3 animate-fadeIn">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Found Centers:
                  </p>
                  {nearbyCenters.map((center, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between group"
                    >
                      <span className="text-[11px] font-bold text-gray-700 line-clamp-1">
                        {center.title}
                      </span>
                      {center.uri && (
                        <a
                          href={center.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Requirements */}
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-black text-gray-900 mb-6">
                <Info size={18} className="text-green-600" />
                Quick Requirements
              </h3>
              <ul className="space-y-4">
                {[
                  "Valid National Identity Number (NIN)",
                  "Personal mobile phone number",
                  "Active email address",
                  "Scanned O'Level results",
                  "Funds for ePIN & Center fees",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-[11px] font-bold text-gray-600 leading-relaxed"
                  >
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Dates */}
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-black text-gray-900 mb-6">
                <Calendar size={18} className="text-green-600" />
                2026 Schedule
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Registration Starts",
                    date: "January 2026",
                    color: "text-green-600",
                  },
                  {
                    label: "Registration Ends",
                    date: "February 2026",
                    color: "text-red-500",
                  },
                  {
                    label: "Main UTME Exam",
                    date: "April 2026",
                    color: "text-gray-900",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                      {item.label}
                    </span>
                    <span className={`text-xs font-black ${item.color}`}>
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 font-medium mt-6 italic">
                * Dates are tentative and subject to official JAMB announcement.
              </p>
            </div>

            {/* AI Advisor Banner */}
            <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-[2rem] p-6 text-white shadow-xl shadow-green-100 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-black leading-tight mb-2">
                  Need Help with NIN or Portal Issues?
                </h3>
                <p className="text-[10px] opacity-70 font-medium mb-4">
                  Talk to our Gemini-powered JAMB Advisor for instant answers.
                </p>
                <button
                  onClick={() => setChatOpen(true)}
                  className="bg-white text-green-800 px-5 py-2.5 rounded-xl text-xs font-black active:scale-95 transition-all"
                >
                  START CHATTING
                </button>
              </div>
              <Headphones className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10" />
            </div>
          </aside>
        </div>
      </main>

      {/* Floating Chat UI */}
      {!chatOpen ? (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-green-700 text-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform z-40"
        >
          <MessageCircle size={24} />
        </button>
      ) : (
        <div className="fixed bottom-6 right-6 w-full max-w-[360px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col z-50 animate-slideUp overflow-hidden max-h-[500px]">
          <div className="bg-green-700 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Headphones size={20} />
              <span className="font-black text-sm uppercase tracking-wider">
                JAMB Advisor AI
              </span>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-gray-50 min-h-[300px]">
            {chatHistory.length === 0 && (
              <div className="text-center py-10 opacity-50">
                <MessageCircle size={32} className="mx-auto mb-3" />
                <p className="text-xs font-bold uppercase tracking-widest">
                  Ask me anything about JAMB
                </p>
              </div>
            )}
            {chatHistory.map((chat, idx) => (
              <div
                key={idx}
                className={`flex ${
                  chat.role === "user" ? "justify-end" : "justify-start"
                } animate-fadeIn`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    chat.role === "user"
                      ? "bg-green-700 text-white rounded-tr-none shadow-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-tl-none font-medium"
                  }`}
                >
                  {chat.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl flex gap-1 shadow-sm border border-gray-100">
                  <div className="w-1 h-1 bg-green-600 rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-green-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1 h-1 bg-green-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSupport()}
              placeholder="Type your question..."
              className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-700/20 transition-all font-medium"
            />
            <button
              onClick={handleSupport}
              disabled={!chatInput.trim()}
              className="bg-green-700 text-white p-3 rounded-xl disabled:opacity-30 active:scale-90 transition-transform"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-sm font-black text-gray-900 uppercase mb-2">
              JAMB 2026 Guide
            </h4>
            <p className="text-[10px] text-gray-400 font-medium">
              An independent educational helper for Nigerian UTME candidates.
            </p>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            © 2026 Candidate Portal
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        body { overflow-x: hidden; }
      `}</style>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
