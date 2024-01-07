import React from 'react';

const Loading = React.memo(({ name }) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-indigo-200 dark:border-t-white border-t-indigo-500"></div>
      {name && (
        <p className="m-3 text-sm text-indigo-800 dark:text-white">{`Loading ${name}...`}</p>
      )}
    </div>
  );
});

export default Loading;
