import React, { lazy } from 'react';

const Health = lazy(() => import('../pages/Health'));
const components = {
  health: Health,
  social: Social,
  gospel: Gospel,
  prophecy: Prophecy,
  // ... other category components
};

const DynamicCategoryComponent = ({ category, posts }) => {
  const ComponentToRender = components[category];
  if (!ComponentToRender) return null;
  return <ComponentToRender posts={posts} />;
};
export default DynamicCategoryComponent;
