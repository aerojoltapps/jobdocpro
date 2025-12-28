import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useSearchParams } from 'react-router-dom';
import Layout from './components/Layout';
import ResumeForm from './components/ResumeForm';
import DocumentPreview from './components/DocumentPreview';
import Gallery from './components/Gallery';
import { UserData, DocumentResult, PackageType } from './types';
import { generateJobDocuments } from './services/geminiService';
import { PRICING } from './constants';

const SAMPLE_DATA = [
  { role: "Software Developer", img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800", tag: "Tech Choice" },
  { role: "Sales Manager", img: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=800", tag: "Growth Focus" },
  { role: "Administrative Assistant", img: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=800", tag: "Corporate Ready" }
];

// Home Page Component
const Home = () => {
  const [previewSample, setPreviewSample] = useState<typeof SAMPLE_DATA[0] | null>(null);

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
                  <Link 
                    to="/builder"
                    className="px-10 py-5 bg-blue-600 text-white text-xl font-black rounded-2xl hover:bg-blue-700 transition transform hover:scale-105 shadow-xl shadow-blue-200 text-center"
                  >
                    Build My Resume Now
                  </Link>
                  <Link 
                    to="/samples"
                    className="px-10 py-5 bg-gray-100 text-gray-900 text-xl font-bold rounded-2xl hover:bg-gray-200 transition text-center"
                  >
                    View Samples
                  </Link>
                </div>
                <div className="mt-8 flex items-center sm:justify-center lg:justify-start gap-3">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-8 h-8 rounded-full border-2 border-white" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Join <span className="text-blue-600 font-bold">1,000+ job seekers</span> this month</p>
                </div>
              </div>
              <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                 <div className="relative group cursor-pointer" onClick={() => setPreviewSample(SAMPLE_DATA[0])}>
                   <div className="absolute -inset-4 bg-blue-600/5 rounded-[2rem] blur-2xl group-hover:bg-blue-600/10 transition"></div>
                   <img src={SAMPLE_DATA[0].img} alt="Resume Preview" className="relative rounded-2xl shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-500 border-4 border-white" />
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-white px-6 py-3 rounded-xl font-bold text-blue-600 shadow-2xl">Click to Preview</span>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-4 text-center md:text-left">
              <div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Industry Samples</h2>
                <p className="text-gray-500 mt-3 text-lg">See the high-quality documents we build for every role.</p>
              </div>
              <Link to="/samples" className="text-blue-600 font-bold hover:underline flex items-center gap-2 text-lg">
                View All Samples <span className="text-xl">→</span>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {SAMPLE_DATA.map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => setPreviewSample(item)}
                  className="bg-white rounded-3xl shadow-sm hover:shadow-2xl overflow-hidden border border-gray-100 group cursor-pointer transition-all duration-300"
                >
                   <div className="relative h-64 overflow-hidden">
                      <img src={item.img} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600">
                        {item.tag}
                      </div>
                   </div>
                   <div className="p-6 flex justify-between items-center">
                      <h3 className="font-bold text-xl text-gray-900">{item.role}</h3>
                      <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {previewSample && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 animate-fadeIn" onClick={() => setPreviewSample(null)}>
            <div className="relative max-w-4xl w-full bg-white rounded-[2rem] overflow-hidden animate-scaleIn shadow-2xl" onClick={e => e.stopPropagation()}>
              <button onClick={() => setPreviewSample(null)} className="absolute top-6 right-6 bg-black/50 hover:bg-black text-white w-12 h-12 rounded-full flex items-center justify-center z-10 transition shadow-xl">✕</button>
              <div className="flex flex-col md:flex-row max-h-[90vh]">
                <div className="md:w-1/2 overflow-y-auto bg-gray-100">
                  <img src={previewSample.img} className="w-full h-auto" alt="Full Preview" />
                </div>
                <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white">
                  <span className="text-blue-600 font-black uppercase tracking-[3px] text-xs mb-4">{previewSample.tag}</span>
                  <h2 className="text-4xl font-black mb-6 tracking-tight text-gray-900">{previewSample.role}</h2>
                  <p className="text-gray-500 mb-10 leading-relaxed text-lg">Recruiter-approved template designed for impact in the Indian job market.</p>
                  <Link to="/builder" className="bg-blue-600 text-white text-center py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition shadow-xl shadow-blue-100 active:scale-95">Create My Resume Now</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

// PayPal Button Wrapper Component
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

// Main Builder Experience
const Builder = () => {
  const [searchParams] = useSearchParams();
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(searchParams.get('package') as PackageType | null);
  const [userData, setUserData] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('jdp_draft');
    return saved ? JSON.parse(saved) : null;
  });
  const [result, setResult] = useState<DocumentResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaid, setIsPaid] = useState(sessionStorage.getItem('jdp_paid') === 'true');
  const [isCheckout, setIsCheckout] = useState(false);
  const [useTestBypass, setUseTestBypass] = useState(false);

  useEffect(() => {
    if (userData) localStorage.setItem('jdp_draft', JSON.stringify(userData));
  }, [userData]);

  const getPrice = () => {
    if (!selectedPackage) return 0;
    return PRICING[selectedPackage].price;
  };

  const onFormSubmit = (data: UserData) => {
    setUserData(data);
    setIsCheckout(true); // Navigate to payment screen
    window.scrollTo(0, 0);
  };

  const handlePaymentSuccess = async () => {
    setIsPaid(true);
    setIsCheckout(false);
    sessionStorage.setItem('jdp_paid', 'true');
    await runGeneration();
  };

  const runGeneration = async () => {
    if (!userData) return;
    setIsGenerating(true);
    try {
      const generated = await generateJobDocuments(userData);
      setResult(generated);
      window.scrollTo(0, 0);
    } catch (e: any) {
      alert(e.message || "Generation error.");
    } finally {
      setIsGenerating(false);
    }
  };

  // 1. Package Selection
  if (!selectedPackage) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-16 px-4">
          <h1 className="text-4xl font-black text-center mb-12">Select Your Package</h1>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(PRICING).map(([key, val]) => (
              <div key={key} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                <h3 className="text-xl font-bold mb-4">{val.label}</h3>
                <div className="text-4xl font-black mb-8">₹{val.price}</div>
                <button onClick={() => setSelectedPackage(key as PackageType)} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">Select</button>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // 2. Loading State
  if (isGenerating) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-32 text-center animate-fadeIn">
           <div className="w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
           <h2 className="text-3xl font-black mb-4 tracking-tight">Crafting Your Career Documents...</h2>
           <p className="text-gray-500 font-medium">Our AI is analyzing your profile for the Indian market.</p>
        </div>
      </Layout>
    );
  }

  // 3. Results (Paid & Generated)
  if (result && userData && isPaid) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-10 px-4">
          <div className="flex justify-between items-center mb-10 no-print">
            <button onClick={() => { setResult(null); }} className="text-blue-600 font-bold">← Back to Details</button>
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-black">✨ PAID & SECURE</div>
          </div>
          <DocumentPreview user={userData} result={result} packageType={selectedPackage} />
        </div>
      </Layout>
    );
  }

  // 4. Checkout Screen
  if (isCheckout && userData && !isPaid) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-blue-100 animate-fadeIn">
            <h2 className="text-4xl font-black mb-4">Complete Payment</h2>
            <p className="text-gray-500 mb-8">Unlock your {selectedPackage.replace('_', ' ')} documents.</p>
            <div className="bg-blue-600 p-10 rounded-3xl mb-10 text-white">
               <div className="text-7xl font-black tracking-tighter">₹{getPrice()}</div>
            </div>
            <div className="max-w-sm mx-auto space-y-6">
              <PayPalBtn amount={getPrice()} onConfirm={handlePaymentSuccess} />
              <button onClick={() => setUseTestBypass(!useTestBypass)} className="text-[10px] text-blue-600 underline">Test Bypass</button>
              {useTestBypass && <button onClick={handlePaymentSuccess} className="w-full bg-green-50 text-green-700 py-4 rounded-xl font-black border border-green-200">🚀 Success Bypass</button>}
            </div>
            <button onClick={() => setIsCheckout(false)} className="mt-8 text-gray-400 font-bold uppercase text-[10px]">← Back to Form</button>
          </div>
        </div>
      </Layout>
    );
  }

  // 5. User Form
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-16 px-4">
        <button onClick={() => setSelectedPackage(null)} className="text-blue-600 font-bold mb-8">← Change Package</button>
        <h1 className="text-4xl font-black text-center mb-16">Enter Your Details</h1>
        <ResumeForm onSubmit={onFormSubmit} isLoading={false} initialData={userData} />
      </div>
    </Layout>
  );
};

const Pricing = () => (
  <Layout>
    <div className="max-w-7xl mx-auto py-24 px-4 text-center">
      <h1 className="text-5xl font-black mb-16">Choose Your Package</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {Object.entries(PRICING).map(([key, val]) => (
          <div key={key} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-xl font-bold mb-4">{val.label}</h3>
            <div className="text-5xl font-black mb-8">₹{val.price}</div>
            <Link to={`/builder?package=${key}`} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">Get Started</Link>
          </div>
        ))}
      </div>
    </div>
  </Layout>
);

const FAQ = () => (
  <Layout>
    <div className="max-w-3xl mx-auto py-24 px-4">
      <h1 className="text-5xl font-black text-center mb-16">FAQ</h1>
      <div className="space-y-6">
        {[
          { q: "Is it ATS-friendly?", a: "Yes, we use recruiter-tested layouts." },
          { q: "How to save as PDF?", a: "Click Print and select 'Save as PDF'." }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-black mb-2">{item.q}</h3>
            <p className="text-gray-600 font-medium">{item.a}</p>
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