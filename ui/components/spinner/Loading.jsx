import React from 'react';

const Loading = React.memo(({ name }) => {

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-indigo-200 border-t-transition duration-300 ease-in-out bg-gradient-to-r from-pink-600 via-voilet-600 to-violet-600 hover:shadow-lg hover:from-pink-700 hover:to-violet-800 rounded-bl-4xl dark:border-t-white"></div>
      {name && <p className="m-3 text-sm text-indigo-800 dark:text-white">{`Loading ${name}...`}</p>}
    </div>
  );
});

export default Loading;