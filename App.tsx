import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useSearchParams } from 'react-router-dom';
import Layout from './components/Layout';
import ResumeForm from './components/ResumeForm';
import DocumentPreview from './components/DocumentPreview';
import Gallery from './components/Gallery';
import { UserData, DocumentResult, PackageType } from './types';
import { generateJobDocuments } from './services/geminiService';
import { PRICING, RAZORPAY_KEY_ID } from './constants';

const SAMPLE_DATA = [
  { role: "Software Developer", img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800", tag: "Tech Choice" },
  { role: "Sales Manager", img: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=800", tag: "Growth Focus" },
  { role: "Administrative Assistant", img: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=800", tag: "Corporate Ready" }
];

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
              </div>
              <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                 <div className="relative group">
                   <div className="absolute -inset-4 bg-blue-600/5 rounded-[2rem] blur-2xl group-hover:bg-blue-600/10 transition"></div>
                   <img src={SAMPLE_DATA[0].img} alt="Resume Preview" className="relative rounded-2xl shadow-2xl border-4 border-white" />
                 </div>
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
  const remainingDownloads = 2 - usageCount;

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
      alert("Razorpay SDK not loaded. Please check your internet connection.");
      return;
    }

    if (RAZORPAY_KEY_ID === 'rzp_test_YOUR_KEY_HERE') {
      alert("Please configure your RAZORPAY_KEY_ID in constants.ts first!");
      return;
    }

    const amount = PRICING[selectedPackage].price;
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: "JobDocPro",
      description: `Job Ready Pack - ${PRICING[selectedPackage].label}`,
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
      notes: {
        package: selectedPackage,
        role: userData.jobRole
      },
      theme: {
        color: "#2563eb"
      }
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      alert("Something went wrong with Razorpay. Please ensure your Key ID is correct.");
    }
  };

  const onFormSubmit = (data: UserData) => {
    setUserData(data);
    const id = getIdentifier(data.email, data.phone);
    const count = usageMap[id] || 0;
    
    if (paidIdentifiers.includes(id) && count < 2) {
      runGeneration(data);
    } else {
      setIsCheckout(true);
      window.scrollTo(0, 0);
    }
  };

  const handlePaymentSuccess = async () => {
    if (userData) {
      const id = getIdentifier(userData.email, userData.phone);
      
      setUsageMap(prev => ({
        ...prev,
        [id]: 0
      }));

      if (!paidIdentifiers.includes(id)) {
        setPaidIdentifiers(prev => [...prev, id]);
      }
      
      setIsCheckout(false);
      await runGeneration(userData);
    }
  };

  const runGeneration = async (data: UserData) => {
    setIsGenerating(true);
    setResult(null);
    try {
      const generated = await generateJobDocuments(data);
      const id = getIdentifier(data.email, data.phone);
      
      setUsageMap(prev => ({
        ...prev,
        [id]: (prev[id] || 0) + 1
      }));
      
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
           <p className="text-gray-500 font-medium">Using recruiter-approved algorithms for the Indian market.</p>
        </div>
      </Layout>
    );
  }

  if (result && userData && isPaid && usageCount <= 2) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-10 px-4">
          <div className="flex justify-between items-center mb-10 no-print">
            <button onClick={() => setResult(null)} className="text-blue-600 font-bold hover:underline">← Edit Details</button>
            <div className="flex flex-col items-end">
              <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-green-100">✨ Access Verified</div>
              <span className="text-[10px] text-gray-400 mt-1 font-bold uppercase">Downloads remaining: {Math.max(0, remainingDownloads)}</span>
            </div>
          </div>
          <DocumentPreview user={userData} result={result} packageType={selectedPackage} />
        </div>
      </Layout>
    );
  }

  if (isCheckout && userData) {
    const isRenewing = isPaid && usageCount >= 2;
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-blue-100 animate-fadeIn">
            <h2 className="text-4xl font-black mb-4">{isRenewing ? 'Renew Quota' : 'Complete Payment'}</h2>
            <p className="text-gray-500 mb-8 font-medium">
              {isRenewing 
                ? 'Your previous 2-download quota for this email/phone is finished. Pay again to get 2 fresh downloads.' 
                : `Ready to generate documents for: ${userData.email}`}
            </p>
            <div className="bg-blue-600 p-10 rounded-3xl mb-10 text-white shadow-xl">
               <div className="text-7xl font-black tracking-tighter">₹{PRICING[selectedPackage].price}</div>
               <div className="mt-2 text-sm text-blue-100 font-bold uppercase tracking-widest opacity-80">Includes 2 Generations</div>
            </div>
            <div className="max-w-sm mx-auto space-y-6">
              <button 
                onClick={handleRazorpayCheckout}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition transform hover:scale-105 shadow-xl shadow-blue-200"
              >
                Pay with Razorpay
              </button>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Secure Transaction via Razorpay</p>
            </div>
            <button onClick={() => setIsCheckout(false)} className="mt-8 text-gray-400 font-bold uppercase text-[10px] hover:text-blue-600">← Back to Form</button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-16 px-4">
        <button onClick={() => setSelectedPackage(null)} className="text-blue-600 font-bold mb-8 hover:underline">← Change Package</button>
        <div className="text-center mb-16">
          <span className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            Current Plan: {PRICING[selectedPackage].label}
          </span>
          <h1 className="text-4xl font-black tracking-tight">Enter Your Details</h1>
        </div>
        <ResumeForm onSubmit={onFormSubmit} isLoading={isGenerating} initialData={userData} />
      </div>
    </Layout>
  );
};

const Pricing = () => (
  <Layout>
    <div className="max-w-7xl mx-auto py-24 px-4 text-center">
      <h1 className="text-5xl font-black mb-6 tracking-tight text-gray-900">Simple, Transparent Pricing</h1>
      <p className="text-gray-500 text-xl mb-20 max-w-2xl mx-auto">One payment per document. Each purchase includes 2 full generations.</p>
      
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
          { q: "How many resumes can I generate?", a: "Each payment allows up to 2 generations for the same Email + Phone combination. Once exhausted, you can simply pay again to get 2 more." },
          { q: "Is it ATS-friendly?", a: "Yes, our formats are rigorously tested for Indian hiring systems." },
          { q: "What if I need to change my details?", a: "You can edit your details as many times as you want before using your 2nd generation." }
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