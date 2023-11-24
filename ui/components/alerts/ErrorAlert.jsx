import XCircleIcon from '@heroicons/react/20/solid/XCircleIcon';
import React from 'react';

export const ErrorAlert = ({ message }) => (
  <div className="flex bg-gray-200 shadow-lg rounded-md py-3 px-1 border-b-2 border-red-700">
    <div className="flex">
      <div className="flex-shrink-0">
        <XCircleIcon
          className="h-6 w-6 text-red-800 dark:text-red-700"
          aria-hidden="true"
        />
      </div>
      <div className="ml-3">
        <h3 className="text-sm san-serif font-medium text-red-800 dark:text-red-700">
          {message}
        </h3>
      </div>
    </div>
  </div>
);
