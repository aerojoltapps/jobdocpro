
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SAMPLES = [
  {
    role: "Software Engineer",
    desc: "Modern layout for tech roles, focusing on projects and tech stack.",
    img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800",
    tag: "Recruiter's Choice"
  },
  {
    role: "Sales Executive",
    desc: "High-impact layout emphasizing targets achieved and CRM skills.",
    img: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=800",
    tag: "Best for Growth"
  },
  {
    role: "Fresher Graduate",
    desc: "Clear structure focusing on education, internships, and potential.",
    img: "https://images.unsplash.com/photo-1626197031507-c1709955b042?auto=format&fit=crop&q=80&w=800",
    tag: "Top Rated"
  },
  {
    role: "Customer Support",
    desc: "Highlights communication skills, shift flexibility, and tools.",
    img: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=800",
    tag: "Corporate Ready"
  }
];

const Gallery: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<typeof SAMPLES[0] | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Recruiter-Approved Samples</h1>
        <p className="text-xl text-gray-500">Click any resume to view a full-size preview.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {SAMPLES.map((sample, idx) => (
          <div 
            key={idx} 
            onClick={() => setSelectedSample(sample)}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative h-72 overflow-hidden">
              <img src={sample.img} alt={sample.role} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                  {sample.tag}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-white/90 text-blue-600 px-4 py-2 rounded-lg font-bold shadow-xl">View Sample</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{sample.role}</h3>
              <p className="text-gray-600 text-sm mb-4">{sample.desc}</p>
              <span className="text-blue-600 font-bold text-sm">Preview Details →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Screen Preview Modal */}
      {selectedSample && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-fadeIn" onClick={() => setSelectedSample(null)}>
          <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedSample(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center z-10"
            >
              ✕
            </button>
            <div className="flex flex-col md:flex-row max-h-[90vh]">
              <div className="md:w-1/2 overflow-y-auto bg-gray-100">
                <img src={selectedSample.img} className="w-full h-auto" alt="Full Preview" />
              </div>
              <div className="md:w-1/2 p-10 flex flex-col justify-center">
                <span className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-2">{selectedSample.tag}</span>
                <h2 className="text-3xl font-black mb-4">{selectedSample.role}</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  This template is optimized for Indian recruiters. It features high readability, professional typography, and is 100% ATS-friendly. 
                  Users who used this format for {selectedSample.role} roles saw a 40% increase in interview callbacks.
                </p>
                <Link 
                  to="/builder" 
                  className="bg-blue-600 text-white text-center py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg"
                >
                  Create My Resume Now
                </Link>
                <p className="mt-4 text-center text-gray-400 text-xs italic">Takes only 15 minutes</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-20 bg-blue-600 rounded-3xl p-10 text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">Ready to create your own?</h2>
          <p className="mb-8 text-blue-100 max-w-2xl mx-auto">Get your professional documents in less than 15 minutes. Join 1000+ Indians who used JobDocPro to land interviews.</p>
          <Link to="/builder" className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-lg inline-block">
            Start Building Now
          </Link>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Gallery;