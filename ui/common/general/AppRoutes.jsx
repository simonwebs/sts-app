import React, { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom'; // Import Outlet for nested routes
import { RoutePaths } from './RoutePaths';
import Loading from '../../components/spinner/Loading';
import PublicLayout from '../layout/PublicLayout';
import NotFound from '../../pages/notFound/NotFound';
import AnonymousLayout from '../layout/AnonymousLayout';
import { AdminOnly } from '../../pages/admin/AdminOnly';
import LoggedUserOnly from '../../auth/LoggedUserOnly';
import DefaultComponent from '../../pages/admin/dashboard/DefaultComponent';
import AdminDefaultComponent from '../../pages/admin/dashboard/AdminDefaultComponent';
import UserSearch from '../header/UserSearch';
import AdminPanel from '../../pages/admin/dashboard/AdminPanel';
import AdminProfilePage from '../../pages/admin/updateData/AdminProfilePage';
import Health from '../../pages/Health';
import Social from '../../pages/Social';
import Prophecy from '../../pages/Prophecy';
import Gospel from '../../pages/Gospel';
import ResetPassword from '../../auth/ResetPassword';
import AnonymousOnly from '../../auth/AnonymousOnly';
import ForgotPassword from '../../auth/ForgotPassword';
import PricePage from '../../components/PricePage';
import Explore from '../../components/userProfile/Explore';
import LetsTalk from '../../pages/letsTalk/LetsTalk';
import ConfirmEmail from '../../components/ConfirmEmail';
import TermsAndConditions from '../../pages/TermAndCondition';

const Home = lazy(() => import('../../pages/Home'));
const ProfilePage = lazy(() => import('../../auth/ProfilePage'));
const Dashboard = lazy(() => import('../../pages/admin/dashboard/Dashboard'));
const GuestDashboard = lazy(() => import('../../pages/admin/guest/GuestDashboard'));
const LoginPage = lazy(() => import('../../auth/LoginPage'));
const ContactForm = lazy(() => import('../../pages/contact/ContactForm'));
const About = lazy(() => import('../../pages/About'));
const PostDetail = lazy(() => import('../../post/PostDetail'));
const News = lazy(() => import('../../post/News'));
const AdminHome = lazy(() => import('../../pages/admin/dashboard/AdminHome'));
const UserProfileForm = lazy(() => import('../../components/userProfile/UserProfileForm'));

const AppContent = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route
          path={RoutePaths.HOME}
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />

        <Route
          path={RoutePaths.TERM_AND_CONDITIONS}
          element={
            <PublicLayout>
              <TermsAndConditions />
            </PublicLayout>
          }
        />
        <Route
          path={RoutePaths.EXPLORE}
          element={
            <PublicLayout>
              <LoggedUserOnly>
                <Explore />
              </LoggedUserOnly>
            </PublicLayout>
          }
        />
        <Route
          path={RoutePaths.USER_SEARCH}
          element={
            <PublicLayout>
              <UserSearch />
            </PublicLayout>
          }
        />
        <Route
          path={RoutePaths.ABOUT}
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />
 <Route
      path={`${RoutePaths.CONFIRM_EMAIL}/:userId`}
      element={
        <PublicLayout>
          <ConfirmEmail />
        </PublicLayout>
      }
    />
        <Route
          path={RoutePaths.NEWS}
          element={
            <PublicLayout>
              <News />
            </PublicLayout>
          }
        />

        <Route
          path={RoutePaths.HEALTH}
          element={
            <PublicLayout>
              <Health />
            </PublicLayout>
          }
        />
         <Route
          path={RoutePaths.USER_PROFILE_FORM}
          element={
            <PublicLayout>
              <UserProfileForm/>
            </PublicLayout>
          }
        />
 <Route
          path={RoutePaths.CONTACT_FORM}
          element={
            <PublicLayout>
              <ContactForm />
            </PublicLayout>
          }
        />
        <Route
          path={RoutePaths.PROPHECY}
          element={
            <PublicLayout>
              <Prophecy />
            </PublicLayout>
          }
        />
        <Route
          path={RoutePaths.LETS_TALK}
          element={
            <PublicLayout>
              <LetsTalk />
            </PublicLayout>
          }
        />
        <Route
          path={RoutePaths.PRICE_PAGE}
          element={
            <PublicLayout>
              <PricePage />
            </PublicLayout>
          }
        />

        <Route
          path={RoutePaths.SOCIAL}
          element={
            <PublicLayout>
              <Social />
            </PublicLayout>
          }
        />
        <Route
          path={RoutePaths.GOSPEL}
          element={
            <PublicLayout>
              <Gospel />
            </PublicLayout>
          }
        />
        <Route
          path={RoutePaths.LOGIN_PAGE}
          element={
            <AnonymousLayout>
              <LoginPage />
            </AnonymousLayout>
          }
        />

        <Route path="/post/:postId" element={<PublicLayout><PostDetail /></PublicLayout>} />
  

        <Route
          path={RoutePaths.PROFILE_PAGE}
          element={
            <LoggedUserOnly>
              <PublicLayout>
                <Outlet /> {/* Nested routes */}
              </PublicLayout>
            </LoggedUserOnly>
          }
        />

        <Route
          path={RoutePaths.USER_PROFILE_FORM}
          element={
            <LoggedUserOnly>
              <PublicLayout>
                <Outlet /> {/* Nested routes */}
              </PublicLayout>
            </LoggedUserOnly>
          }
        />

        <Route
          path={`${RoutePaths.PROFILE_PAGE}/:userId`}
          element={
            <LoggedUserOnly>
              <PublicLayout>
                <ProfilePage />
              </PublicLayout>
            </LoggedUserOnly>
          }
        />

        <Route
          path={RoutePaths.DASHBOARD}
          element={
            <LoggedUserOnly>
              <Dashboard />
            </LoggedUserOnly>
          }
        />
        <Route
          path={RoutePaths.ADMIN_PANEL}
          element={
            <AdminOnly>
              <AdminPanel />
            </AdminOnly>
          }
        />
        <Route
          path={RoutePaths.ADMIN_PROFILE_PAGE}
          element={
            <AdminOnly>
              <AdminProfilePage />
            </AdminOnly>
          }
        />
        <Route
          path={RoutePaths.ADMIN_DEFAULT_COMPONENT}
          element={
            <AdminOnly>
              <AdminDefaultComponent />
            </AdminOnly>
          }
        />
        <Route
          path={RoutePaths.DEFAULT_COMPONENT}
          element={
            <AdminOnly>
              <DefaultComponent />
            </AdminOnly>
          }
        />
        <Route
          path={RoutePaths.GUEST_DASHBOARD}
          element={
            <LoggedUserOnly>
              <GuestDashboard />
            </LoggedUserOnly>
          }
        />

        <Route
          path={RoutePaths.ADMIN_HOME}
          element={
            <AdminOnly>
              <AdminHome />
            </AdminOnly>
          }
        />
        <Route
          path={`${RoutePaths.RESET_PASSWORD}/:token`}
          element={
            <AnonymousOnly>
              <PublicLayout>
                <ResetPassword />
              </PublicLayout>
            </AnonymousOnly>
          }
        />
        <Route
          path={`${RoutePaths.FORGOT_PASSWORD}/:token`}
          element={
            <AnonymousOnly>
              <PublicLayout>
                <ForgotPassword />
              </PublicLayout>
            </AnonymousOnly>
          }
        />
        <Route
          path="*"
          element={
            <PublicLayout>
              <NotFound />
            </PublicLayout>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppContent;
