import React, { useState, useEffect, useCallback } from 'react';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = useCallback(() => {
    localStorage.setItem('cookieConsent', 'accepted');
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'cookie_accept');
    }
    setShowBanner(false);
  }, []);

  const handleReject = useCallback(() => {
    localStorage.setItem('cookieConsent', 'rejected');
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'cookie_reject');
    }
    setShowBanner(false);
  }, []);
  
  if (!showBanner) return null;

  return (
    <div className="cookie-banner bg-gray-100 p-4 rounded-lg fixed bottom-0 right-0 mb-4 mr-4 z-50">
      <p className="text-sm">We use cookies to improve your experience. By using this site, you agree to our use of cookies.</p>
      <div className="mt-2">
        <button onClick={handleAccept} className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200">
          Accept
        </button>
        <button onClick={handleReject} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200">
          Reject
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
