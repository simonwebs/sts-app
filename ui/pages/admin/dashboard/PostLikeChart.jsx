import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar } from 'react-chartjs-2';

const PostLikeChart = ({ data }) => {
  const [options, setOptions] = useState({
    title: {
      text: 'Bar Chart',
    },
    xAxis: {
      title: {
        text: 'Categories',
      },
    },
    yAxis: {
      title: {
        text: 'Values',
      },
    },
  });

  return (
    <BarChart
      data={data}
      options={options}
      height={300}
      width={500}
    />
  );
};

PostLikeChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PostLikeChart;
