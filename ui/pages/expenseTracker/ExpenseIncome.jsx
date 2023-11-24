import React from 'react';
import { useMediaQuery } from 'react-responsive';
import TransactionList from './TransactionList';

const ExpenseIncome = ({ onAdd }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <div className="container">
      <TransactionList onAdd={onAdd} isMobile={isMobile} />
    </div>
  );
};

export default ExpenseIncome;
