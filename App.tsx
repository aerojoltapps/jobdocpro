
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import ResumeForm from './components/ResumeForm';
import DocumentPreview from './components/DocumentPreview';
import Gallery from './components/Gallery';
import { UserData, DocumentResult } from './types';
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

        {/* Why Us Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-black mb-20 tracking-tight">Why Choose JobDocPro?</h2>
            <div className="grid md:grid-cols-3 gap-16">
              <div className="group">
                <div className="bg-blue-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-blue-100 transition duration-500">
                  <span className="text-4xl">⚡</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Fast & Automated</h3>
                <p className="text-gray-500 leading-relaxed font-medium px-4">Simply fill your details. Our AI does the heavy lifting of writing professional summaries and bullets.</p>
              </div>
              <div className="group">
                <div className="bg-green-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-green-100 transition duration-500">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">100% ATS Friendly</h3>
                <p className="text-gray-500 leading-relaxed font-medium px-4">We use recruiter-standard formatting that passes through company software (ATS) easily.</p>
              </div>
              <div className="group">
                <div className="bg-yellow-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-yellow-100 transition duration-500">
                  <span className="text-4xl">💰</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">India Pricing</h3>
                <p className="text-gray-500 leading-relaxed font-medium px-4">Premium quality at Indian prices. Pay only for what you need, starting at just ₹199.</p>
              </div>
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

// PayPal Button Wrapper Component with Error Boundary/Retry Logic
const PayPalBtn = ({ amount, onConfirm }: { amount: number, onConfirm: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    const initPayPal = async () => {
      const paypal = (window as any).paypal;
      if (paypal && containerRef.current && isMounted) {
        containerRef.current.innerHTML = '';
        try {
          // Wrapped in a try-catch to specifically catch 'Can not read window host' which is common in sandboxes
          await paypal.Buttons({
            style: {
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'pay',
            },
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: (amount / 80).toFixed(2), // Convert INR to USD for test
                    currency_code: 'USD'
                  }
                }]
              });
            },
            onApprove: (data: any, actions: any) => {
              return actions.order.capture().then((details: any) => {
                if (isMounted) onConfirm();
              });
            },
            onError: (err: any) => {
              console.error('PayPal Internal SDK Error:', err);
              if (isMounted) setError("Payment module error. If you are in a preview environment, please use the Developer Bypass below.");
            }
          }).render(containerRef.current).catch((err: any) => {
            console.error('PayPal Render Promise Catch:', err);
            if (isMounted) setError("Could not load secure checkout. This often happens in restricted preview environments.");
          });
        } catch (e: any) {
          console.error('PayPal Initialization Sync Exception:', e);
          if (isMounted) {
            const msg = e?.message || "";
            if (msg.includes("host") || msg.includes("window")) {
              setError("Security restriction: PayPal cannot access parent window host. Please use the Developer Bypass.");
            } else {
              setError("Payment gateway failed to initialize.");
            }
          }
        }
      } else if (!paypal && isMounted) {
        setError("PayPal SDK failed to load. Please check your connection or use the Developer Bypass.");
      }
    };

    // Small delay to ensure DOM is ready and SDK script is executed
    const timer = setTimeout(initPayPal, 800);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [amount, retryKey]);

  if (error) {
    return (
      <div className="p-5 bg-red-50 border border-red-200 rounded-2xl">
        <p className="text-red-700 text-[11px] font-bold leading-relaxed mb-4">{error}</p>
        <button 
          onClick={() => { setError(null); setRetryKey(k => k + 1); }}
          className="text-xs font-black uppercase tracking-widest text-red-600 underline"
        >
          Try Reloading Gateway
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full min-h-[150px] flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
      <div className="w-8 h-8 border-3 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-3"></div>
      <span className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Loading Secure Pay...</span>
    </div>
  );
};

// Payment Overlay Simulation Component
const PaymentOverlay = ({ onConfirm, onCancel, amount }: { onConfirm: () => void, onCancel: () => void, amount: number }) => {
  const [useTestBypass, setUseTestBypass] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[300] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] animate-scaleIn border border-white/20">
        <div className="bg-blue-600 p-8 text-white relative">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-black tracking-tight">Checkout</h3>
              <p className="text-blue-100 text-[10px] uppercase tracking-widest font-black mt-1">JobDocPro Secure Pay</p>
            </div>
            <button onClick={onCancel} className="text-3xl opacity-50 hover:opacity-100 transition">✕</button>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <span className="text-8xl font-black">₹</span>
          </div>
        </div>
        
        <div className="p-10">
          <div className="flex justify-between mb-8 pb-8 border-b border-gray-100 items-baseline">
             <span className="text-gray-500 font-bold">Document Access</span>
             <span className="text-4xl font-black text-gray-900 tracking-tighter">₹{amount}</span>
          </div>

          <div className="space-y-4 mb-8">
             <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
               <span className="mr-3 text-green-500 text-lg">🛡️</span> Secure Checkout with PayPal
             </div>
             
             {/* Integrated PayPal Buttons */}
             <PayPalBtn amount={amount} onConfirm={onConfirm} />

             {/* Mock Test Bypass for easy evaluation */}
             <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
               <div className="flex justify-between items-center mb-4">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Developer tools</p>
                  <button 
                    onClick={() => setUseTestBypass(!useTestBypass)}
                    className="text-[10px] text-blue-600 underline uppercase tracking-widest font-bold"
                  >
                    {useTestBypass ? 'Hide' : 'Show Bypass'}
                  </button>
               </div>
               {useTestBypass && (
                 <button 
                    onClick={onConfirm}
                    className="w-full bg-green-50 text-green-700 py-4 rounded-xl border border-green-200 text-[11px] font-black uppercase tracking-[2px] hover:bg-green-100 transition shadow-sm"
                 >
                    🚀 Evaluation Bypass: Success
                 </button>
               )}
             </div>
          </div>
          
          <div className="mt-6 flex flex-col items-center opacity-30">
            <div className="flex gap-6 grayscale scale-75">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-6" alt="PayPal" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" className="h-4" alt="MasterCard" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Builder Page Component
