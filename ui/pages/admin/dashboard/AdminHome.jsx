import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import AdminHeader from './AdminHeader';
import Navigation from './Navigation';
import DefaultComponent from './AdminDefaultComponent';
import navigationItems from './navigationItems';
import NewPostForm from '../forms/NewPostForm';
import AlbumForm from '../forms/AlbumForm';
import SettingPage from './SettingPage';
import AdminProfilePage from '../updateData/AdminProfilePage';
import ExpenseIncome from '../../expenseTracker/ExpenseIncome';
import TransactionChart from '../../expenseTracker/TransactionChart';
import NewVideoPostForm from '../forms/NewVideoPostForm';
import Loading from '../../../components/spinner/Loading';
import Subscribers from '../emails/Subscribers';
import ContactList from '../emails/ContactList';

const AdminHome = () => {
  const user = useTracker(() => Meteor.user());
  const [currentView, setCurrentView] = useState('default');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [showExpenseIncomeModal, setShowExpenseIncomeModal] = useState(false);
  const [showTransactionChartModal, setShowTransactionChartModal] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [showSubscribersModal, setShowSubscribersModal] = useState(false);
  const [showContactListModal, setShowContactListModal] = useState(false);
  const [showNewVideoPostModal, setShowNewVideoPostModal] = useState(false);
  const [showAdminProfilePageModal, setShowAdminProfilePageModal] = useState(false);

  const handleNavigationClick = (view) => {
    const formattedView = view === 'Home' ? 'DefaultComponent' : view;
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

    if (view === 'Subscribers') {
      setShowSubscribersModal(true);
    }
    if (view === 'ContactList') {
      setShowContactListModal(true);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // Check if the user exists and if they are an admin
  if (!user) {
    return <Loading/>;
  }

  return (
    <div className={`flex w-full flex-col h-screen dark:bg-gray-700 ${isSidebarOpen ? '' : 'pl-0'}`}>
      <AdminHeader toggleSidebar={toggleSidebar} className="w-full" />
      <div className="flex flex-col sm:flex-row h-full overflow-hidden">
        <div className={`w-full sm:w-1/5 min-w-max bg-gray-200 overflow-y-auto dark:bg-gray-700/100 ${isSidebarOpen ? '' : 'hidden'}`}>
          <Navigation items={navigationItems} onNavigate={handleNavigationClick} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        <div className={`w-full sm:w-${isSidebarOpen ? '4/5' : 'full'} overflow-y-auto bg-gray-100 dark:bg-gray-700/100`}>
          <main className="p-5">
          {currentView === 'DefaultComponent' && <DefaultComponent />}
          {currentView === 'NewPostForm' && <NewPostForm showModal={showNewPostModal} setShowModal={setShowNewPostModal} />}
          {currentView === 'NewVideoPostForm' && <NewVideoPostForm showModal={showNewVideoPostModal} setShowModal={setShowNewVideoPostModal} />}
          {currentView === 'AlbumForm' && <AlbumForm showModal={showAlbumModal} setShowModal={setShowAlbumModal} />}
          {currentView === 'SettingPage' && <SettingPage showModal={showSettingModal} setShowModal={setShowSettingModal} />}
          {currentView === 'ExpenseIncome' && <ExpenseIncome showModal={showExpenseIncomeModal} setShowModal={setShowExpenseIncomeModal} />}
          {currentView === 'AdminProfilePage' && showAdminProfilePageModal && <AdminProfilePage />}
          {currentView === 'TransactionChart' && <TransactionChart showModal={showTransactionChartModal} setShowModal={setShowTransactionChartModal} />}
           {currentView === 'Subscribers' && <Subscribers showModal={showSubscribersModal} setShowModal={setShowSubscribersModal} />}
          {currentView === 'ContactList' && <ContactList showModal={showContactListModal} setShowModal={setShowContactListModal} />}
        </main>
      </div>
    </div>
    </div>
  );
};

export default AdminHome;
