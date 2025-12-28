import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useSearchParams } from 'react-router-dom';
import Layout from './components/Layout';
import ResumeForm from './components/ResumeForm';
import DocumentPreview from './components/DocumentPreview';
import Gallery from './components/Gallery';
import { UserData, DocumentResult, PackageType } from './types';
import { generateJobDocuments } from './services/geminiService';
import { PRICING, RAZORPAY_KEY_ID } from './constants';

const PackageCard = ({ 
  pkgKey, 
  data, 
  onSelect, 
  isSelected = false 
}: { 
  pkgKey: string, 
  data: any, 
  onSelect?: (key: PackageType) => void,
  isSelected?: boolean 
}) => {
  const isFeatured = pkgKey === PackageType.JOB_READY_PACK;
  
  return (
    <div className={`bg-white p-10 rounded-[2.5rem] shadow-sm border flex flex-col hover:shadow-xl transition-all duration-300 ${isFeatured ? 'ring-4 ring-blue-600 relative border-transparent' : 'border-gray-100'} ${isSelected ? 'border-blue-600 ring-2' : ''}`}>
      {isFeatured && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Best Value</span>
      )}
      <h3 className="text-xl font-bold mb-4">{data.label}</h3>
      <div className="text-5xl font-black mb-8">₹{data.price}</div>
      <ul className="text-left space-y-4 mb-10 flex-grow text-sm text-gray-600 font-medium">
        {data.features.map((f: string, i: number) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">✓</span> {f}
          </li>
        ))}
      </ul>
      {onSelect ? (
        <button 
          onClick={() => onSelect(pkgKey as PackageType)} 
          className={`w-full py-4 rounded-xl font-bold text-center transition shadow-md active:scale-95 ${isFeatured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
        >
          {isSelected ? 'Selected' : 'Select Plan'}
        </button>
      ) : (
        <Link 
          to={`/builder?package=${pkgKey}`} 
          className={`w-full py-4 rounded-xl font-bold text-center transition shadow-md active:scale-95 ${isFeatured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
        >
          Get Started
        </Link>
      )}
    </div>
  );
};

