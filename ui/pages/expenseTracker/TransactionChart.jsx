import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Transactions } from '../../../api/collections/TransactionCollection';
import TotalIncomeAndExpenseChart from './TotalIncomeAndExpenseChart';
import CategoryIncomeAndExpenseChart from './CategoryIncomeAndExpenseChart';

const TransactionChart = () => {
  const { transactions, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('userTransactions');
    return { transactions: Transactions.find().fetch(), loading: !handle.ready() };
  }, []);

  const totalIncome = transactions.reduce((sum, t) => (t.amount > 0 ? sum + t.amount : sum), 0);
  const totalExpense = transactions.reduce((sum, t) => (t.amount < 0 ? sum + t.amount : sum), 0);
  const balance = totalIncome + totalExpense;

  const categoryTotals = transactions.reduce((acc, t) => {
    if (acc[t.category]) {
      acc[t.category] += t.amount;
    } else {
      acc[t.category] = t.amount;
    }
    return acc;
  }, {});

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container mx-auto px-4 py-5 md:px-8 mt-5">
        <div>
           <div>
                <CategoryIncomeAndExpenseChart categoryTotals={categoryTotals} />
            </div>
            <div>
                <TotalIncomeAndExpenseChart totalIncome={totalIncome} totalExpense={totalExpense} balance={balance} />
            </div>
        </div>
    </div>
  );
};

export default TransactionChart;
