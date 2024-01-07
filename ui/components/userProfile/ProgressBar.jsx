import React from 'react';
const ProgressBar = ({ currentStep, totalSteps, isLoading, stepNames }) => {
  const progressPercentage = (currentStep / totalSteps) * 100 || 0;

  return (
    <div className="relative pt-1">
      <div className="flex mb-2 items-center justify-center">
        <div className="text-right">
          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full  transition duration-300 ease-in-out bg-clip-text text-transparent bg-gradient-to-r from-teal-500
  via-emerald-500 to-lime-600 hover:shadow-lg hover:opacity-75 hover:scale-105 hover:bg-gradient-to-r hover:from-teal-400 hover:via-emerald-400 hover:to-lime-500">
            {stepNames[currentStep - 1]}
          </span>
        </div>
      </div>
      <div className="flex mb-2 items-center justify-between">
        <div className="flex-1 flex items-center">
          <div className="relative w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`absolute left-0 h-2 transition-all ease-out duration-300 w-${progressPercentage}bg-gradient-to-r from-teal-500
  via-emerald-500 to-lime-600 hover:shadow-lg hover:opacity-75 hover:scale-105 hover:bg-gradient-to-r hover:from-teal-400 hover:via-emerald-400 hover:to-lime-500 rounded-full`}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
              {stepNames.map((title, index) => (
                <div
                  key={index}
                  className={`w-1/${totalSteps} text-center ${
                    index + 1 === currentStep ? 'font-semibold' : 'opacity-50'
                  }`}
                >
                  {title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
