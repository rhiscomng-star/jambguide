
import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

// Component for listing accredited CBT centers by state
export const CenterList = () => {
  const [selectedState, setSelectedState] = useState("");
  const [loading, setLoading] = useState(false);
  const [centers, setCenters] = useState<any[]>([]);

  const states = ["Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"];

  const handleSearch = () => {
    if (!selectedState) return;
    setLoading(true);
    setTimeout(() => {
      setCenters([
        { name: `${selectedState} CBT Center A`, address: "123 Education Way, Capital City", town: "Main Town" },
        { name: `${selectedState} Digital Hub`, address: "Block B, State Polytechnic", town: "North Wing" },
      ]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-2">
        <select 
          className="flex-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="">Select State</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button 
          onClick={handleSearch}
          disabled={loading || !selectedState}
          className="bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
          Find Centers
        </button>
      </div>
      <div className="space-y-4">
        {centers.map((c, i) => (
          <div key={i} className="p-4 bg-white border rounded-xl shadow-sm">
            <h4 className="font-bold text-gray-800">{c.name}</h4>
            <p className="text-sm text-gray-600">{c.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
