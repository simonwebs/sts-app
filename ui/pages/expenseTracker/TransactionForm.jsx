import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Meteor } from 'meteor/meteor';

const TransactionForm = ({ initialText, initialGrade, closeForm }) => {
  const [text, setText] = useState(initialText || '');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Salary');
  const [grade, setGrade] = useState(initialGrade);
  const [transactionType, setTransactionType] = useState('Income');
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  useEffect(() => {
    setText(initialText || '');
  }, [initialText]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const adjustedAmount = transactionType === 'Expense' ? -Math.abs(amount) : Math.abs(amount);
    const transaction = {
      userId: Meteor.userId(),
      text,
      amount: adjustedAmount,
      category,
      grade,
    };

    try {
      await new Promise((resolve, reject) => {
        Meteor.call('transactions.add', transaction, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });

      Swal.fire({
        title: 'Transaction Added!',
        text: `Text: ${text}, Amount: ${adjustedAmount}, Category: ${category}, Grade: ${grade}`,
        icon: 'success',
      }).then((result) => {
        setText('');
        setAmount('');
        setCategory('Salary');
        setGrade('');
        setTransactionType('Income');
      });

      if (closeForm) {
        closeForm();
      }
    } catch (error) {
      Swal.fire('Error', error.reason || 'An error occurred while adding the transaction.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
   <div className="p-8 bg-gray-900 text-white shadow-md z-999 relative">
    <h3 className="text-3xl font-semibold mb-6">Add new transaction</h3>
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-col">
        <label htmlFor="transactionType" className="mb-2">Transaction Type</label>
        <select id="transactionType" value={transactionType} onChange={(e) => setTransactionType(e.target.value)} className="p-2 border border-gray-700 bg-gray-800 rounded shadow-md">
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label htmlFor="text" 
        className="mb-2">Name</label>
        <input type="text" id="text" 
        value={text} onChange={(e) => setText(e.target.value)} 
        placeholder="Enter text..." 
        className="p-2 border border-gray-700 bg-gray-800 rounded shadow-md" />
      </div>
      <div className="flex flex-col">
          <label htmlFor="grade" className="mb-2">Grade</label>
          <select id="grade" value={grade} onChange={(e) => setGrade(e.target.value)} className="p-2 border border-gray-700 bg-gray-800 rounded shadow-md">
            <option value="">Select grade</option>
          <option value="nursery 1">Nursery</option>
            <option value="nursery 2">Nursery</option>
          <option value="grade 1">Grade 1</option>
          <option value="grade 2">Grade 2</option>
          <option value="grade 3">Grade 3</option>
          <option value="grade 4">Grade 4</option>
          <option value="grade 5">Grade 5</option>
          <option value="grade 6">Grade 6</option>
          <option value="grade 7">Grade 7</option>
          <option value="grade 8">Grade 8</option>
          <option value="grade 9">Grade 9</option>
          <option value="grade 10">Grade 10</option>
          <option value="grade 11">Grade 11</option>
          <option value="grade 12">Grade 12</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label htmlFor="amount" className="mb-2">Amount</label>
        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount..." className="p-2 border border-gray-700 bg-gray-800 rounded shadow-md" />
      </div>
      <div className="flex flex-col">
        <label htmlFor="category" className="mb-2">Category</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border border-gray-700 bg-gray-800 rounded shadow-md">
    <option value="Income">Income</option>
    <option value="School Fees">School Fees</option>
    <option value="Canteen">Canteen</option>
       <option value="Canteen Expense">Canteen Expense</option>
     <option value="Salary">Salary</option>
      <option value="Salary Advance">Salary Advance</option>
    <option value="Donation">Donation</option>
    <option value="Uniform">Uniform</option>
    <option value="Books">Books</option>
    <option value="Tithe">Tithe</option>
    <option value="Investment">Investment</option>
    <option value="Transportation">Transportation</option>
    <option value="Stationary">Stationary</option>
    <option value="Light Bill">Light Bill</option>
    <option value="Water bill">Water Bill</option>
    <option value="Telephone Calls">Telephone Calls</option>
    <option value="Internet Services">Internet Services</option>
    <option value="Bank Deposit">Bank Deposit</option>
    <option value="Bank Withdrawer">Bank Withdrawer</option>
    <option value="MTN Deposit">MTN Deposit</option>
    <option value="MTN Withdrawer">MTN Withdrawer</option>
   </select>
      </div>
     <button
          type="submit"
          disabled={isSubmitting}
          className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded shadow-md transition-colors duration-300"
        >
          {isSubmitting ? 'Submitting...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
