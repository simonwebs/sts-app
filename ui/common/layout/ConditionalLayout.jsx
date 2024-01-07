import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ErrorBoundary } from 'react-error-boundary';
import { UserRolesContext } from '../general/UserRolesContext';
import Loading from '../../components/spinner/Loading';
import ErrorFallback from '../../components/ErrorFallback';
import Header from '../../common/header/Header';
import Footer from '../../common/footer/Footer';

const InnerLayout = ({ children, currentUserId }) => {
  const { currentUser, isLoading } = useContext(UserRolesContext);

  if (isLoading) {
    return <Loading />;
  }

  const shouldHideHeaderAndFooter = currentUser?.roles?.some(role =>
    ['admin', 'super-admin'].includes(role),
  );

  return (
    <>
      {!shouldHideHeaderAndFooter && (
        <Header setSelectedUser={() => {}} currentUserId={currentUserId} />
      )}
      {children}
      {!shouldHideHeaderAndFooter && <Footer />}
    </>
  );
};

InnerLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

const ConditionalLayout = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <InnerLayout>{children}</InnerLayout>
    </ErrorBoundary>
  );
};

ConditionalLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ConditionalLayout;
