import React, { useEffect, useState } from 'react';

const TimeSince = ({ date }) => {
  const [timeString, setTimeString] = useState('NA');

  useEffect(() => {
    if (isNaN(Date.parse(date))) {
      // If the date is not valid, don't start the interval.
      setTimeString('NA');
      return;
    }

    const intervalId = setInterval(() => {
      const now = new Date();
      const past = new Date(date);
      const seconds = Math.floor((now - past) / 1000);
      let interval = seconds / 31536000;

      if (interval > 1) {
        setTimeString(Math.floor(interval) + 'yr');
      } else {
        interval = seconds / 2592000;
        if (interval > 1) {
          setTimeString(Math.floor(interval) + 'mo');
        } else {
          interval = seconds / 604800;
          if (interval > 1) {
            setTimeString(Math.floor(interval) + 'wk');
          } else {
            interval = seconds / 86400;
            if (interval > 1) {
              setTimeString(Math.floor(interval) + 'd');
            } else {
              interval = seconds / 3600;
              if (interval > 1) {
                setTimeString(Math.floor(interval) + 'hr');
              } else {
                interval = seconds / 60;
                if (interval > 1) {
                  setTimeString(Math.floor(interval) + 'm');
                } else {
                  setTimeString(Math.floor(seconds) + 's');
                }
              }
            }
          }
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [date]);

  return <span>{timeString}</span>;
};

export default TimeSince;
