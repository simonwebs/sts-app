import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import CanvasJSReact from '@canvasjs/react-charts';

const PostChart = () => {
  const [categoryPostCounts, setCategoryPostCounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Meteor.call('getDistinctCategories', (err, result) => {
      if (err) {
        setError(err);
        //console.error('Error fetching categories:', err.message);
        return;
      }

      const categories = result.categories.map(category => category.name);

      const countPromises = categories.map(category => {
        return new Promise((resolve, reject) => {
          Meteor.call('getPostCountByCategory', category, (error, count) => {
            if (error) {
              reject(error);
            } else {
              resolve({ y: count, label: category });
            }
          });
        });
      });

      Promise.all(countPromises)
        .then(data => {
          setCategoryPostCounts(data);
          setIsLoading(false);
        })
        .catch(error => {
          setError(error);
          setIsLoading(false);
          console.error('Error fetching post counts:', error.message);
        });
    });
  }, []);

  const options = {
    animationEnabled: true,
    exportEnabled: false, // Disabling exporting to remove watermark
    theme: 'light2',
    backgroundColor: 'transparent', // Setting background to transparent
    data: [{
      type: 'pie',
      indexLabel: '{label}: {y}',
      startAngle: -90,
      dataPoints: categoryPostCounts,
      toolTip: {
        backgroundColor: '#f9f9f9', // Making tooltip background lighter
        borderColor: '#ddd', // Adjusting tooltip border color
        fontColor: '#333', // Adjusting font color to make it visible
      },
    }],
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <CanvasJSReact.CanvasJSChart options={options} />
    </div>
  );
};

export default PostChart;
