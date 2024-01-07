import React, { memo } from 'react';

const AdvertPage = memo(() => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row">
        {/* Left Column (Image) */}
        <div className="md:w-1/2">
          <img
            src="https://tailwindui.com/img/ecommerce-images/category-page-01-featured-collection.jpg"
            alt="Image"
            className='h-full w-full rounded-lg object-cover object-center transform transition duration-200 ease-in-out'
          />
        </div>

        {/* Right Column (Text) */}
        <div className="md:w-1/2 mt-4 md:mt-0 md:ml-4">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Title</h2>
          <p className="text-gray-600 dark:text-white">
            Your text content goes here. You can add paragraphs, lists, and more.
          </p>
        </div>
      </div>
    </div>
  );
});
export default AdvertPage;
