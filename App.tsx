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
        {/* Hero Section */}
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

        {/* Gallery Preview */}
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
        
        {/* Modal logic for Home page previews */}
        {previewSample && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 animate-fadeIn" onClick={() => setPreviewSample(null)}>
            <div className="relative max-w-4xl w-full bg-white rounded-[2rem] overflow-hidden animate-scaleIn shadow-2xl" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setPreviewSample(null)}
                className="absolute top-6 right-6 bg-black/50 hover:bg-black text-white w-12 h-12 rounded-full flex items-center justify-center z-10 transition shadow-xl"
              >
                ✕
              </button>
              <div className="flex flex-col md:flex-row max-h-[90vh]">
                <div className="md:w-1/2 overflow-y-auto bg-gray-100">
                  <img src={previewSample.img} className="w-full h-auto" alt="Full Preview" />
                </div>
                <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white">
                  <span className="text-blue-600 font-black uppercase tracking-[3px] text-xs mb-4">{previewSample.tag}</span>
                  <h2 className="text-4xl font-black mb-6 tracking-tight text-gray-900">{previewSample.role}</h2>
                  <p className="text-gray-500 mb-10 leading-relaxed text-lg">
                    This recruiter-approved template is designed for impact. It focuses on your unique strengths and achievements, ensuring you stand out in the Indian job market.
                  </p>
                  <Link 
                    to="/builder" 
                    className="bg-blue-600 text-white text-center py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition shadow-xl shadow-blue-100 active:scale-95"
                  >
                    Create My Resume Now
                  </Link>
                  <p className="mt-6 text-center text-gray-400 text-sm font-medium">Ready in less than 15 minutes</p>
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
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const errorHandler = (event: ErrorEvent | PromiseRejectionEvent) => {
      const message = (event instanceof ErrorEvent) ? event.message : (event as any).reason?.message;
      if (message && (message.includes('host') || message.includes('PayPal'))) {
        if (event instanceof ErrorEvent) event.preventDefault();
        return true;
      }
    };
    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', errorHandler);

    const initPayPal = async () => {
      const paypal = (window as any).paypal;
      if (paypal && containerRef.current && isMounted) {
        containerRef.current.innerHTML = '';
        try {
          await paypal.Buttons({
            style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' },
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [{ amount: { value: (amount / 80).toFixed(2), currency_code: 'USD' } }]
              });
            },
            onApprove: (data: any, actions: any) => {
              return actions.order.capture().then(() => { if (isMounted) onConfirm(); });
            },
            onError: (err: any) => { if (isMounted) setError("Checkout restricted in this environment."); }
          }).render(containerRef.current);
        } catch (e: any) { if (isMounted) setError("Environment restriction detected."); }
      }
    };
    const timer = setTimeout(initPayPal, 1000);
    return () => {
      isMounted = false;
      clearTimeout(timer);
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', errorHandler);
    };
  }, [amount, retryKey]);

  if (error) {
    return (
      <div className="p-5 bg-red-50 border border-red-200 rounded-2xl">
        <p className="text-red-700 text-[11px] font-bold mb-4">{error}</p>
        <button onClick={() => { setError(null); setRetryKey(k => k + 1); }} className="text-xs font-black uppercase text-red-600 underline">Retry Load</button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full min-h-[150px] flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
      <div className="w-8 h-8 border-3 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-3"></div>
      <span className="text-[10px] font-black uppercase text-gray-400">Secure Gateway...</span>
    </div>
  );
};

