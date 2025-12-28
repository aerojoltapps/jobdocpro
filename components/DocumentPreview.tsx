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

  return (
    <div className="space-y-12 pb-24 print-container relative animate-fadeIn">
      {/* Visual Instruction for User */}
      {!isPreview && (
        <div className="max-w-[210mm] mx-auto bg-blue-50 border border-blue-100 p-5 rounded-2xl no-print flex items-start gap-4 shadow-sm">
          <span className="text-2xl">📝</span>
          <div>
            <h4 className="font-black text-blue-900 text-sm">Professional PDF Instructions:</h4>
            <p className="text-blue-700 text-xs mt-1 leading-relaxed font-medium">
              When the Print window opens, click <strong>"More Settings"</strong> and ensure 
              <strong> "Headers and Footers"</strong> is <u>Unchecked</u> for a clean output.
            </p>
          </div>
        </div>
      )}

      {/* Page 1: Resume */}
      <section className={`bg-white p-12 shadow-2xl border border-gray-100 max-w-[210mm] mx-auto min-h-[297mm] text-gray-900 relative print:shadow-none print:border-none print:p-0 ${isPreview ? 'overflow-hidden max-h-[1000px]' : ''}`}>
        
        {/* Header (Always Visible) */}
        <div className="text-center mb-8 border-b-2 border-gray-900 pb-8">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 text-gray-900">{user.fullName}</h1>
          <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-[13px] font-bold text-gray-500">
            <span>{user.email}</span>
            <span className="hidden sm:inline">•</span>
            <span>{user.phone}</span>
            <span className="hidden sm:inline">•</span>
            <span>{user.location}</span>
          </div>
        </div>

        {/* Content (Blurred if Preview) */}
        <div className={`space-y-8 ${isPreview ? 'blur-lg select-none pointer-events-none' : ''}`}>
          <div>
            <h2 className="text-base font-black border-b-2 border-gray-900 mb-3 uppercase tracking-[3px] text-blue-900">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed text-[14px] font-medium">{result.resumeSummary}</p>
          </div>

          <div>
            <h2 className="text-base font-black border-b-2 border-gray-900 mb-5 uppercase tracking-[3px] text-blue-900">Work Experience</h2>
            {user.experience.map((exp, idx) => (
              <div key={idx} className="mb-8">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-black text-[15px]">{exp.title}</span>
                  <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{exp.duration}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-blue-700 font-black text-[13px] uppercase tracking-tight">{exp.company}</span>
                </div>
                <ul className="list-disc ml-5 text-[14px] text-gray-700 space-y-2 font-medium">
                  {(result.experienceBullets[idx] || []).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-base font-black border-b-2 border-gray-900 mb-4 uppercase tracking-[3px] text-blue-900">Education</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.education.map((edu, idx) => (
                <div key={idx} className="border border-gray-50 p-4 rounded-xl">
                  <p className="font-black text-[14px] text-gray-900">{edu.degree}</p>
                  <p className="text-[12px] text-gray-500 font-bold mt-1 uppercase tracking-tighter">{edu.college} | Class of {edu.year}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-base font-black border-b-2 border-gray-900 mb-3 uppercase tracking-[3px] text-blue-900">Skills & Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {result.keywordMapping?.map((skill, i) => (
                <span key={i} className="bg-gray-50 text-gray-700 px-3 py-1 rounded text-[12px] font-bold border border-gray-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Unlock Overlay */}
        {isPreview && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/20 p-12 text-center no-print">
            <div className="bg-white/95 backdrop-blur-md p-10 rounded-[3rem] shadow-2xl border border-gray-100 max-w-sm animate-scaleIn">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🔒</div>
              <h3 className="text-2xl font-black mb-2 text-gray-900">Resume Ready!</h3>
              <p className="text-gray-500 text-sm mb-8 font-medium">Your ATS-optimized resume for <strong>{user.jobRole}</strong> is generated and ready for download.</p>
              <button 
                onClick={onUnlock}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition transform hover:scale-105 active:scale-95"
              >
                Unlock My Documents
              </button>
              <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pay once • Use 3 times</p>
            </div>
          </div>
        )}
      </section>

      {/* Premium Insights Section (Post-Payment) */}
      {!isPreview && result.recruiterInsights && (
        <section className="max-w-[210mm] mx-auto bg-gray-900 text-white p-10 rounded-[2.5rem] no-print shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl">💡</span>
            <h2 className="text-xl font-black tracking-tight">Recruiter Insight for this Profile</h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">{result.recruiterInsights}</p>
          <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
            <h4 className="text-[10px] font-black uppercase tracking-[2px] mb-2 text-blue-400">ATS Strategy:</h4>
            <p className="text-xs text-gray-300 italic">"{result.atsExplanation}"</p>
          </div>
        </section>
      )}

      {/* Pages: Cover Letter & LinkedIn */}
      {!isPreview && (
        <>
          {hasCoverLetter && (
            <section className="bg-white p-12 shadow-xl border border-gray-100 max-w-[210mm] mx-auto rounded-2xl print:shadow-none print:border-none print:p-0 page-break">
              <h2 className="text-2xl font-black mb-10 no-print flex items-center gap-2">
                 <span className="text-blue-600">✉️</span> Cover Letter
              </h2>
              <div className="text-[14px] leading-relaxed space-y-6 font-medium text-gray-800">
                <div className="mb-10 font-black">
                  <p>{user.fullName}</p>
                  <p>{user.location} | {user.email}</p>
                </div>
                <p>Dear Hiring Manager,</p>
                <div className="whitespace-pre-wrap">{result.coverLetter}</div>
                <div className="mt-10">
                  <p>Sincerely,</p>
                  <p className="font-black mt-2">{user.fullName}</p>
                </div>
              </div>
            </section>
          )}

          {hasLinkedIn && (
            <section className="bg-white p-12 shadow-xl border border-gray-100 max-w-[210mm] mx-auto rounded-2xl print:shadow-none print:border-none print:p-0 page-break">
              <h2 className="text-2xl font-black mb-10 no-print flex items-center gap-2">
                 <span className="text-blue-600">🔗</span> LinkedIn Profile
              </h2>
              <div className="space-y-10">
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Optimized Headline</p>
                  <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl font-black text-blue-900 text-lg">{result.linkedinHeadline}</div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">About Section (Summary)</p>
                  <div className="p-8 bg-gray-50 border border-gray-200 rounded-2xl text-[14px] whitespace-pre-wrap leading-relaxed font-medium text-gray-700">
                    {result.linkedinSummary}
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Floating Action Button */}
      {!isPreview && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 no-print">
          <button onClick={() => window.print()} className="bg-blue-600 text-white px-10 py-5 rounded-full font-black text-xl shadow-2xl hover:bg-blue-700 transition transform hover:scale-105 active:scale-95 flex items-center gap-4">
            <span className="bg-white/20 p-2 rounded-full">📄</span>
            <span>Download All Documents</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentPreview;