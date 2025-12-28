import React, { useEffect } from 'react';
import { UserData, DocumentResult, PackageType } from '../types';

interface Props {
  user: UserData;
  result: DocumentResult;
  packageType: PackageType;
  isPreview?: boolean;
  onUnlock?: () => void;
}

const DocumentPreview: React.FC<Props> = ({ user, result, packageType, isPreview = false, onUnlock }) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${user.fullName}_Resume`;
    return () => {
      document.title = originalTitle;
    };
  }, [user.fullName]);

  const hasCoverLetter = packageType === PackageType.RESUME_COVER || packageType === PackageType.JOB_READY_PACK;
  const hasLinkedIn = packageType === PackageType.JOB_READY_PACK;
  const isPremium = packageType === PackageType.JOB_READY_PACK;

  return (
    <div className="space-y-12 pb-24 print-container relative">
      {/* Visual Instruction for User */}
      {!isPreview && (
        <div className="max-w-[210mm] mx-auto bg-blue-50 border border-blue-100 p-5 rounded-2xl no-print flex items-start gap-4 shadow-sm animate-fadeIn">
          <span className="text-2xl">📝</span>
          <div>
            <h4 className="font-black text-blue-900 text-sm">Professional PDF Instructions:</h4>
            <p className="text-blue-700 text-xs mt-1 leading-relaxed font-medium">
              When the Print window opens, click <strong>"More Settings"</strong> and ensure 
              <strong> "Headers and Footers"</strong> is <u>Unchecked</u>.
            </p>
          </div>
        </div>
      )}

      {/* Page 1: Resume */}
      <section className={`bg-white p-12 shadow-2xl border border-gray-100 max-w-[210mm] mx-auto min-h-[297mm] text-gray-900 relative print:shadow-none print:border-none print:p-0 ${isPreview ? 'overflow-hidden' : ''}`}>
        
        {/* Header (Visible in Preview) */}
        <div className="text-center mb-8 border-b-2 border-gray-900 pb-6">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">{user.fullName}</h1>
          <div className="flex justify-center gap-4 text-[13px] font-bold text-gray-600">
            <span>{user.email}</span> | <span>{user.phone}</span> | <span>{user.location}</span>
          </div>
        </div>

        {/* Content (Blurred if Preview) */}
        <div className={`space-y-8 ${isPreview ? 'blur-md select-none pointer-events-none' : ''}`}>
          <div>
            <h2 className="text-lg font-black border-b border-gray-200 mb-3 uppercase tracking-widest text-blue-900">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed text-[13px]">{result.resumeSummary}</p>
          </div>

          <div>
            <h2 className="text-lg font-black border-b border-gray-200 mb-4 uppercase tracking-widest text-blue-900">Experience</h2>
            {user.experience.map((exp, idx) => (
              <div key={idx} className="mb-6">
                <div className="flex justify-between font-black text-sm mb-1">
                  <span>{exp.title}</span>
                  <span className="text-gray-400 uppercase text-[10px]">{exp.duration}</span>
                </div>
                <p className="text-blue-700 font-bold text-[13px] mb-2">{exp.company}</p>
                <ul className="list-disc ml-4 text-[13px] text-gray-700 space-y-1">
                  {(result.experienceBullets[idx] || []).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-lg font-black border-b border-gray-200 mb-3 uppercase tracking-widest text-blue-900">Education</h2>
            <div className="grid grid-cols-2 gap-4">
              {user.education.map((edu, idx) => (
                <div key={idx} className="border border-gray-100 p-3 rounded">
                  <p className="font-bold text-sm">{edu.degree}</p>
                  <p className="text-[11px] text-gray-500">{edu.college} | {edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Unlock Overlay */}
        {isPreview && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 p-12 text-center no-print">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 max-w-sm">
              <span className="text-4xl mb-4 block">🔒</span>
              <h3 className="text-2xl font-black mb-2">Content Generated!</h3>
              <p className="text-gray-500 text-sm mb-8 font-medium">Your ATS-optimized resume is ready. Unlock now to download the clean PDF version.</p>
              <button 
                onClick={onUnlock}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition"
              >
                Unlock My Resume
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Other sections (Cover Letter, LinkedIn) follow same blur logic if isPreview */}
      {!isPreview && (
        <>
          {hasCoverLetter && (
            <section className="bg-white p-12 shadow-xl border border-gray-100 max-w-[210mm] mx-auto rounded-2xl print:shadow-none print:border-none print:p-0 page-break">
              <h2 className="text-2xl font-black mb-8 no-print">Cover Letter</h2>
              <div className="text-sm leading-relaxed space-y-6">
                <div className="mb-10 font-bold">
                  <p>{user.fullName}</p>
                  <p>{user.location} | {user.email}</p>
                </div>
                <p>Dear Hiring Manager,</p>
                <div className="whitespace-pre-wrap">{result.coverLetter}</div>
              </div>
            </section>
          )}

          {hasLinkedIn && (
            <section className="bg-white p-12 shadow-xl border border-gray-100 max-w-[210mm] mx-auto rounded-2xl print:shadow-none print:border-none print:p-0 page-break">
              <h2 className="text-2xl font-black mb-8 no-print">LinkedIn Profile</h2>
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Optimized Headline</p>
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl font-bold text-blue-800">{result.linkedinHeadline}</div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-2">About Summary</p>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm whitespace-pre-wrap">{result.linkedinSummary}</div>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Fixed Footer for Download */}
      {!isPreview && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 no-print">
          <button onClick={() => window.print()} className="bg-blue-600 text-white px-12 py-5 rounded-full font-black text-xl shadow-2xl hover:bg-blue-700 transition transform hover:scale-105 active:scale-95 flex items-center gap-3">
            <span>⬇️</span> Download PDF Bundle
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentPreview;