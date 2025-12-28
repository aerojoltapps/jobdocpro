import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useSearchParams } from 'react-router-dom';
import Layout from './components/Layout';
import ResumeForm from './components/ResumeForm';
import DocumentPreview from './components/DocumentPreview';
import Gallery from './components/Gallery';
import { UserData, DocumentResult, PackageType } from './types';
import { generateJobDocuments } from './services/geminiService';
import { PRICING } from './constants';

// Reusable Package Card Component for consistency
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
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Most Popular</span>
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
          {isSelected ? 'Package Selected' : 'Select Plan'}
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
        <section className="relative bg-white pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <h1 className="text-4xl tracking-tight font-black text-gray-900 sm:text-5xl md:text-6xl leading-[1.1]">
                  <span className="block">Get a job-ready</span>
                  <span className="block text-blue-600">resume in 15 mins.</span>
                </h1>
                <p className="mt-6 text-base text-gray-500 sm:text-xl lg:text-lg xl:text-xl leading-relaxed">
                  Specially designed for Freshers and Tier-2/3 city candidates.
                  Recruiter-ready documents without any AI knowledge or prompt engineering.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
                  <Link to="/builder" className="px-10 py-5 bg-blue-600 text-white text-xl font-black rounded-2xl hover:bg-blue-700 transition transform hover:scale-105 shadow-xl shadow-blue-200 text-center">
                    Build My Resume Now
                  </Link>
                  <Link to="/samples" className="px-10 py-5 bg-gray-100 text-gray-900 text-xl font-bold rounded-2xl hover:bg-gray-200 transition text-center">
                    View Samples
                  </Link>
                </div>
              </div>
              <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                 <div className="relative group">
                   <div className="absolute -inset-4 bg-blue-600/5 rounded-[2rem] blur-2xl"></div>
                   <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800" alt="Resume Preview" className="relative rounded-2xl shadow-2xl border-4 border-white" />
                 </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

const PayPalBtn = ({ amount, onConfirm }: { amount: number, onConfirm: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const initPayPal = async () => {
      const paypal = (window as any).paypal;
      if (paypal && containerRef.current && isMounted) {
        containerRef.current.innerHTML = '';
        try {
          await paypal.Buttons({
            style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' },
            createOrder: (data: any, actions: any) => actions.order.create({ purchase_units: [{ amount: { value: (amount / 80).toFixed(2), currency_code: 'USD' } }] }),
            onApprove: (data: any, actions: any) => actions.order.capture().then(() => { if (isMounted) onConfirm(); }),
            onError: () => { if (isMounted) setError("Payment gateway error."); }
          }).render(containerRef.current);
        } catch (e) { if (isMounted) setError("Restriction detected."); }
      }
    };
    setTimeout(initPayPal, 1000);
    return () => { isMounted = false; };
  }, [amount]);

  if (error) return <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl">{error}</div>;
  return <div ref={containerRef} className="w-full min-h-[100px] flex items-center justify-center bg-gray-50 rounded-2xl">Loading Payment...</div>;
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
  const [useTestBypass, setUseTestBypass] = useState(false);

  // 1 Resume = 1 Payment Enforcement
  const [paidEmail, setPaidEmail] = useState(sessionStorage.getItem('paid_email') || '');
  const isPaid = userData?.email === paidEmail && paidEmail !== '';

  useEffect(() => {
    if (userData) localStorage.setItem('jdp_draft', JSON.stringify(userData));
  }, [userData]);

  const onFormSubmit = (data: UserData) => {
    setUserData(data);
    if (data.email === paidEmail) {
      runGeneration(data);
    } else {
      setIsCheckout(true);
      window.scrollTo(0, 0);
    }
  };

  const handlePaymentSuccess = async () => {
    if (userData) {
      sessionStorage.setItem('paid_email', userData.email);
      setPaidEmail(userData.email);
      setIsCheckout(false);
      await runGeneration(userData);
    }
  };

  const runGeneration = async (data: UserData) => {
    setIsGenerating(true);
    setResult(null); // Clear previous result to show fresh generation
    try {
      const generated = await generateJobDocuments(data);
      setResult(generated);
      window.scrollTo(0, 0);
    } catch (e: any) {
      alert(e.message || "Generation error.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!selectedPackage) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-16 px-4 text-center">
          <h1 className="text-4xl font-black mb-12">Select Your Package</h1>
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
           <h2 className="text-3xl font-black mb-4 tracking-tight">Crafting Your Career Documents...</h2>
           <p className="text-gray-500 font-medium">Analyzing your profile for the Indian job market.</p>
        </div>
      </Layout>
    );
  }

  if (result && userData && isPaid) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-10 px-4">
          <div className="flex justify-between items-center mb-10 no-print">
            <button onClick={() => setResult(null)} className="text-blue-600 font-bold hover:underline">← Edit Details</button>
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-green-100">✨ Session Secured</div>
          </div>
          <DocumentPreview user={userData} result={result} packageType={selectedPackage} />
        </div>
      </Layout>
    );
  }

  if (isCheckout && userData && !isPaid) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-blue-100 animate-fadeIn">
            <h2 className="text-4xl font-black mb-4">Complete Payment</h2>
            <p className="text-gray-500 mb-8 font-medium">One payment per resume (Locked to {userData.email})</p>
            <div className="bg-blue-600 p-10 rounded-3xl mb-10 text-white shadow-xl">
               <div className="text-7xl font-black tracking-tighter">₹{PRICING[selectedPackage].price}</div>
            </div>
            <div className="max-w-sm mx-auto space-y-6">
              <PayPalBtn amount={PRICING[selectedPackage].price} onConfirm={handlePaymentSuccess} />
              <button onClick={() => setUseTestBypass(!useTestBypass)} className="text-[10px] text-blue-600 underline uppercase font-bold opacity-30">Test Bypass</button>
              {useTestBypass && <button onClick={handlePaymentSuccess} className="w-full bg-green-50 text-green-700 py-4 rounded-xl font-black border border-green-200">🚀 Success Bypass</button>}
            </div>
            <button onClick={() => setIsCheckout(false)} className="mt-8 text-gray-400 font-bold uppercase text-[10px] hover:text-blue-600 transition">← Back to Form</button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-16 px-4">
        <button onClick={() => setSelectedPackage(null)} className="text-blue-600 font-bold mb-8 hover:underline">← Change Package</button>
        <h1 className="text-4xl font-black text-center mb-16 tracking-tight">Enter Your Details</h1>
        <ResumeForm onSubmit={onFormSubmit} isLoading={isGenerating} initialData={userData} />
      </div>
    </Layout>
  );
};

const Pricing = () => (
  <Layout>
    <div className="max-w-7xl mx-auto py-24 px-4 text-center">
      <h1 className="text-5xl font-black mb-6 tracking-tight text-gray-900">Simple, Transparent Pricing</h1>
      <p className="text-gray-500 text-xl mb-20 max-w-2xl mx-auto">One payment per document. Choose your level of career boost.</p>
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
          { q: "How many resumes can I generate?", a: "Each payment is linked to one email address and allows unlimited edits/regeneration for that specific user's details within the session." },
          { q: "Is it ATS-friendly?", a: "Yes, our formats are rigorously tested for Indian hiring systems." },
          { q: "Can I upgrade later?", a: "Currently, each package is separate. We recommend the Job Ready Pack for the best value." }
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