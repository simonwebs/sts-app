import CheckCircleIcon from '@heroicons/react/20/solid/CheckCircleIcon';
import React from 'react';

export const SuccessAlert = ({ message, progress }) => {
  return (
<div className="flex bg-gray-200 shadow-lg rounded-md py-3 px-1 border-b-2 border-green-900">
    <div className="flex">
      <div className="flex-shrink-0">
        <CheckCircleIcon
          className="h-6 w-6 text-green-800"
          aria-hidden="true"
        />
      </div>
      <div className="ml-3">
        <p className="text-sm san-serif font-medium text-green-900">{message}</p>
      </div>
      </div>
    </div>
  );
};