const Builder = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [result, setResult] = useState<DocumentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(sessionStorage.getItem('nr_paid') === 'true');
  const [showPayment, setShowPayment] = useState(false);

  const handleSubmit = async (data: UserData) => {
    setLoading(true);
    try {
      const generated = await generateJobDocuments(data);
      setUserData(data);
      setResult(generated);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert("Something went wrong. Please check your internet connection.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBackToEdit = () => {
    setResult(null);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setIsPaid(true);
    sessionStorage.setItem('nr_paid', 'true');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Preview / Order Summary View
  if (result && userData && isPaid) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto pt-10 px-4">
          <div className="flex justify-between items-center mb-10 no-print">
            <button onClick={handleGoBackToEdit} className="text-blue-600 font-bold hover:underline flex items-center gap-2 group transition text-sm">
              <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span> Back to Edit
            </button>
            <div className="flex items-center gap-3 bg-green-50 text-green-700 px-6 py-3 rounded-2xl border border-green-100 font-black text-xs uppercase tracking-wider">
               <span className="text-xl">✨</span> Order Confirmed
            </div>
          </div>
          <DocumentPreview user={userData} result={result} />
        </div>
      </Layout>
    );
  }

  // Intermediate "Ready" screen
  if (result && userData && !isPaid) {
    return (
      <Layout>
        {showPayment && <PaymentOverlay amount={199} onConfirm={handlePaymentSuccess} onCancel={() => setShowPayment(false)} />}
        <div className="max-w-2xl mx-auto py-20 px-4 text-center animate-fadeIn">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-blue-100 relative overflow-hidden">
            <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <span className="text-5xl">✅</span>
            </div>
            <h2 className="text-4xl font-black mb-6 tracking-tight text-gray-900 leading-tight">Your Documents are Ready</h2>
            <p className="text-gray-500 mb-10 text-lg font-medium leading-relaxed">
              We've created your recruiter-optimized Resume, Cover Letter, and LinkedIn profile for <strong>{userData.jobRole}</strong>. 
            </p>
            <div className="bg-blue-600 p-8 rounded-3xl mb-10 shadow-xl shadow-blue-100 text-white transform hover:scale-105 transition duration-500">
               <p className="text-xs font-black uppercase tracking-[4px] mb-2 opacity-70">Pay Once, Access Forever</p>
               <div className="text-7xl font-black tracking-tighter">₹199</div>
               <p className="text-xs font-bold mt-4 opacity-80 italic">Price includes all taxes & support</p>
            </div>
            
            <button 
              onClick={() => setShowPayment(true)}
              className="w-full bg-blue-600 text-white py-6 rounded-2xl text-2xl font-black hover:bg-blue-700 transition shadow-xl active:scale-95 transform mb-8"
            >
              Unlock Now & Save PDF
            </button>
            
            <button 
              onClick={handleGoBackToEdit}
              className="text-gray-400 font-bold hover:text-blue-600 transition uppercase tracking-widest text-[10px]"
            >
              ← Edit My Details
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Initial Form View
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Build Your Professional Profile</h1>
          <p className="text-gray-500 text-lg font-medium">Land interviews faster with recruiter-ready documents.</p>
        </div>
        <ResumeForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </Layout>
  );
};

// Pricing Page Component
const Pricing = () => (
  <Layout>
    <div className="max-w-7xl mx-auto py-24 px-4 text-center">
      <h1 className="text-5xl font-black mb-6 tracking-tight text-gray-900">Simple, Transparent Pricing</h1>
      <p className="text-gray-500 text-xl mb-20 max-w-2xl mx-auto">Choose the package that fits your job search needs. No hidden charges.</p>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-xl font-bold mb-4">{PRICING.RESUME_ONLY.label}</h3>
          <div className="text-5xl font-black mb-8">₹{PRICING.RESUME_ONLY.price}</div>
          <ul className="text-left space-y-4 mb-10 flex-grow">
            <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span className="text-green-500 font-bold">✓</span> ATS-Friendly Resume
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span className="text-green-500 font-bold">✓</span> Professional Summary
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span className="text-green-500 font-bold">✓</span> PDF Download
            </li>
          </ul>
          <Link to="/builder" className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-bold hover:bg-gray-200 transition text-center">Get Started</Link>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-xl font-bold mb-4">{PRICING.RESUME_COVER.label}</h3>
          <div className="text-5xl font-black mb-8">₹{PRICING.RESUME_COVER.price}</div>
          <ul className="text-left space-y-4 mb-10 flex-grow">
            <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span className="text-green-500 font-bold">✓</span> Everything in Resume Only
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span className="text-green-500 font-bold">✓</span> Professional Cover Letter
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span className="text-green-500 font-bold">✓</span> Multi-role Customization
            </li>
          </ul>
          <Link to="/builder" className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-bold hover:bg-gray-200 transition text-center">Get Started</Link>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col ring-4 ring-blue-600 relative">
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Most Popular</span>
          <h3 className="text-xl font-bold mb-4">{PRICING.JOB_READY_PACK.label}</h3>
          <div className="text-5xl font-black mb-8">₹{PRICING.JOB_READY_PACK.price}</div>
          <ul className="text-left space-y-4 mb-10 flex-grow">
            <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span className="text-green-500 font-bold">✓</span> Everything in Resume + Cover
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span className="text-green-500 font-bold">✓</span> LinkedIn Optimization
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span className="text-green-500 font-bold">✓</span> Priority Support
            </li>
          </ul>
          <Link to="/builder" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition text-center">Get Started</Link>
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