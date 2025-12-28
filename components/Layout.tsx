
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  const isOnBuilder = location.pathname === '/builder';

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter">
                JobDoc<span className="text-gray-900">Pro</span>
              </Link>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-bold">
              <Link to="/" className={`${isActive('/') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition`}>Home</Link>
              <Link to="/samples" className={`${isActive('/samples') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition`}>Resume Samples</Link>
              <Link to="/pricing" className={`${isActive('/pricing') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition`}>Pricing</Link>
              <Link to="/faq" className={`${isActive('/faq') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition`}>FAQ</Link>
            </div>
            <div className="flex items-center gap-4">
              {!isOnBuilder && (
                <Link 
                  to="/builder"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md hover:shadow-lg transform active:scale-95"
                >
                  Create Resume
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-16 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-black mb-6 tracking-tighter">JobDocPro</h3>
              <p className="text-gray-400 max-w-sm leading-relaxed">
                Helping Indian job seekers land their dream roles with recruiter-ready documents. 
                Focus on Tier 2/3 cities and freshers. No AI skills required.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
              <ul className="space-y-4 text-gray-400 text-sm font-medium">
                <li><Link to="/samples" className="hover:text-white transition">Sample Resumes</Link></li>
                <li><Link to="/builder" className="hover:text-white transition">Resume Builder</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition">Pricing Plans</Link></li>
                <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Support</h4>
              <div className="space-y-4">
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <span className="text-green-500">WhatsApp:</span> +91 98765 43210
                </p>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <span className="text-blue-400">Email:</span> help@jobdocpro.com
                </p>
                <div className="pt-4 flex gap-4 opacity-50">
                  <span className="text-xs font-bold border border-gray-700 px-2 py-1 rounded">SSL SECURED</span>
                  <span className="text-xs font-bold border border-gray-700 px-2 py-1 rounded">24/7 SUPPORT</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-500 text-xs font-medium uppercase tracking-[2px]">
            © 2024 JobDocPro. Crafted with passion for India.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;