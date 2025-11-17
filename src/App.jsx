import React, { useState, useRef, useEffect } from 'react';

// --- Firebase Imports ---
// This imports the functions from your locally created firebase.js file
import { 
  auth, 
  provider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from './firebase.js';

// --- SVG Icons ---
// Using simple functional components for SVG icons
const ChartBar = ({ className = "w-6 h-6 text-[#1A2A4C]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 0120.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 21.945V11H3.055A9.001 9.001 0 0013 21.945z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.512 15H10v5.488A9.025 9.025 0 014.512 15z" />
  </svg>
);

const PresentationChart = ({ className = "w-6 h-6 text-[#1A2A4C]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const Target = ({ className = "w-6 h-6 text-[#1A2A4C]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.474 1.524-.986 2.94-1.534 4.235M19.542 12c-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7 .474-1.524.986 2.94 1.534-4.235" />
  </svg>
);

const Sparkles = ({ className = "w-6 h-6 text-[#1A2A4C]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M17 3v4M19 5h-4M14 17v4M16 19h-4M5 17v4M3 19h4M12 9a3 3 0 100-6 3 3 0 000 6zM12 21a3 3 0 100-6 3 3 0 000 6zM3 12a3 3 0 100-6 3 3 0 000 6zM21 12a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
);

const HomeIcon = ({ className = "w-6 h-6 text-[#1A2A4C]" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3M7 21h10a1 1 0 001-1V11M4 21h16" />
  </svg>
);


// --- App Configuration ---
const appsConfig = [
  {
    id: "grow",
    name: "GROW Coaching",
    description: "Your hub for development planning, 1:1 notes, and tracking personal goals.",
    url: "#", // Placeholder URL
    icon: <Sparkles />,
    category: "Coaching",
    isEnabled: true,
  },
  {
    id: "demo-scoring",
    name: "Demo Scoring",
    description: "Upload call transcripts and compare LLM, self, and manager scores to drive coaching.",
    url: "#", // Placeholder URL
    icon: <PresentationChart />,
    category: "Demos & Coaching",
    isEnabled: true,
  },
  {
    id: "quota",
    name: "Quota Attainment Tracker",
    description: "Track your real-time progress against quota targets and performance metrics.",
    url: "#", // Placeholder URL
    icon: <Target />,
    category: "Performance",
    isEnabled: true,
  },
  {
    id: "contribution",
    name: "SE Contribution to Sales",
    description: "Analyze your impact on pipeline generation and revenue contribution.",
    url: "#", // Placeholder URL
    icon: <ChartBar />,
    category: "Performance",
    isEnabled: true,
  },
  {
    id: "homerun",
    name: "Home Run Presales",
    description: "Your SE Workspace.",
    url: "#", // Placeholder URL
    icon: <HomeIcon />,
    category: "Workspace",
    isEnabled: false,
  }
];

// --- NEW: Allowed Domains List ---
// This is your new, scalable list of approved domains.
// Add any new domains (like 'simpro.au') here.
const allowedDomains = [
  '@simprogroup.com',
  '@simpro.co.uk' ,
  '@simpro.au' ,
  '@bigchange.com' ,
];

// --- Main App Component ---
export default function App() {
  // --- NEW: Real Auth State ---
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  
  const appsRef = useRef(null);

  // --- NEW: Real Auth Listener ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in
        
        // --- UPDATED: Multi-Domain Security Check ---
        // We check if the user's email ends with *any* of the domains in our list
        const isEmailAllowed = allowedDomains.some(domain => currentUser.email.endsWith(domain));

        if (isEmailAllowed) {
          setUser(currentUser);
        } else {
          // If their email is not in the list, sign them out and show an error.
          setAuthError(`Access restricted. Please sign in with one of the following domains: ${allowedDomains.join(', ')}`);
          signOut(auth); // Sign them out
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []); // The empty array [] means this effect runs only once

  // --- NEW: Real Login Handler ---
  const handleLogin = async () => {
    setAuthError(null);
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in cancelled.');
      } else if (error.code === 'auth/cancelled-popup-request') {
         // This is fine, just means a second popup was triggered
      } else if (error.code === 'auth/operation-not-allowed') {
        setAuthError('Sign-in from this domain is not allowed.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        setAuthError('An account already exists with this email. Please sign in using the method you originally used.');
      } else {
        setAuthError('An unknown error occurred. Please try again.');
        console.error(error);
      }
      setIsLoading(false);
    }
  };

  // --- NEW: Real Logout Handler ---
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
      setIsLoading(false);
    }
  };

  const scrollToApps = () => {
    appsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1A2A4C]">
        <h1 className="text-2xl font-bold text-white">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {!user && (
        <LoginScreen onLogin={handleLogin} authError={authError} />
      )}

      {user && (
        <MainApp
          userName={user.displayName || "User"}
          onLogout={handleLogout}
          onScrollToApps={scrollToApps}
          appsRef={appsRef}
        />
      )}
    </div>
  );
}

function LoginScreen({ onLogin, authError }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1A2A4C]">
      <div className="p-10 rounded-lg text-center">
        <h1 className="mt-4 text-3xl font-bold text-[#FDB813] uppercase tracking-wider">
          Welcome to Simpro SE Central
        </h1>
        <p className="mt-2 text-gray-300">
          Please sign in with your Simpro Google account to continue.
        </p>
        <button
          onClick={onLogin}
          className="mt-8 px-8 py-3 bg-[#FDB813] text-[#1A2A4C] font-bold rounded-lg shadow-md hover:bg-yellow-400 transition-colors duration-300"
        >
          Sign in with Google
        </button>
        {authError && (
          <p className="mt-6 text-yellow-400 bg-red-800/20 border border-yellow-400 p-3 rounded-lg max-w-sm mx-auto">
            {authError}
          </p>
        )}
      </div>
    </div>
  );
}

