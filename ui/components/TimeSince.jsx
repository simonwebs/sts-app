import React, { useEffect, useState } from 'react';

const TimeSince = ({ date }) => {
  const [timeString, setTimeString] = useState('NA');

  const calculateTimeSince = (date) => {
    if (isNaN(Date.parse(date))) {
      return 'NA';
    }

    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now - past) / 1000);
    
    if (seconds < 0) {
      return 'Future date';
    }

    const intervals = [
      { label: 'yr', seconds: 31536000 },
      { label: 'mo', seconds: 2592000 },
      { label: 'wk', seconds: 604800 },
      { label: 'd', seconds: 86400 },
      { label: 'hr', seconds: 3600 },
      { label: 'm', seconds: 60 },
      { label: 's', seconds: 1 }
    ];

    for (let i = 0; i < intervals.length; i++) {
      const interval = intervals[i];
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count}${interval.label}`;
      }
    }

    return 'Just now';
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeString(calculateTimeSince(date));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [date]);

  return <span>{timeString}</span>;
};

export default TimeSince;
