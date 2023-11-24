import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="progress-bar-container" style={{ width: '100%', backgroundColor: '#e0e0de', borderRadius: '8px', overflow: 'hidden', margin: '20px 0' }}>
      <div
        className="progress-bar-filler"
        style={{
          width: `${progressPercentage}%`,
          backgroundColor: '#4caf50',
          height: '20px',
          borderRadius: '8px',
          transition: 'width 0.3s ease-in-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}
      >
        {currentStep}/{totalSteps}
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired
};

export default ProgressBar;
