import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes'; // Assuming this path is correct
import Loading from '../../components/spinner/Loading'; // Assuming this path is correct
import CookieBanner from './CookieBanner'; // Assuming this path is correct
import { UserRolesProvider } from './UserRolesContext'; // Assuming this path is correct
import ErrorBoundary from './ErrorBoundary'; // Assuming this path is correct

const App = () => {
  return (
    <Suspense
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
    </Suspense>
  );
};

export default App;
