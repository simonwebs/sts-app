import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen relative isolate overflow-hidden bg-white dark:bg-gray-700 py-24 sm:py-32">
      <div className="absolute -top-80 left-[max(6rem,33%)] -z-10 transform-gpu blur-3xl sm:left-1/2 md:top-20 lg:ml-20 xl:top-3 xl:ml-56" aria-hidden="true">
        {/* Background design element - you can customize this as per your app's design */}
        {/* ... */}
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          {/* Update heading and sub-heading to reflect the dating app's name and nature */}
          <p className="text-lg font-semibold leading-8 tracking-tight text-indigo-600 dark:text-gray-200">
            That Connect Dating App Terms and Conditions
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-300 sm:text-4xl">
            Terms and Conditions
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-700 dark:text-gray-400">
            Last Updated: [Date].
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:mt-10 lg:max-w-none lg:grid-cols-12">
          <div className="relative lg:order-last lg:col-span-5">
            {/* ... */}
            <figure className="border-l border-indigo-600 pl-8">
              <blockquote className="text-xl font-semibold leading-8 tracking-tight text-gray-900 dark:text-gray-400">
                {/* Update quote to reflect dating app's privacy and commitment */}
                <p>
                  "At That Connect, your privacy is our priority. We are dedicated to preserving your trust and safeguarding your personal information."
                </p>
              </blockquote>
              <figcaption className="mt-8 flex gap-x-4">
                {/* Replace image with the dating app logo */}
                <img
                  src="https://via.placeholder.com/150" // Replace with your logo path
                  alt="That Connect Logo"
                  className="mt-1 h-10 w-10 flex-none rounded-full bg-gray-50"
                />
                <div className="text-sm leading-6">
                  <div className="font-semibold text-gray-900 dark:text-gray-400">That Connect</div>
                  <div className="text-gray-600 dark:text-gray-400">@That Connectapp</div>
                </div>
              </figcaption>
            </figure>
          </div>
          <div className="max-w-xl text-base leading-7 text-gray-700 lg:col-span-7 dark:text-gray-400">
            {/* Update the terms text to reflect the dating app's policies */}
            <p>
              "When you register with That Connect, we collect personal information such as your name, email address, and preferences. We use this data to enhance your matchmaking experience and connect you with potential matches."
            </p>
            {/* Include the rest of your terms and conditions text */}
            {/* ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
