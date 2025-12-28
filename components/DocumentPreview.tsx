
import React from 'react';
import { UserData, DocumentResult } from '../types';

interface Props {
  user: UserData;
  result: DocumentResult;
}

const DocumentPreview: React.FC<Props> = ({ user, result }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Resume Section */}
      <div className="flex justify-center no-print mb-4">
        <p className="text-gray-400 text-sm italic">Tip: Use "Save as PDF" in print settings.</p>
      </div>

      <section id="resume-preview" className="bg-white p-12 shadow-2xl border border-gray-100 max-w-[210mm] mx-auto min-h-[297mm] text-gray-900 overflow-hidden relative">
        {/* Modern Header Design */}
        <div className="text-center mb-8 border-b-2 border-gray-900 pb-6">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">{user.fullName}</h1>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm font-medium text-gray-600">
            <span>{user.email}</span>
            <span className="opacity-30">|</span>
            <span>{user.phone}</span>
            <span className="opacity-30">|</span>
            <span>{user.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="col-span-12 space-y-6">
            <div>
              <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase tracking-widest text-blue-900">Professional Summary</h2>
              <p className="text-gray-700 leading-relaxed text-[13px]">{result.resumeSummary}</p>
            </div>

            <div>
              <h2 className="text-lg font-bold border-b border-gray-300 mb-4 uppercase tracking-widest text-blue-900">Work Experience</h2>
              {user.experience.map((exp, idx) => (
                <div key={idx} className="mb-6">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-800 text-[15px]">{exp.title}</h3>
                    <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{exp.duration}</span>
                  </div>
                  <p className="font-semibold text-sm text-blue-700 mb-2">{exp.company}</p>
                  <ul className="list-disc ml-4 text-[13px] text-gray-700 space-y-1.5 leading-snug">
                    {(result.experienceBullets[idx] || []).map((bullet, bIdx) => (
                      <li key={bIdx} className="pl-1">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase tracking-widest text-blue-900">Education</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {user.education.map((edu, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-100">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-800 text-sm">{edu.degree}</h3>
                      <span className="text-[11px] font-bold text-gray-500">{edu.year}</span>
                    </div>
                    <p className="text-xs text-gray-600">{edu.college}</p>
                    <p className="text-xs font-bold text-blue-600 mt-1">Score: {edu.percentage}%</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase tracking-widest text-blue-900">Key Skills</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.skills.map((skill, idx) => (
                  <span key={idx} className="bg-white px-3 py-1 rounded text-[11px] font-bold text-gray-700 border border-gray-900/10 shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cover Letter Section - Hidden during print unless specified */}
      <section className="bg-white p-10 shadow-xl border border-gray-100 max-w-[210mm] mx-auto no-print rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
           <span className="bg-blue-100 text-blue-600 p-2 rounded-lg text-xl">📧</span>
           <h2 className="text-2xl font-bold text-gray-800">Professional Cover Letter</h2>
        </div>
        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
          <p className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed font-serif">
            {result.coverLetter}
          </p>
        </div>
      </section>

      {/* LinkedIn Section */}
      <section className="bg-white p-10 shadow-xl border border-gray-100 max-w-[210mm] mx-auto no-print rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
           <span className="bg-blue-600 text-white p-2 rounded-lg text-xl">in</span>
           <h2 className="text-2xl font-bold text-gray-800">LinkedIn Profile Optimization</h2>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-[2px]">Optimized Headline</label>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl font-bold text-blue-800">
              {result.linkedinHeadline}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-[2px]">About Section (Keywords optimized)</label>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
              {result.linkedinSummary}
            </div>
          </div>
        </div>
      </section>

      {/* Action Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 no-print flex gap-4">
        <button 
          onClick={handlePrint} 
          className="bg-blue-600 text-white px-12 py-5 rounded-full font-black text-lg shadow-[0_10px_30px_rgba(37,99,235,0.4)] hover:bg-blue-700 transition transform hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          <span className="text-xl">🖨️</span> Print / Save as PDF
        </button>
      </div>
    </div>
  );
};

export default DocumentPreview;
