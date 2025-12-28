
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
              India's Most Trusted Career Toolkit
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight mb-8">
              Get a job-ready resume <br className="hidden md:block" /> 
              <span className="text-blue-600">in 15 minutes.</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              No AI skills needed. No complex prompts. Just professional documents ready to submit to Indian recruiters.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
              <Link 
                to="/builder"
                className="px-12 py-6 bg-blue-600 text-white text-xl font-black rounded-2xl hover:bg-blue-700 transition transform hover:scale-105 shadow-2xl shadow-blue-200"
              >
                🟢 Build My Resume Now
              </Link>
              <div className="flex flex-col items-center sm:items-start justify-center text-sm font-bold text-gray-400 gap-1 uppercase tracking-widest">
                <span className="flex items-center gap-2 text-gray-900">✔ Indian recruiter approved</span>
                <span className="flex items-center gap-2 text-gray-900">✔ 100% ATS Friendly</span>
                <span className="flex items-center gap-2 text-gray-900">✔ Clean professional formats</span>
              </div>
            </div>
            <div className="relative max-w-5xl mx-auto group">
              <div className="absolute -inset-4 bg-blue-600/5 rounded-[3rem] blur-3xl group-hover:bg-blue-600/10 transition"></div>
              <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1200" className="relative rounded-3xl shadow-2xl border-4 border-white" alt="Resume Preview" />
            </div>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="bg-gray-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4 tracking-tight">JobDocPro vs. Free AI Tools</h2>
              <p className="text-gray-500 font-medium">Why 1,000+ candidates choose us every month.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
               <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-bold mb-6 text-gray-400">Generic AI (ChatGPT)</h3>
                  <ul className="space-y-4 text-sm text-gray-400">
                    <li>❌ Formatting breaks in ATS</li>
                    <li>❌ Generic, non-Indian language</li>
                    <li>❌ Hard to get the right keywords</li>
                    <li>❌ Requires complex prompting</li>
                  </ul>
               </div>
               <div className="bg-blue-600 p-10 rounded-[2.5rem] text-white shadow-xl">
                  <h3 className="text-xl font-bold mb-6">JobDocPro</h3>
                  <ul className="space-y-4 text-sm font-bold">
                    <li>✅ Recruiter-Approved Layouts</li>
                    <li>✅ Indian Job Market Keywords</li>
                    <li>✅ Instant Clean PDF/Word Export</li>
                    <li>✅ 15-Min Simple Form Flow</li>
                  </ul>
               </div>
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
  const remainingGenerations = Math.max(0, 3 - usageCount);

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
      alert("Payment gateway not ready. Please check your internet.");
      return;
    }

    if (RAZORPAY_KEY_ID === 'rzp_test_fallback_key') {
      alert("Missing Razorpay Configuration. Please check your Vercel Environment Variables.");
      return;
    }

    const amount = PRICING[selectedPackage].price;
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amount * 100, // paise
      currency: "INR",
      name: "JobDocPro",
      description: `Unlock Full Bundle - ${PRICING[selectedPackage].label}`,
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=100&h=100&fit=crop",
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
      rzp.on('payment.failed', (res: any) => alert(res.error.description));
      rzp.open();
    } catch (err) {
      alert("Checkout error. Please try again.");
    }
  };

  const handlePaymentSuccess = () => {
    if (userData) {
      const id = getIdentifier(userData.email, userData.phone);
      setUsageMap(prev => ({ ...prev, [id]: 0 })); // Reset usage count on new payment
      if (!paidIdentifiers.includes(id)) {
        setPaidIdentifiers(prev => [...prev, id]);
      }
      setIsCheckout(false);
      window.scrollTo(0, 0);
    }
  };

  const onFormSubmit = async (data: UserData) => {
    setUserData(data);
    setIsGenerating(true);
    setResult(null);
    try {
      const generated = await generateJobDocuments(data);
      setResult(generated);
      const id = getIdentifier(data.email, data.phone);
      // Increment usage count ONLY if they are paid
      if (paidIdentifiers.includes(id)) {
        setUsageMap(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      }
      window.scrollTo(0, 0);
    } catch (e: any) {
      alert(e.message || "Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!selectedPackage) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-16 px-4 text-center">
          <h1 className="text-4xl font-black mb-4">Select Your Plan</h1>
          <p className="text-gray-500 mb-12 font-medium italic">One-time payment for 3 full generations.</p>
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
           <h2 className="text-3xl font-black mb-4 tracking-tight">Generating Your Job-Ready Docs...</h2>
           <p className="text-gray-500 font-medium">Optimizing keywords for Indian hiring managers.</p>
        </div>
      </Layout>
    );
  }

  if (result && userData) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto py-10 px-4">
          <div className="flex justify-between items-center mb-10 no-print">
            <button onClick={() => setResult(null)} className="text-blue-600 font-bold hover:underline flex items-center gap-2">
               <span>←</span> Edit Details
            </button>
            <div className="flex flex-col items-end">
              {isPaid ? (
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-green-100 flex items-center gap-2">
                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                   Full Access
                </div>
              ) : (
                <button 
                  onClick={() => setIsCheckout(true)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                >
                  🚀 Unlock Full Documents
                </button>
              )}
              {isPaid && <span className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-tighter">Credits: {remainingGenerations} / 3</span>}
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

        {isCheckout && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-blue-100 max-w-xl w-full text-center" onClick={e => e.stopPropagation()}>
              <h2 className="text-4xl font-black mb-4 tracking-tight">Ready to Land That Job?</h2>
              <p className="text-gray-500 mb-8 font-medium">Unlock full PDF export, recruiter keywords, and cover letter.</p>
              <div className="bg-blue-600 p-10 rounded-3xl mb-10 text-white shadow-xl">
                 <div className="text-7xl font-black tracking-tighter">₹{PRICING[selectedPackage].price}</div>
                 <div className="mt-2 text-sm text-blue-100 font-bold uppercase tracking-widest opacity-80">One-Time (3 Generations)</div>
              </div>
              <button 
                onClick={handleRazorpayCheckout}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition transform hover:scale-105 shadow-xl shadow-blue-200"
              >
                Pay & Unlock
              </button>
              <button onClick={() => setIsCheckout(false)} className="mt-8 text-gray-400 font-bold uppercase text-[10px] hover:text-blue-600 block w-full">I'll do this later</button>
              <p className="mt-8 text-[9px] text-gray-300 font-bold uppercase tracking-widest">Secure Payments via Razorpay • GST Included</p>
            </div>
          </div>
        )}
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-16 px-4">
        <button onClick={() => setSelectedPackage(null)} className="text-blue-600 font-bold mb-8 hover:underline flex items-center gap-1">
          <span>←</span> Change Package
        </button>
        <div className="text-center mb-16">
          <span className="inline-block bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            Building: {PRICING[selectedPackage].label}
          </span>
          <h1 className="text-4xl font-black tracking-tight">Your Career Journey</h1>
          <p className="text-gray-500 mt-2 font-medium">Fill this out to get your customized recruiter-ready docs.</p>
        </div>
        <ResumeForm onSubmit={onFormSubmit} isLoading={isGenerating} initialData={userData} />
      </div>
    </Layout>
  );
};

const Pricing = () => (
  <Layout>
    <div className="max-w-7xl mx-auto py-24 px-4 text-center">
      <h1 className="text-5xl font-black mb-6 tracking-tight text-gray-900">Simple, One-Time Pricing</h1>
      <p className="text-gray-500 text-xl mb-20 max-w-2xl mx-auto">Pay once, use 3 times. No subscriptions or recurring fees.</p>
      
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
      <h1 className="text-5xl font-black text-center mb-16 tracking-tight">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {[
          { q: "Is it really ATS-friendly?", a: "Yes. Our templates use standard fonts and structures that Indian hiring systems (like TCS iON, Infosys portals, etc.) can read perfectly." },
          { q: "Can I use it on mobile?", a: "Absolutely. Our builder is optimized for smartphones, and your resume will be generated as a perfect A4 PDF." },
          { q: "What is the '3 Generation' quota?", a: "Every payment gives you 3 credits. This means if you change your mind about your skills or job title, you can regenerate it up to 3 times without paying again." }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-100 transition">
            <h3 className="text-xl font-black mb-2 leading-tight text-gray-900">{item.q}</h3>
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
