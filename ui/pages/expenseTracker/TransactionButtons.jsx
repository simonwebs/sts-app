import React, { useState } from 'react';
import TransactionForm from './TransactionForm';

const TransactionButtons = ({ onAdd, isMobile }) => {
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const closeForm = () => {
    setShowTransactionForm(false);
  };

  return (
    <div className={`p-8 space-y-4 ${isMobile ? 'text-sm' : 'text-lg'}`}>
      <button
        className={`py-2 px-4 bg-primary text-white rounded ${isMobile ? 'text-sm' : 'text-lg'}`}
        onClick={() => setShowTransactionForm(true)}
      >
        Add Transaction
      </button>
      {showTransactionForm && (
        <div className="modal">
          <div className="modal-content p-5">
            <h2
              className="text-2xl text-gray-800 font-bold cursor-pointer"
              onClick={() => setShowTransactionForm(false)}
            >
            &times;
            </h2>
            <TransactionForm onAdd={onAdd} closeForm={closeForm} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionButtons;
