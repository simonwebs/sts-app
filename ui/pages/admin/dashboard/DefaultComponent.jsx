import React from 'react';
import PostEditComponent from './PostEditComponent.jsx';
import AdminCard from './AdminCard.jsx';

const DefaultComponent = () => {
  return (
   <div className="overflow-y-auto dark:bg-gray-700 dark:text-white">
        <PostEditComponent />
        <AdminCard />
    </div>
  );
};

export default DefaultComponent;
