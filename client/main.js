import { Meteor } from 'meteor/meteor';
import React, { lazy } from 'react';
import { createRoot } from 'react-dom/client';

// Lazy load the App component.
const App = lazy(() => import('../ui/common/general/App'));

Meteor.startup(() => {
  const container = document.getElementById('react-target');
  const root = createRoot(container);
  root.render(<App />);
});
