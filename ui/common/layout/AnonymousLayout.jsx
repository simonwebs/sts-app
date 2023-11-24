import React from 'react';
import ConditionalLayout  from './ConditionalLayout';

const AnonymousLayout = ({ children }) => (
  <ConditionalLayout onlyAnonymous>{children}</ConditionalLayout>
);
export default AnonymousLayout;