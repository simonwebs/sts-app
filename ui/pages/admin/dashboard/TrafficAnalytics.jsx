// TrafficAnalytics.jsx
import React, { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

const TrafficAnalytics = ({ analyticsData }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (analyticsData && analyticsData.length > 0) {
      const locationData = analyticsData.reduce((acc, cur) => {
        acc[cur.location] = (acc[cur.location] || 0) + 1;
        return acc;
      }, {});

      const dataPoints = Object.keys(locationData).map(location => ({
        label: location,
        y: locationData[location],
      }));

      setChartData(dataPoints);
    }
  }, [analyticsData]);

  const options = {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: 'Visitors by Location',
    },
    axisY: {
      title: 'Number of Visitors',
    },
    data: [{
      type: 'column',
      dataPoints: chartData,
    }],
  };

  return (
    <CanvasJSReact.CanvasJSChart options={options} />
  );
};

export default TrafficAnalytics;
