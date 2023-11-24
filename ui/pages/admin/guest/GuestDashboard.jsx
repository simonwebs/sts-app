import React, { useState } from 'react';
import { useLoggedUser } from 'meteor/quave:logged-user-react';
import GuestNavigation from './GuestNavigation';
import GuestHeader from './GuestHeader';
import SettingPage from '../dashboard/SettingPage';
import GuestDefaultComponent from './GuestDefaultComponent';
import guestNavigationItems from './guestNavigationItems';
import GuestProfilePage from './GuestProfilePage';

const GuestDashboard = () => {
  const { loggedUser, isLoadingLoggedUser } = useLoggedUser();

  // Remove the redirection logic to allow guest access
  // Now, if there is no logged user and we're not waiting to find out, we simply continue as a guest

  const [currentView, setCurrentView] = useState('default');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleNavigationClick = (view) => {
    const formattedView = view === 'Home' ? 'GuestDefaultComponent' : view;
    setCurrentView(formattedView);
    setShowSettingModal(view === 'SettingPage');
    setShowProfileModal(view === 'GuestProfilePage');
    toggleSidebar();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoadingLoggedUser) {
    // Show loading state until we know if user is logged in or not
    return <div>Loading...</div>;
  }

  return (
    <div className="flex w-full flex-col h-screen dark:bg-gray-800">
      <GuestHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-col sm:flex-row h-full overflow-hidden">
        <div className="w-full sm:w-1/5 min-w-max bg-gray-200 dark:bg-gray-800 overflow-y-auto">
          <GuestNavigation items={guestNavigationItems} onNavigate={handleNavigationClick} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        <div className="w-full sm:w-4/5 overflow-y-auto bg-gray-100 dark:bg-gray-800">
          <main className="p-5">
            {currentView === 'GuestDefaultComponent' && <GuestDefaultComponent />}
            {currentView === 'SettingPage' && <SettingPage showModal={showSettingModal} setShowModal={setShowSettingModal} />}
            {currentView === 'GuestProfilePage' && <GuestProfilePage showModal={showProfileModal} setShowModal={setShowProfileModal} />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;
