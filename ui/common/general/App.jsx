import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Loading from '../../components/spinner/Loading';
import CookieBanner from './CookieBanner';
import { UserRolesProvider } from './UserRolesContext';
import ErrorBoundary from './ErrorBoundary';

const App = () => {
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
