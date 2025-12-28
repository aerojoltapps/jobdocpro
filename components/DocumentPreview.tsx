import React, { useEffect } from 'react';
import { UserData, DocumentResult, PackageType } from '../types';

interface Props {
  user: UserData;
  result: DocumentResult;
  packageType: PackageType;
}

const DocumentPreview: React.FC<Props> = ({ user, result, packageType }) => {
  // Sync document title to user name for dynamic PDF filename
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${user.fullName} - Career Documents`;
    return () => {
      document.title = originalTitle;
    };
  }, [user.fullName]);

  const hasCoverLetter = packageType === PackageType.RESUME_COVER || packageType === PackageType.JOB_READY_PACK;
  const hasLinkedIn = packageType === PackageType.JOB_READY_PACK;

  return (
    <div className="space-y-12">
      <div className="flex justify-center no-print">
        <p className="text-gray-400 text-sm font-medium italic">Filename will save as: {user.fullName}.pdf</p>
      </div>

      {/* Page 1: Resume */}
      <section className="bg-white p-12 shadow-2xl border border-gray-100 max-w-[210mm] mx-auto min-h-[297mm] text-gray-900 relative print:shadow-none print:border-none">
        <div className="text-center mb-8 border-b-2 border-gray-900 pb-6">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">{user.fullName}</h1>
          <div className="flex justify-center gap-4 text-[13px] font-bold text-gray-600">
            <span>{user.email}</span> | <span>{user.phone}</span> | <span>{user.location}</span>
          </div>
        </div>

        <div className="space-y-8">
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

          <div>
            <h2 className="text-lg font-black border-b border-gray-200 mb-3 uppercase tracking-widest text-blue-900">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((s, i) => <span key={i} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded text-[11px] font-bold">{s}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* Page 2: Cover Letter (Printable) */}
      {hasCoverLetter && (
        <section className="bg-white p-12 shadow-xl border border-gray-100 max-w-[210mm] mx-auto rounded-2xl print:shadow-none print:border-none page-break">
          <div className="no-print flex items-center gap-3 mb-8">
            <span className="bg-blue-100 p-2 rounded text-xl">📧</span>
            <h2 className="text-2xl font-black">Cover Letter</h2>
          </div>
          <div className="text-sm leading-relaxed space-y-6">
            <div className="mb-10 font-bold">
              <p>{user.fullName}</p>
              <p>{user.location} | {user.email}</p>
            </div>
            <p>Dear Hiring Manager,</p>
            <div className="whitespace-pre-wrap">{result.coverLetter}</div>
            <div className="mt-12">
              <p>Best Regards,</p>
              <p className="font-black mt-2">{user.fullName}</p>
            </div>
          </div>
        </section>
      )}

      {/* Page 3: LinkedIn (Printable) */}
      {hasLinkedIn && (
        <section className="bg-white p-12 shadow-xl border border-gray-100 max-w-[210mm] mx-auto rounded-2xl print:shadow-none print:border-none page-break">
          <div className="no-print flex items-center gap-3 mb-8">
            <span className="bg-blue-600 text-white p-2 rounded text-xl font-bold">in</span>
            <h2 className="text-2xl font-black">LinkedIn Profile</h2>
          </div>
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Optimized Headline</p>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl font-bold text-blue-800 print:bg-white">{result.linkedinHeadline}</div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">About Summary</p>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm whitespace-pre-wrap print:bg-white">{result.linkedinSummary}</div>
            </div>
          </div>
        </section>
      )}

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 no-print">
        <button onClick={() => window.print()} className="bg-blue-600 text-white px-12 py-5 rounded-full font-black text-xl shadow-2xl hover:bg-blue-700 transition transform hover:scale-105 active:scale-95">
          Download PDF Bundle
        </button>
      </div>
    </div>
  );
};

export default DocumentPreview;