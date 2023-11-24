import React from 'react';
import ConditionalLayout from './ConditionalLayout';

const PublicLayout = ({ children }) => (
  <ConditionalLayout>{children}</ConditionalLayout>
);

export default PublicLayout;
