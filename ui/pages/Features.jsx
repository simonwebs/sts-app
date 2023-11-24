import React from 'react';
  import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid';
import Explore from '../components/userProfile/Explore';

const features = [
  {
    name: 'Silver Linings',
    description:
      "Begin your quest for romance with our Silver membership! It's the perfect starting point, offering access to a diverse pool of profiles, daily matches",
    icon: LockClosedIcon,
  },
  {
    name: 'Golden Moments',
    description: "Elevate your search with our Gold tier, designed for those looking for a bit more sparkle in their quest. Enjoy enhanced features like advanced search filters, video profiles",
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Platinum Promises',
    description: " For the ultimate dating experience, our Platinum tier offers an exclusive suite of benefits. Indulge in the luxury of personalized matchmaking services, one-on-one dating coaching, ",
    icon: ServerIcon,
  },
];
const Features = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-4">
      <div className="flex flex-wrap items-start -mx-8">
        {/* Right side - Explore component */}
        <div className="w-full lg:w-1/2 px-4 flex items-center justify-center sm:mb-12">
          <Explore className="w-full" /> {/* Make sure Explore component accepts className prop */}
        </div>

        {/* Left side - Features list */}
        <div className="w-full lg:w-1/2 px-4">
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <feature.icon className="h-6 w-6 flex-shrink-0 text-indigo-600" aria-hidden="true" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300">{feature.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

  export default Features;

