import React from 'react';
import PostChart from './PostChart';
import TrafficAnalytics from './TrafficAnalytics';

const MainAnalytics = ({ analyticsData }) => {
  return (
    <div className="flex flex-col space-y-4">
        <PostChart />
        <TrafficAnalytics analyticsData={analyticsData} />
    </div>
  );
};

export default MainAnalytics;
