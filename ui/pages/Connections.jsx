import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid';
import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { UsersCollection } from '../../api/collections/UserProfiles';

const Connections = () => {
  const [stats, setStats] = useState([]);

  // Replace 'YourCollection' with the actual collection you are using
  const statsFromServer = useTracker(() => UsersCollection.find().fetch(), []);

  useEffect(() => {
    setStats(statsFromServer);
  }, [statsFromServer]);

  const classNames = (...classes) => classes.filter(Boolean).join(' ');

  return (
    <div className="dark:bg-gray-700 dark:text-gray-300">
      <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-300">Last 30 days</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-3 md:divide-x md:divide-y-0 dark:bg-gray-800 dark:divide-gray-600">
        {stats.map((item) => (
          <div key={item.name} className="px-4 py-5 sm:p-6 dark:bg-gray-700">
            <dt className="text-base font-normal text-gray-900 dark:text-gray-300">{item.name}</dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-indigo-600 dark:text-indigo-300">
                {item.stat}
                <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">from {item.previousStat}</span>
              </div>

              <div
                className={classNames(
                  item.changeType === 'increase' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200',
                  'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0',
                )}
              >
                {item.changeType === 'increase'
                  ? (
                  <ArrowUpIcon
                    className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500 dark:text-green-200"
                    aria-hidden="true"
                  />
                    )
                  : (
                  <ArrowDownIcon
                    className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500 dark:text-red-200"
                    aria-hidden="true"
                  />
                    )}

                <span className="sr-only">{item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
                {item.change}
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default Connections;
