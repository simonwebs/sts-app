// RouteWithHelmet.jsx
import React from 'react';
import { Helmet } from 'react-helmet';

const RouteWithHelmet = ({ title, description, children }) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      {children}
    </>
  );
};

export default RouteWithHelmet;
