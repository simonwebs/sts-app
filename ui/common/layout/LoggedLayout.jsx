import React from 'react';
import ConditionalLayout from './ConditionalLayout';

 const LoggedLayout = ({ children }) => (
  <ConditionalLayout onlyLogged>{children}</ConditionalLayout>
);
export default LoggedLayout;