function MainApp({ userName, onLogout, onScrollToApps, appsRef }) {
  return (
    <>
      <header className="sticky top-0 z-10 bg-[#1A2A4C] shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-white">
                  Simpro SE Central
                </span>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="hidden sm:inline-block text-gray-300 mr-4">
                Hi, {userName.split(' ')[0]}
              </span>
              <button
                onClick={onScrollToApps}
                className="hidden sm:inline-block px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#1A2A4C] bg-[#FDB813] hover:bg-yellow-400"
              >
                Browse Apps
              </button>
              <button
                onClick={onLogout}
                className="ml-4 px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-white hover:bg-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            <div className="bg-[#FDB813] text-[#1A2A4C] p-12 md:p-16 lg:p-24 flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wide">
                Your Simpro SE Homebase
              </h1>
              <p className="mt-6 text-lg text-gray-900 leading-relaxed">
                Welcome to SE Central, your single starting point for all the tools you need to excel. Access coaching, score demos, and track performance.
              </p>
              <div className="mt-10 flex gap-4">
                <button
                  onClick={onScrollToApps}
                  className="px-8 py-3 bg-[#1A2A4C] text-white font-bold rounded-lg shadow-md hover:bg-gray-800 transition-colors duration-300"
                >
                  View SE Apps
                </button>
                <button
                  onClick={onScrollToApps}
                  className="px-8 py-3 bg-transparent text-[#1A2A4C] font-bold rounded-lg border-2 border-[#1A2A4C] hover:bg-white/30 transition-colors duration-300"
                >
                  Quick Tour
                </button>
              </div>
            </div>

            <div className="bg-[#1A2A4C] p-12 flex items-center justify-center min-h-[300px] lg:min-h-0">
              <div className="w-full max-w-md">
                <img 
                  src="/hero-image.png" 
                  alt="Simpro App Preview" 
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>

          </div>
        </section>

        <section id="apps" ref={appsRef} className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-[#1A2A4C]">
              SE Apps
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Select an application to launch.
            </p>
            
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {appsConfig.map((app, index) => (
                <AppCard key={app.id} app={app} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#1A2A4C] py-16 text-center">
          <h2 className="text-3xl font-bold uppercase text-[#FDB813]">
            Questions or Issues?
          </h2>
          <div className="mt-6 flex justify-center gap-8">
            <a
              href="#" // Placeholder link
              className="text-lg font-medium text-white hover:text-yellow-300"
            >
              View the SE Central Guide
            </a>
            <a
              href="#" // Placeholder link
              className="text-lg font-medium text-white hover:text-yellow-300"
            >
              Ask in #se-central
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <span className="text-gray-400 text-sm">
            © 2025 Simpro – SE Central
          </span>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm">Help</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Feedback</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy</a>
          </div>
        </div>
      </footer>
    </>
  );
}

function AppCard({ app, index }) {
  const isDisabled = !app.isEnabled;
  const isDark = index % 2 !== 0; // Check if it's an odd-numbered card (0-indexed)

  return (
    <div
      className={`
        rounded-xl shadow-lg overflow-hidden flex flex-col
        transition-all duration-300 ease-in-out
        ${isDark ? 'bg-[#1A2A4C]' : 'bg-white'}
        ${isDisabled ? 'opacity-60' : 'hover:shadow-2xl hover:-translate-y-1'}
      `}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className={`p-3 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {React.cloneElement(app.icon, { className: isDark ? 'w-6 h-6 text-white' : 'w-6 h-6 text-[#1A2A4C]' })}
          </div>
          {isDisabled ? (
            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
              Coming Soon
            </span>
          ) : (
            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${isDark ? 'bg-green-300 text-green-900' : 'bg-green-100 text-green-800'}`}>
              Active
            </span>
          )}
        </div>
        
        <h3 className={`mt-5 text-xl font-bold ${isDark ? 'text-white' : 'text-[#1A2A4C]'}`}>
          {app.name}
        </h3>
        
        <p className={`mt-2 text-sm h-16 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {app.description}
        </p>
      </div>
      
      <div className={`p-6 mt-auto ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <a
          href={isDisabled ? undefined : app.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            block w-full text-center px-4 py-2 font-bold rounded-lg
            transition-colors duration-300
            ${isDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#FDB813] text-[#1A2A4C] hover:bg-yellow-400'
            }
          `}
          aria-disabled={isDisabled}
          onClick={(e) => isDisabled && e.preventDefault()}
        >
          {isDisabled ? 'Coming Soon' : 'Open App'}
        </a>
      </div>
    </div>
  );
}