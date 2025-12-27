
import { Step } from './types';

export const REGISTRATION_STEPS: Step[] = [
  {
    id: 1,
    title: "Obtain your NIN",
    shortDesc: "The National Identification Number is mandatory for JAMB registration.",
    icon: "🆔",
    color: "bg-emerald-700",
    videoPrompt: "A high-quality 3D animation of a Nigerian National Identity Card (NIN) rotating slowly with glowing security features, professional lighting, cinematic style.",
    detailedContent: [
      "Every candidate must have a National Identification Number (NIN).",
      "If you don't have one, visit the nearest NIMC enrollment center.",
      "Ensure the phone number used for NIN is the same one you'll use for JAMB."
    ],
    checklist: [
      "Confirm NIN is active",
      "Ensure name on NIN matches your certificates",
      "Have a functional phone number"
    ],
    tips: [
      "Start this early as NIN issues can take weeks to resolve.",
      "Check your NIN details by dialing *346#."
    ]
  },
  {
    id: 2,
    title: "Profile Creation",
    shortDesc: "Generate your unique 10-digit profile code via SMS.",
    icon: "📱",
    color: "bg-emerald-600",
    videoPrompt: "A close-up shot of a modern smartphone screen showing an SMS message being sent to 55019 and a profile code being received instantly, clean interface.",
    detailedContent: [
      "Send 'NIN [Your 11-digit NIN]' to 55019 or 66019 via SMS.",
      "Example: 'NIN 12345678901' to 55019.",
      "A 10-digit Profile Code will be sent to your phone number."
    ],
    checklist: [
      "At least N50 airtime on your SIM",
      "Send message from your primary number",
      "Save the 10-digit code received"
    ],
    tips: [
      "Do not use a post-paid or 'shared' phone number.",
      "One NIN, One Phone Number, One Profile Code."
    ]
  },
  {
    id: 3,
    title: "Purchase JAMB e-PIN",
    shortDesc: "Payment for the examination and registration services.",
    icon: "💳",
    color: "bg-emerald-500",
    videoPrompt: "A smooth animation of a digital wallet processing a payment, resulting in a golden e-PIN card appearing on screen with a success checkmark.",
    detailedContent: [
      "Present your Profile Code at any participating bank or vendor.",
      "You can also pay online via Remita, Quickteller, or the JAMB portal.",
      "Payment covers: Examination fee, Reading text, and CBT Center service charge."
    ],
    checklist: [
      "Select correct exam type (UTME or Direct Entry)",
      "Confirm the amount (usually around N7,700 for UTME with mock)",
      "Collect your e-PIN"
    ],
    tips: [
      "Keep your payment receipt safe until registration is fully complete.",
      "Double-check that the e-PIN is linked to your Profile Code."
    ]
  },
  {
    id: 4,
    title: "Print Registration Slip",
    shortDesc: "The final confirmation of your registration details.",
    icon: "📄",
    color: "bg-green-700",
    videoPrompt: "A cinematic 3D render of an office printer smoothly printing out a JAMB Registration Slip, paper sliding out with text and photo visible, professional environment.",
    detailedContent: [
      "Once registration is successful, the CBT center will print your slip.",
      "This slip contains your registration number, exam date (when released), and venue.",
      "Keep multiple copies of this slip."
    ],
    checklist: [
      "Check your exam subjects are correct",
      "Confirm your passport photo is visible",
      "Sign and thumbprint the hard copy"
    ],
    tips: [
      "Check your email; a copy of the slip is usually sent to you as a PDF.",
      "Start studying immediately using the syllabus provided."
    ]
  }
];