const Home = () => {
  return (
    <Layout>
      <div className="overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative bg-white pt-20 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[2px] mb-6 animate-fadeIn">
              India's Job-Ready Solution
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight mb-8">
              Create ATS-Ready Resumes <br className="hidden md:block" /> 
              <span className="text-blue-600">Tailored for Indian Roles</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 font-medium">
              JobDocPro helps you generate job-specific, recruiter-friendly resumes that are ready to apply — not just generic AI text.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
              <Link 
                to="/builder"
                className="px-12 py-6 bg-blue-600 text-white text-xl font-black rounded-2xl hover:bg-blue-700 transition transform hover:scale-105 shadow-2xl shadow-blue-200"
              >
                🟢 Create My Resume Now
              </Link>
              <div className="flex flex-col items-center sm:items-start justify-center text-sm font-bold text-gray-400 gap-1 uppercase tracking-widest">
                <span className="flex items-center gap-2">✔ Indian job market focused</span>
                <span className="flex items-center gap-2">✔ ATS optimized</span>
                <span className="flex items-center gap-2">✔ Clean professional formatting</span>
              </div>
            </div>
            <div className="relative max-w-5xl mx-auto group">
              <div className="absolute -inset-4 bg-blue-600/5 rounded-[3rem] blur-3xl group-hover:bg-blue-600/10 transition"></div>
              <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1200" className="relative rounded-3xl shadow-2xl border-4 border-white" alt="Resume Preview" />
            </div>
          </div>
        </section>

        {/* PROBLEM STATEMENT */}
        <section className="bg-gray-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4 tracking-tight">Why most resumes fail (even AI ones)</h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">The Hard Truth of Modern Hiring</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { t: "ATS Rejection", d: "Generic AI resumes use incompatible formats that hiring software can't read.", i: "🚫" },
                { t: "Keyword Gaps", d: "If your resume doesn't match Indian job role keywords, it never reaches a human.", i: "🔑" },
                { t: "Poor Structure", d: "Recruiters skip resumes that are messy or too long. You have 6 seconds to impress.", i: "⏱️" }
              ].map((p, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-blue-200 transition">
                  <div className="text-4xl mb-6">{p.i}</div>
                  <h3 className="text-xl font-black mb-3">{p.t}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">{p.d}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center bg-blue-600 text-white p-8 rounded-[2rem] shadow-xl">
              <p className="text-xl font-black">👉 JobDocPro fixes all of this automatically.</p>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4">JobDocPro vs. Free AI Tools</h2>
              <p className="text-gray-500 font-medium">Free AI gives text. JobDocPro gives job-ready resumes.</p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-6 font-black uppercase text-xs tracking-widest text-gray-400">Feature</th>
                    <th className="p-6 font-black text-gray-400">Generic AI</th>
                    <th className="p-6 font-black text-blue-600">JobDocPro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ["Job-role tailored content", "❌ No", "✅ Yes"],
                    ["ATS keyword optimization", "❌ No", "✅ Yes"],
                    ["Indian recruiter friendly", "❌ No", "✅ Yes"],
                    ["Clean PDF & Word format", "⚠️ Breaks", "✅ Yes"],
                    ["Ready-to-apply output", "❌ No", "✅ Yes"]
                  ].map(([f, o, j], i) => (
                    <tr key={i}>
                      <td className="p-6 font-bold text-sm">{f}</td>
                      <td className="p-6 text-sm text-gray-400">{o}</td>
                      <td className="p-6 text-sm font-black text-blue-600">{j}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

const Builder = () => {
  const [searchParams] = useSearchParams();
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(searchParams.get('package') as PackageType | null);
  const [userData, setUserData] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('jdp_draft');
    return saved ? JSON.parse(saved) : null;
  });
  const [result, setResult] = useState<DocumentResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);

  const getIdentifier = (email: string, phone: string) => `${email.toLowerCase().trim()}_${phone.trim()}`;
  
  const [paidIdentifiers, setPaidIdentifiers] = useState<string[]>(() => 
    JSON.parse(localStorage.getItem('jdp_paid_list') || '[]')
  );
  const [usageMap, setUsageMap] = useState<Record<string, number>>(() => 
    JSON.parse(localStorage.getItem('jdp_usage_map') || '{}')
  );

  const currentId = userData ? getIdentifier(userData.email, userData.phone) : '';
  const isPaid = paidIdentifiers.includes(currentId);
  const usageCount = usageMap[currentId] || 0;
  const remainingDownloads = (usageCount < 1) ? 3 : (3 - usageCount);

  useEffect(() => {
    if (userData) localStorage.setItem('jdp_draft', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    localStorage.setItem('jdp_paid_list', JSON.stringify(paidIdentifiers));
  }, [paidIdentifiers]);

  useEffect(() => {
    localStorage.setItem('jdp_usage_map', JSON.stringify(usageMap));
  }, [usageMap]);

  const handleRazorpayCheckout = () => {
    if (!userData || !selectedPackage) return;
    
    if (!(window as any).Razorpay) {
      alert("Razorpay SDK not loaded.");
      return;
    }

    const amount = PRICING[selectedPackage].price;
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: "INR",
      name: "JobDocPro",
      description: `Unlock ${PRICING[selectedPackage].label}`,
      handler: function(response: any) {
        if (response.razorpay_payment_id) {
          handlePaymentSuccess();
        }
      },
      prefill: { name: userData.fullName, email: userData.email, contact: userData.phone },
      theme: { color: "#2563eb" }
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Something went wrong with Razorpay.");
    }
  };

  const onFormSubmit = async (data: UserData) => {
    setUserData(data);
    setIsGenerating(true);
    setResult(null);
    try {
      const generated = await generateJobDocuments(data);
      setResult(generated);
      // We don't increment usage here because it's a preview
      window.scrollTo(0, 0);
    } catch (e: any) {
      alert(e.message || "Generation error.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePaymentSuccess = async () => {
    if (userData) {
      const id = getIdentifier(userData.email, userData.phone);
      setUsageMap(prev => ({ ...prev, [id]: 0 }));
      if (!paidIdentifiers.includes(id)) {
        setPaidIdentifiers(prev => [...prev, id]);
      }
      setIsCheckout(false);
      // After payment, we count the first usage
      setUsageMap(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    }
  };

  if (!selectedPackage) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-16 px-4 text-center">
          <h1 className="text-4xl font-black mb-4">Choose Your Package</h1>
          <p className="text-gray-500 mb-12 font-medium">One-time payment. No hidden subscription.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(PRICING).map(([key, val]) => (
              <PackageCard key={key} pkgKey={key} data={val} onSelect={setSelectedPackage} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (isGenerating) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-32 text-center animate-fadeIn">
           <div className="w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
           <h2 className="text-3xl font-black mb-4 tracking-tight">Generating Job-Ready Documents...</h2>
           <p className="text-gray-500 font-medium">Customizing for the Indian hiring market.</p>
        </div>
      </Layout>
    );
  }

  if (result && userData) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto py-10 px-4">
          <div className="flex justify-between items-center mb-10 no-print">
            <button onClick={() => setResult(null)} className="text-blue-600 font-bold hover:underline">← Edit Details</button>
            <div className="flex flex-col items-end">
              {isPaid ? (
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-green-100">✨ Pro Access</div>
              ) : (
                <button 
                  onClick={() => setIsCheckout(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition"
                >
                  🚀 Unlock Full Resume
                </button>
              )}
              {isPaid && <span className="text-[10px] text-gray-400 mt-1 font-bold">Credits remaining: {remainingDownloads}</span>}
            </div>
          </div>
          <DocumentPreview 
            user={userData} 
            result={result} 
            packageType={selectedPackage} 
            isPreview={!isPaid} 
            onUnlock={() => setIsCheckout(true)}
          />
        </div>

        {/* Checkout Modal Overlay */}
        {isCheckout && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-blue-100 max-w-xl w-full text-center">
              <h2 className="text-4xl font-black mb-4">Ready to Apply?</h2>
              <p className="text-gray-500 mb-8 font-medium">Unlock full PDF export, clean formatting, and job-specific keywords.</p>
              <div className="bg-blue-600 p-10 rounded-3xl mb-10 text-white shadow-xl">
                 <div className="text-7xl font-black tracking-tighter">₹{PRICING[selectedPackage].price}</div>
                 <div className="mt-2 text-sm text-blue-100 font-bold uppercase tracking-widest opacity-80">One-Time Payment</div>
              </div>
              <button 
                onClick={handleRazorpayCheckout}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition transform hover:scale-105 shadow-xl shadow-blue-200"
              >
                Unlock My Documents
              </button>
              <button onClick={() => setIsCheckout(false)} className="mt-8 text-gray-400 font-bold uppercase text-[10px] hover:text-blue-600">Maybe Later</button>
            </div>
          </div>
        )}
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-16 px-4">
        <button onClick={() => setSelectedPackage(null)} className="text-blue-600 font-bold mb-8 hover:underline">← Change Package</button>
        <div className="text-center mb-16">
          <span className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            Selected: {PRICING[selectedPackage].label}
          </span>
          <h1 className="text-4xl font-black tracking-tight">Tell us about yourself</h1>
        </div>
        <ResumeForm onSubmit={onFormSubmit} isLoading={isGenerating} initialData={userData} />
      </div>
    </Layout>
  );
};

const Pricing = () => (
  <Layout>
    <div className="max-w-7xl mx-auto py-24 px-4 text-center">
      <h1 className="text-5xl font-black mb-6 tracking-tight text-gray-900">Simple, Honest Pricing</h1>
      <p className="text-gray-500 text-xl mb-20 max-w-2xl mx-auto">Pay once, apply confidently. No subscriptions.</p>
      
      <div className="grid md:grid-cols-3 gap-8">
        {Object.entries(PRICING).map(([key, val]) => (
          <PackageCard key={key} pkgKey={key} data={val} />
        ))}
      </div>
    </div>
  </Layout>
);

const FAQ = () => (
  <Layout>
    <div className="max-w-3xl mx-auto py-24 px-4">
      <h1 className="text-5xl font-black text-center mb-16 tracking-tight">Questions?</h1>
      <div className="space-y-6">
        {[
          { q: "Will this work for Indian ATS?", a: "Yes. Our formats are designed specifically for hiring systems used by top Indian firms and MNCs." },
          { q: "Is it a recurring payment?", a: "No. You only pay once to unlock the resume pack." },
          { q: "What if I'm not happy?", a: "We focus on quality. If the AI doesn't get it right, use our multiple edits feature to regenerate until it's perfect." }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-black mb-2 leading-tight">{item.q}</h3>
            <p className="text-gray-600 font-medium leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  </Layout>
);

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/builder" element={<Builder />} />
      <Route path="/samples" element={<Gallery />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/faq" element={<FAQ />} />
    </Routes>
  </Router>
);

export default App;