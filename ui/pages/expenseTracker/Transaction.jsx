// components/Transaction.js
import React from 'react';

const Transaction = ({ transaction }) => {
  const sign = transaction.amount < 0 ? '-' : '+';

  return (
    <li className={`flex justify-between items-center py-2 px-4 my-2 rounded ${transaction.amount < 0 ? 'bg-red-100' : 'bg-green-100'}`}>
      <div>
        {transaction.text}
      </div>
      <div className="flex items-center">
        <span className="mr-4">{sign}${Math.abs(transaction.amount)}</span>
        <button className="bg-red-500 text-white py-1 px-2 rounded ml-4">x</button>
      </div>
    </li>
  );
};

export default Transaction;
