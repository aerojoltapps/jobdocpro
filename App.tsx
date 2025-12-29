import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useSearchParams } from 'react-router-dom';
import Layout from './components/Layout';
import ResumeForm from './components/ResumeForm';
import DocumentPreview from './components/DocumentPreview';
import Gallery from './components/Gallery';
import { UserData, DocumentResult, PackageType, JobRole } from './types';
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
              Best Professional Resume Service in India
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight mb-8">
              Get a job-ready resume <br className="hidden md:block" /> 
              <span className="text-blue-600">in 15 minutes.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6 font-semibold leading-relaxed">
              We provide ATS-friendly resume writing services in India for freshers and experienced professionals. 
              <strong> No AI skills needed. No complex prompts. Just professional documents ready to submit to Indian recruiters.</strong>
            </p>
            <p className="text-md text-gray-400 max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of job seekers using our <strong>Resume writing service India</strong> to build an <strong>ATS friendly resume</strong>. Get expert <strong>fresher resume help</strong> with our <strong>professional resume service</strong> today.
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
              <p className="text-gray-500 font-medium">Why we are the preferred resume writing service in India.</p>
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
    const initialRole = searchParams.get('role');
    
    if (saved) {
      const parsed = JSON.parse(saved);
      if (initialRole) parsed.jobRole = initialRole as JobRole;
      return parsed;
    }
    
    return initialRole ? {
      fullName: '', email: '', phone: '', location: '',
      jobRole: initialRole as JobRole,
      education: [{ degree: '', college: '', year: '', percentage: '' }],
      experience: [{ title: '', company: '', duration: '', description: '' }],
      skills: [''],
    } : null;
  });

  const [result, setResult] = useState<DocumentResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);

  const getIdentifier = (email: string, phone: string) => `${email.toLowerCase().trim()}_${phone.trim()}`;
  
  const [paidIdentifiers, setPaidIdentifiers] = useState<string[]>(() => 
    JSON.parse(localStorage.getItem('jdp_paid_list') || '[]')
  );
  const [creditsMap, setCreditsMap] = useState<Record<string, number>>(() => 
    JSON.parse(localStorage.getItem('jdp_credits_map') || '{}')
  );

  const currentId = userData ? getIdentifier(userData.email, userData.phone) : '';
  const isPaid = paidIdentifiers.includes(currentId);
  const remainingCredits = creditsMap[currentId] !== undefined ? creditsMap[currentId] : 0;

  useEffect(() => {
    if (userData) localStorage.setItem('jdp_draft', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    localStorage.setItem('jdp_paid_list', JSON.stringify(paidIdentifiers));
  }, [paidIdentifiers]);

  useEffect(() => {
    localStorage.setItem('jdp_credits_map', JSON.stringify(creditsMap));
  }, [creditsMap]);

  const handleRazorpayCheckout = () => {
    if (!userData || !selectedPackage) return;
    
    const rzp = (window as any).Razorpay;
    if (!rzp) {
      alert("Payment gateway is taking longer than expected to load. Please refresh.");
      return;
    }

    if (RAZORPAY_KEY_ID === 'rzp_test_fallback_key') {
      console.error("Razorpay Key ID missing from environment variables.");
      alert("Checkout system is under maintenance. Please try again later.");
      return;
    }

    const amount = PRICING[selectedPackage].price;
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amount * 100, // in paise
      currency: "INR",
      name: "JobDocPro",
      description: `Unlock Full Documents - ${PRICING[selectedPackage].label}`,
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=100&h=100&fit=crop",
      handler: function(response: any) {
        if (response.razorpay_payment_id) {
          handlePaymentSuccess();
        }
      },
      prefill: {
        name: userData.fullName,
        email: userData.email,
        contact: userData.phone
      },
      theme: {
        color: "#2563eb"
      },
      modal: {
        ondismiss: function() {
          console.log("Checkout modal closed by user");
        }
      }
    };

    try {
      const instance = new rzp(options);
      instance.open();
    } catch (err) {
      console.error("Razorpay instance error:", err);
      alert("Failed to open checkout. Please ensure you have a stable connection.");
    }
  };

  const handlePaymentSuccess = () => {
    if (userData) {
      const id = getIdentifier(userData.email, userData.phone);
      setPaidIdentifiers(prev => prev.includes(id) ? prev : [...prev, id]);
      setCreditsMap(prev => ({ ...prev, [id]: 3 }));
      setIsCheckout(false);
      window.scrollTo(0, 0);
    }
  };

  const onFormSubmit = async (data: UserData) => {
    const id = getIdentifier(data.email, data.phone);
    const userIsPaid = paidIdentifiers.includes(id);
    const userCredits = creditsMap[id] !== undefined ? creditsMap[id] : 0;

    if (userIsPaid && userCredits <= 0) {
      alert("You have used all 3 generations. Please purchase another pack to continue editing.");
      setIsCheckout(true);
      return;
    }

    setUserData(data);
    setIsGenerating(true);
    setResult(null);

    try {
      const generated = await generateJobDocuments(data);
      setResult(generated);
      
      if (userIsPaid) {
        setCreditsMap(prev => ({
          ...prev,
          [id]: Math.max(0, (prev[id] || 3) - 1)
        }));
      }
      
      window.scrollTo(0, 0);
    } catch (e: any) {
      alert(e.message || "Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async (feedback: string) => {
    if (!userData || remainingCredits <= 0) return;
    
    setIsGenerating(true);
    const id = getIdentifier(userData.email, userData.phone);

    try {
      const refined = await generateJobDocuments(userData, feedback);
      setResult(refined);
      
      setCreditsMap(prev => ({
        ...prev,
        [id]: Math.max(0, (prev[id] || 3) - 1)
      }));
    } catch (e: any) {
      alert("Refinement failed: " + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!selectedPackage) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-16 px-4 text-center">
          <h1 className="text-4xl font-black mb-4">Select Your Plan</h1>
          <p className="text-gray-500 mb-12 font-medium italic">All plans include 3 full generations to get your details perfect.</p>
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
           <h2 className="text-3xl font-black mb-4 tracking-tight">AI at Work...</h2>
           <p className="text-gray-500 font-medium">Refining your documents to perfection. 15-20 seconds remaining.</p>
        </div>
      </Layout>
    );
  }

  if (result && userData) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto py-10 px-4">
          <div className="flex justify-between items-center mb-10 no-print">
            <button 
              onClick={() => {
                if (remainingCredits <= 0) {
                  alert("You have used all 3 generations. Purchase a new pack to edit details.");
                } else {
                  setResult(null);
                }
              }} 
              className="text-blue-600 font-bold hover:underline flex items-center gap-2"
            >
               <span>←</span> Edit Details
            </button>
            <div className="flex flex-col items-end">
              {isPaid ? (
                <div className="flex flex-col items-end">
                   <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-green-100 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Pro Access Active
                   </div>
                   <span className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">
                     Credits Remaining: {remainingCredits} / 3
                   </span>
                </div>
              ) : (
                <button 
                  onClick={() => setIsCheckout(true)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                >
                  🚀 Unlock Full Documents
                </button>
              )}
            </div>
          </div>
          <DocumentPreview 
            user={userData} 
            result={result} 
            packageType={selectedPackage} 
            isPreview={!isPaid}
            onUnlock={() => setIsCheckout(true)}
            onRefine={isPaid ? handleRefine : undefined}
            remainingCredits={remainingCredits}
          />
        </div>

        {isCheckout && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-blue-100 max-w-xl w-full text-center" onClick={e => e.stopPropagation()}>
              <h2 className="text-4xl font-black mb-4 tracking-tight">Ready to Apply?</h2>
              <p className="text-gray-500 mb-8 font-medium leading-relaxed">Unlock the full PDF, recruiter insights, and AI refinement tools. <strong>Includes 3 generations.</strong></p>
              <div className="bg-blue-600 p-10 rounded-3xl mb-10 text-white shadow-xl">
                 <div className="text-7xl font-black tracking-tighter">₹{PRICING[selectedPackage].price}</div>
                 <div className="mt-2 text-sm text-blue-100 font-bold uppercase tracking-widest opacity-80">One-Time Payment</div>
              </div>
              <div className="space-y-4">
                <button 
                  onClick={handleRazorpayCheckout}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition transform hover:scale-105 shadow-xl shadow-blue-200"
                >
                  Unlock Instantly
                </button>
                <button onClick={() => setIsCheckout(false)} className="block w-full text-gray-400 font-bold uppercase text-[10px] hover:text-blue-600">Maybe Later</button>
              </div>
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
          <h1 className="text-4xl font-black tracking-tight">Career Details</h1>
          <p className="text-gray-500 mt-2 font-medium">Tell us about your background to generate your documents.</p>
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
      <p className="text-gray-500 text-xl mb-20 max-w-2xl mx-auto">Pay once, use 3 times. No subscriptions or hidden fees.</p>
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
      <h1 className="text-5xl font-black text-center mb-16 tracking-tight">Common Questions</h1>
      <div className="space-y-6">
        {[
          { q: "Is this ATS friendly?", a: "Yes. Our formats are specifically designed for the software used by Indian firms like TCS, Infosys, and startups." },
          { q: "What is the '3 Generations' quota?", a: "Every purchase gives you 3 generation attempts. This includes refining your content with AI or changing your details." },
          { q: "How do I download the PDF?", a: "Once you unlock, a 'Download All' button appears. Use your browser's print dialog to 'Save as PDF'." }
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