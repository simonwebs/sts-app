import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

const TotalIncomeAndExpenseChart = ({ totalIncome, totalExpense, balance }) => {
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const total = totalIncome + Math.abs(totalExpense) + balance;
  const incomePercentage = (totalIncome / total) * 100;
  const expensePercentage = (Math.abs(totalExpense) / total) * 100;
  const balancePercentage = (balance / total) * 100;

  const options = {
    animationEnabled: true,
    title: {
      text: 'Income, Expense and Balance Overview',
      fontSize: 24,
    },
    data: [{
      type: 'pie',
      showInLegend: true,
      legendText: '{label}',
      indexLabelFontSize: 16,
      indexLabel: '{indexLabel}',
      dataPoints: [
        { label: 'Total Income', y: totalIncome, color: 'green', indexLabel: `Total Income - ${totalIncome} CFA (${incomePercentage.toFixed(2)}%)` },
        { label: 'Total Expense', y: totalExpense, color: 'red', indexLabel: `Total Expense - ${totalExpense} CFA (${expensePercentage.toFixed(2)}%)` },
        { label: 'Balance After Expenses', y: balance, color: 'blue', indexLabel: `Balance After Expenses - ${balance} CFA (${balancePercentage.toFixed(2)}%)` },
      ],
    }],
  };

  return (
    <div className="bg-white p-6 rounded-lg relative z-10 mt-4">
      <div className="mb-4">
        <p className="text-lg mb-1">Total Income: <span className="font-semibold text-green-500">{totalIncome} CFA</span></p>
        <p className="text-lg mb-1">Total Expense: <span className="font-semibold text-red-500">{totalExpense} CFA</span></p>
        <p className="text-lg mb-3">Balance After Expenses: <span className="font-semibold text-blue-500">{balance} CFA</span></p>
      </div>
       <div className="chart-container">
        <CanvasJSChart options={options} />
      </div>
    </div>
  );
};

export default TotalIncomeAndExpenseChart;
