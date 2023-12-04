import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import $ from 'jquery'; // Import jQuery if it's not globally available
import AppRoutes from './AppRoutes';
import Loading from '../../components/spinner/Loading';
import CookieBanner from './CookieBanner';
import { UserRolesProvider } from './UserRolesContext';
import ErrorBoundary from './ErrorBoundary';

const App = () => {
  useEffect(() => {
    const googleAnalyticsId = Meteor.settings.public.googleAnalyticsId;

    $.getScript(`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`, function() {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', googleAnalyticsId);
    });
  }, []);

  return (
    <React.Suspense
      fallback={
        <div className="flex justify-center items-center h-screen dark:bg-gray-700">
          <Loading />
        </div>
      }
    >
      <ErrorBoundary>
        <BrowserRouter>
          <UserRolesProvider>
            <CookieBanner />
            <AppRoutes />
          </UserRolesProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.Suspense>
  );
};

export default App;
