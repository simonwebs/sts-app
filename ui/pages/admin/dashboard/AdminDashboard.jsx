import React, { useState, lazy } from 'react';
import AdminHeader from './AdminHeader';
import Navigation from './Navigation';
import navigationItems from './navigationItems';
import NewPostForm from '../forms/NewPostForm';
import AlbumForm from '../forms/AlbumForm';
import SettingPage from './SettingPage';
import AdminProfilePage from '../updateData/AdminProfilePage';
import ExpenseIncome from '../../expenseTracker/ExpenseIncome';
import TransactionChart from '../../expenseTracker/TransactionChart';
import NewVideoPostForm from '../forms/NewVideoPostForm';

const AdminDefaultComponent = lazy(() => import('./AdminDefaultComponent'));

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('AdminDefaultComponent');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [showExpenseIncomeModal, setShowExpenseIncomeModal] = useState(false);
  const [showTransactionChartModal, setShowTransactionChartModal] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [showNewVideoPostModal, setShowNewVideoPostModal] = useState(false);
  const [showAdminProfilePageModal, setShowAdminProfilePageModal] = useState(false);

const handleNavigationClick = (view) => {
  console.log(`Navigating to view: ${view}`);
  setCurrentView(view);
    const formattedView = view === 'Home' ? 'AdminDefaultComponent ' : view;
    setCurrentView(formattedView);
    if (view === 'NewPostForm') {
      setShowNewPostModal(true);
    }
  
    if (view === 'NewVideoPostForm') {
      setShowNewVideoPostModal(true);
    }
    if (view === 'AlbumForm') {
      setShowAlbumModal(true);
    }
    if (view === 'ExpenseIncome') {
      setShowExpenseIncomeModal(true);
    }
    if (view === 'TransactionChart') {
      setShowTransactionChartModal(true);
    }
    if (view === 'SettingPage') {
      setShowSettingModal(true);
    }
    if (view === 'MainAnalytics') {
      setShowSettingModal(true);
    }
    if (view === 'AdminProfilePage') {
      setShowAdminProfilePageModal(true);
    }
   
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`flex w-full flex-col h-screen dark:bg-gray-700 ${isSidebarOpen ? '' : 'pl-0'}`}>
      <AdminHeader toggleSidebar={toggleSidebar} className="w-full" />
      <div className="flex flex-col sm:flex-row h-full overflow-hidden">
        <div className={`w-full sm:w-1/5 min-w-max bg-gray-200 overflow-y-auto dark:bg-gray-700/100 ${isSidebarOpen ? '' : 'hidden'}`}>
          <Navigation items={navigationItems} onNavigate={handleNavigationClick} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        <div className={`w-full sm:w-${isSidebarOpen ? '4/5' : 'full'} overflow-y-auto bg-gray-100 dark:bg-gray-700/100`}>
         <main className="p-5">
  {currentView === 'AdminDefaultComponent' && <AdminDefaultComponent  />}
  {currentView === 'NewPostForm' && <NewPostForm showModal={showNewPostModal} setShowModal={setShowNewPostModal} />}
          {currentView === 'NewVideoPostForm' && <NewVideoPostForm showModal={showNewVideoPostModal} setShowModal={setShowNewVideoPostModal} />}
          {currentView === 'AlbumForm' && <AlbumForm showModal={showAlbumModal} setShowModal={setShowAlbumModal} />}
          {currentView === 'SettingPage' && <SettingPage showModal={showSettingModal} setShowModal={setShowSettingModal} />}
          {currentView === 'ExpenseIncome' && <ExpenseIncome showModal={showExpenseIncomeModal} setShowModal={setShowExpenseIncomeModal} />}
          {currentView === 'AdminProfilePage' && showAdminProfilePageModal && <AdminProfilePage />}
          {currentView === 'TransactionChart' && <TransactionChart showModal={showTransactionChartModal} setShowModal={setShowTransactionChartModal} />}
        </main>
      </div>
    </div>
    </div>
  );
};

export default AdminDashboard;