// Payment Overlay Simulation Component
const PaymentOverlay = ({ onConfirm, onCancel, amount }: { onConfirm: () => void, onCancel: () => void, amount: number }) => {
  const [useTestBypass, setUseTestBypass] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[300] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-scaleIn border border-white/20">
        <div className="bg-blue-600 p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-black">Checkout</h3>
              <p className="text-blue-100 text-[10px] uppercase tracking-widest font-black mt-1">JobDocPro Secure Pay</p>
            </div>
            <button onClick={onCancel} className="text-3xl opacity-50 hover:opacity-100">✕</button>
          </div>
        </div>
        <div className="p-10">
          <div className="flex justify-between mb-8 pb-8 border-b border-gray-100 items-baseline">
             <span className="text-gray-500 font-bold">Document Access</span>
             <span className="text-4xl font-black text-gray-900 tracking-tighter">₹{amount}</span>
          </div>
          <PayPalBtn amount={amount} onConfirm={onConfirm} />
          <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
            <button onClick={() => setUseTestBypass(!useTestBypass)} className="text-[10px] text-blue-600 underline uppercase tracking-widest font-bold">
              {useTestBypass ? 'Hide' : 'Show Success Bypass'}
            </button>
            {useTestBypass && (
              <button onClick={onConfirm} className="w-full mt-4 bg-green-50 text-green-700 py-4 rounded-xl border border-green-200 text-[11px] font-black uppercase">🚀 Success Bypass</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Builder Page Component
const Builder = () => {
  const [searchParams] = useSearchParams();
  const initialPackage = searchParams.get('package') as PackageType | null;

  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(initialPackage);
  const [userData, setUserData] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('jdp_draft');
    return saved ? JSON.parse(saved) : null;
  });
  const [result, setResult] = useState<DocumentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(sessionStorage.getItem('nr_paid') === 'true');
  const [showPayment, setShowPayment] = useState(false);

  // Sync draft to local storage
  useEffect(() => {
    if (userData) {
      localStorage.setItem('jdp_draft', JSON.stringify(userData));
    }
  }, [userData]);

  const getPrice = () => {
    if (!selectedPackage) return 0;
    if (selectedPackage === PackageType.RESUME_ONLY) return PRICING.RESUME_ONLY.price;
    if (selectedPackage === PackageType.RESUME_COVER) return PRICING.RESUME_COVER.price;
    return PRICING.JOB_READY_PACK.price;
  };

  const handleSubmit = async (data: UserData) => {
    setUserData(data); // Save the latest data immediately
    setLoading(true);
    try {
      const generated = await generateJobDocuments(data);
      setResult(generated);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      alert(error.message || "Something went wrong while generating documents.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setIsPaid(true);
    sessionStorage.setItem('nr_paid', 'true');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Package Selection Step
  if (!selectedPackage) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-16 px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Select Your Document Package</h1>
            <p className="text-gray-500 text-lg">Choose what you need to land your next job.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col hover:border-blue-200 transition">
              <h3 className="text-xl font-bold mb-4">{PRICING.RESUME_ONLY.label}</h3>
              <div className="text-4xl font-black mb-6">₹{PRICING.RESUME_ONLY.price}</div>
              <ul className="text-left space-y-3 mb-8 flex-grow text-sm text-gray-600 font-medium">
                <li>✓ Professional Resume</li>
                <li>✓ ATS Optimization</li>
                <li>✓ PDF Format</li>
              </ul>
              <button onClick={() => setSelectedPackage(PackageType.RESUME_ONLY)} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition">Select Package</button>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-blue-600 flex flex-col relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Recommended</span>
              <h3 className="text-xl font-bold mb-4">{PRICING.RESUME_COVER.label}</h3>
              <div className="text-4xl font-black mb-6">₹{PRICING.RESUME_COVER.price}</div>
              <ul className="text-left space-y-3 mb-8 flex-grow text-sm text-gray-600 font-medium">
                <li>✓ Professional Resume</li>
                <li>✓ Professional Cover Letter</li>
                <li>✓ ATS Optimization</li>
              </ul>
              <button onClick={() => setSelectedPackage(PackageType.RESUME_COVER)} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition">Select Package</button>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col hover:border-blue-200 transition">
              <h3 className="text-xl font-bold mb-4">{PRICING.JOB_READY_PACK.label}</h3>
              <div className="text-4xl font-black mb-6">₹{PRICING.JOB_READY_PACK.price}</div>
              <ul className="text-left space-y-3 mb-8 flex-grow text-sm text-gray-600 font-medium">
                <li>✓ Professional Resume</li>
                <li>✓ Professional Cover Letter</li>
                <li>✓ LinkedIn Optimization</li>
                <li>✓ Priority Support</li>
              </ul>
              <button onClick={() => setSelectedPackage(PackageType.JOB_READY_PACK)} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition">Select Package</button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // 4. Final Preview Step
  if (result && userData && isPaid) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto pt-10 px-4">
          <div className="flex justify-between items-center mb-10 no-print">
            <button onClick={() => setResult(null)} className="text-blue-600 font-bold hover:underline">← Back to Edit</button>
            <div className="bg-green-50 text-green-700 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider">✨ Order Confirmed</div>
          </div>
          <DocumentPreview user={userData} result={result} packageType={selectedPackage} />
        </div>
      </Layout>
    );
  }

  // 3. Checkout Screen Step
  if (result && userData && !isPaid) {
    return (
      <Layout>
        {showPayment && <PaymentOverlay amount={getPrice()} onConfirm={handlePaymentSuccess} onCancel={() => setShowPayment(false)} />}
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-blue-100">
            <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8"><span className="text-4xl">✅</span></div>
            <h2 className="text-4xl font-black mb-6 tracking-tight">Documents are Ready</h2>
            <div className="bg-blue-600 p-8 rounded-3xl mb-10 shadow-xl text-white">
               <p className="text-xs font-black uppercase tracking-[4px] mb-2 opacity-70">Pay Once, Access Forever</p>
               <div className="text-7xl font-black tracking-tighter">₹{getPrice()}</div>
            </div>
            <button onClick={() => setShowPayment(true)} className="w-full bg-blue-600 text-white py-6 rounded-2xl text-2xl font-black hover:bg-blue-700 transition shadow-xl mb-6">Unlock Documents</button>
            <button onClick={() => setResult(null)} className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">← Back to Edit</button>
          </div>
        </div>
      </Layout>
    );
  }

  // 2. Form Step
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="flex justify-between items-center mb-8">
            <button onClick={() => setSelectedPackage(null)} className="text-blue-600 font-bold hover:underline flex items-center gap-1">
              <span className="text-xl">←</span> Change Package
            </button>
            <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
              <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Selected: {selectedPackage.replace('_', ' ')}</span>
            </div>
        </div>
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Complete Your Details</h1>
          <p className="text-gray-500 text-lg font-medium">Land your dream role as a {userData?.jobRole || 'Professional'}</p>
        </div>
        <ResumeForm 
          key={result ? 'hidden' : 'visible'} 
          onSubmit={handleSubmit} 
          isLoading={loading} 
          initialData={userData} 
        />
      </div>
    </Layout>
  );
};

// Pricing Page Component
const Pricing = () => (
  <Layout>
    <div className="max-w-7xl mx-auto py-24 px-4 text-center">
      <h1 className="text-5xl font-black mb-6 tracking-tight text-gray-900">Simple, Transparent Pricing</h1>
      <p className="text-gray-500 text-xl mb-20 max-w-2xl mx-auto">Choose the package that fits your job search needs.</p>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-xl font-bold mb-4">{PRICING.RESUME_ONLY.label}</h3>
          <div className="text-5xl font-black mb-8">₹{PRICING.RESUME_ONLY.price}</div>
          <ul className="text-left space-y-4 mb-10 flex-grow text-sm text-gray-600 font-medium">
            <li>✓ ATS-Friendly Resume</li>
            <li>✓ Professional Summary</li>
            <li>✓ PDF Download</li>
          </ul>
          <Link to={`/builder?package=${PackageType.RESUME_ONLY}`} className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-bold hover:bg-gray-200 transition text-center">Get Started</Link>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-xl font-bold mb-4">{PRICING.RESUME_COVER.label}</h3>
          <div className="text-5xl font-black mb-8">₹{PRICING.RESUME_COVER.price}</div>
          <ul className="text-left space-y-4 mb-10 flex-grow text-sm text-gray-600 font-medium">
            <li>✓ Everything in Resume Only</li>
            <li>✓ Professional Cover Letter</li>
            <li>✓ Multi-role Customization</li>
          </ul>
          <Link to={`/builder?package=${PackageType.RESUME_COVER}`} className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-bold hover:bg-gray-200 transition text-center">Get Started</Link>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col ring-4 ring-blue-600 relative">
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Most Popular</span>
          <h3 className="text-xl font-bold mb-4">{PRICING.JOB_READY_PACK.label}</h3>
          <div className="text-5xl font-black mb-8">₹{PRICING.JOB_READY_PACK.price}</div>
          <ul className="text-left space-y-4 mb-10 flex-grow text-sm text-gray-600 font-medium">
            <li>✓ Everything in Resume + Cover</li>
            <li>✓ LinkedIn Optimization</li>
            <li>✓ Priority Support</li>
          </ul>
          <Link to={`/builder?package=${PackageType.JOB_READY_PACK}`} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition text-center">Get Started</Link>
        </div>
      </div>
    </div>
  </Layout>
);

// FAQ Page component
const FAQ = () => (
  <Layout>
    <div className="max-w-3xl mx-auto py-24 px-4">
      <h1 className="text-5xl font-black text-center mb-16 tracking-tight text-gray-900">Questions?</h1>
      <div className="space-y-8">
        {[
          { q: "Is this resume ATS-friendly?", a: "Absolutely. We avoid complex graphics or tables that break Applicant Tracking Systems. Our format is tested against common Indian hiring tools." },
          { q: "How do I save it as a PDF?", a: "Once your payment is successful, simply click the 'Print / Save as PDF' button. In the window that opens, choose 'Save as PDF' from the printer dropdown list." },
          { q: "What if I don't like it?", a: "We offer a 'No Questions Asked' refund if you find any technical issues with your document format within 24 hours." },
          { q: "Is my personal data stored?", a: "No. Your privacy is our priority. We process your data in real-time and it is cleared the moment you close the tab." }
        ].map((item, i) => (
          <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors duration-300">
            <h3 className="text-xl font-black mb-4 text-gray-900 leading-tight">{item.q}</h3>
            <p className="text-gray-600 leading-relaxed font-medium">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  </Layout>
);

const App: React.FC = () => {
  return (
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
};

export default App;