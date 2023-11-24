import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

const CategoryIncomeAndExpenseChart = ({ categoryTotals = {} }) => {
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const colors = ['#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F', '#EDC948', '#B07AA1', '#FF9DA7', '#9C755F', '#BAB0AC'];

  // Calculate total income, total expense, and overall total
  const totalIncome = Object.values(categoryTotals).filter(value => value > 0).reduce((acc, curr) => acc + curr, 0);
  const totalExpense = Object.values(categoryTotals).filter(value => value < 0).reduce((acc, curr) => acc + curr, 0);
  const balance = totalIncome + totalExpense; // Calculate the balance
  const overallTotal = totalIncome + Math.abs(totalExpense);

  // Prepare data for the chart with percentages
  const chartData = Object.entries(categoryTotals).map(([category, total], index) => {
    const percentage = ((total / overallTotal) * 100).toFixed(2);
    return {
      label: category,
      y: total,
      color: colors[index % colors.length],
      percentage,
    };
  });

  const highestValue = Math.max(...chartData.map(data => data.y));

  const options = {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: 'Category Totals',
      fontColor: 'black',
      fontSize: 20,
    },
    axisY: {
      title: 'Amount',
      maximum: highestValue + (0.1 * highestValue),
    },
    data: [{
      type: 'column',
      toolTipContent: '<b>{label}</b>: {y} CFA ({percentage}%)',
      showInLegend: true,
      legendText: '{label} ({y} CFA - {percentage}%)',
      dataPoints: chartData,
    }],
  };

  return (
    <div className="bg-white p-6 rounded-lg w-full md:w-2/3 lg:w-1/2 mx-auto">
      <div className="mt-4">
        <CanvasJSChart options={options} className='z-5'/>
      </div>
    </div>
  );
};

export default CategoryIncomeAndExpenseChart;
