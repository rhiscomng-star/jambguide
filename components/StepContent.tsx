
import React from 'react';

// Profile Code step content component
export const ProfileCodeContent = () => (
  <div className="space-y-4">
    <p className="text-gray-700">The first step to JAMB registration is generating your unique 10-character profile code using your NIN.</p>
    <div className="bg-green-50 p-4 border-l-4 border-green-600 rounded">
      <h4 className="font-bold text-green-800">Method 1: SMS</h4>
      <p className="text-sm">Send "NIN [space] YourNINNumber" to <strong>55019</strong> or <strong>66019</strong>.</p>
      <p className="mt-2 text-xs italic text-green-700">* Example: NIN 12345678901</p>
    </div>
    <div className="bg-white p-4 border border-gray-200 rounded shadow-sm">
      <h4 className="font-bold text-gray-800">Requirements:</h4>
      <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
        <li>A unique mobile number (must not have been used by another candidate).</li>
        <li>Correct NIN details matching your birth certificate.</li>
        <li>Ensure you have airtime for service provider SMS charges.</li>
      </ul>
    </div>
  </div>
);

// PIN Vending step content component
export const PinVendingContent = () => (
  <div className="space-y-4">
    <p className="text-gray-700">Once you have your profile code, you must purchase the JAMB e-PIN.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-3 border rounded-lg bg-white hover:border-green-500 transition-colors">
        <h5 className="font-semibold">Online Payment</h5>
        <p className="text-xs text-gray-500">Remita, Interswitch, or Unified Payment.</p>
      </div>
      <div className="p-3 border rounded-lg bg-white hover:border-green-500 transition-colors">
        <h5 className="font-semibold">Banks</h5>
        <p className="text-xs text-gray-500">FirstBank, Zenith, GTB, etc.</p>
      </div>
    </div>
    <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-sm">
      <strong>Pro Tip:</strong> Check your profile code carefully before making payment to avoid "Invalid Profile Code" errors.
    </div>
  </div>
);

// Registration Process step content component
export const RegistrationProcessContent = () => (
  <div className="space-y-4">
    <p className="text-gray-700">The final registration must be done at an <strong>Accredited CBT Center</strong>.</p>
    <ol className="list-decimal ml-5 space-y-3 text-sm text-gray-600">
      <li>Present your e-PIN and Profile Code at the center.</li>
      <li>Capture your Biometrics (Fingerprints and Facial recognition).</li>
      <li>Fill out your personal details, choice of institutions, and UTME subjects.</li>
      <li>Collect your Registration Slip and recommended Literature book.</li>
    </ol>
  </div>
);
