import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import CategoryIncomeAndExpenseChart from './CategoryIncomeAndExpenseChart';

const FeesCard = ({ studentId }) => {
  const [categoryTotals, setCategoryTotals] = useState({});

  useEffect(() => {
    if (studentId) {
      Meteor.call('getStudentTransactions', studentId, (error, transactions) => {
        if (error) {
          console.error('Error fetching transactions', error);
        } else {
          // Process the transactions to calculate category totals
          const newCategoryTotals = transactions.reduce((acc, transaction) => {
            const { category, amount } = transaction;
            if (!acc[category]) {
              acc[category] = 0;
            }
            acc[category] += amount;
            return acc;
          }, {});
          
          setCategoryTotals(newCategoryTotals);
        }
      });
    }
  }, [studentId]);

  // Rest of your component code...

  return (
    <div>
      {/* Other components and JSX */}
      <CategoryIncomeAndExpenseChart categoryTotals={categoryTotals} />
    </div>
  );
};

export default FeesCard;
