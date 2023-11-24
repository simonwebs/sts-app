import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Transactions } from '../../../api/collections/TransactionCollection';
import TransactionButtons from './TransactionButtons';
import { Meteor } from 'meteor/meteor';
//import Swal from 'sweetalert2';
import ClipLoader from 'react-spinners/ClipLoader';
import TimeSince from '../../components/TimeSince';

const ITEMS_PER_PAGE = 10;

const TransactionList = ({ isMobile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { transactions, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('userTransactions');
    return { transactions: Transactions.find().fetch(), loading: !handle.ready() };
  }, []);
 console.log('Raw Transactions:', transactions);

  const filteredTransactions = transactions.filter(transaction => {
    const dateString = transaction.createdAt ? transaction.createdAt.toDateString() : '';
    const textLower = transaction.text ? transaction.text.toLowerCase() : '';
    const amountString = transaction.amount ? transaction.amount.toString() : '';
    const categoryLower = transaction.category ? transaction.category.toLowerCase() : ''; 
    
    return textLower.includes(searchTerm.toLowerCase()) ||
           amountString.includes(searchTerm) ||
           dateString.includes(searchTerm) ||
           categoryLower.includes(searchTerm.toLowerCase()); 
  });
    console.log('Filtered Transactions:', filteredTransactions);



  const onAdd = (transaction) => {
    Meteor.call('transactions.add', transaction, (err, res) => {
      if (err) {
        console.error('Error adding transaction:', err);
      } else {
        console.log('Transaction added successfully.');
      }
    });
  };

  // const onDelete = (transactionId) => {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'This will permanently delete the transaction!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       Meteor.call('transactions.delete', transactionId, (err, res) => {
  //         if (err) {
  //           Swal.fire('Error', 'Failed to delete transaction.', 'error');
  //         } else {
  //           Swal.fire('Deleted!', 'Transaction has been deleted.', 'success');
  //         }
  //       });
  //     }
  //   });
  // };

  // const onEdit = (transaction) => {
  //   Swal.fire({
  //     title: 'Text',
  //     text: 'Edit transaction text',
  //     input: 'text',
  //     inputValue: transaction.text,
  //     showCancelButton: true,
  //     confirmButtonText: 'Next &rarr;',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const updatedText = result.value;

  //       Swal.fire({
  //         title: 'Amount',
  //         text: 'Edit transaction amount',
  //         input: 'number',
  //         inputValue: transaction.amount,
  //         showCancelButton: true,
  //         confirmButtonText: 'Next &rarr;',
  //       }).then((amountResult) => {
  //         if (amountResult.isConfirmed) {
  //           const updatedAmount = Number(amountResult.value);

  //           Swal.fire({
  //             title: 'Type',
  //             text: 'Edit transaction type',
  //             input: 'text',
  //             inputValue: transaction.type,
  //             showCancelButton: true,
  //             confirmButtonText: 'Save',
  //           }).then((typeResult) => {
  //             if (typeResult.isConfirmed) {
  //               const updatedType = typeResult.value;

  //               const updatedTransaction = {
  //                 ...transaction,
  //                 text: updatedText,
  //                 amount: updatedAmount,
  //                 type: updatedType,
  //               };

  //               // Call Meteor method to update the transaction
  //               Meteor.call('transactions.update', updatedTransaction, (err, res) => {
  //                 if (err) {
  //                   Swal.fire('Error', 'Failed to update transaction.', 'error');
  //                 } else {
  //                   Swal.fire('Success', 'Transaction updated successfully.', 'success');
  //                 }
  //               });
  //             }
  //           });
  //         }
  //       });
  //     }
  //   });
  // };

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  if (isLoading) {
    return <div><ClipLoader size={25} color={'#4C3BAB'} /></div>;
  }   
  console.log('Paginated Transactions:', paginatedTransactions);

  return (
    <div className="p-5 dark:text-gray-200">
      <div className="flex mb-4 items-center">
        {/* Search Input */}
        <div className="flex-grow relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, date or amount..."
            className="p-2 pl-8 border rounded-md w-full dark:bg-gray-600 dark:text-gray-200"
          />
          <span className="absolute left-2 top-2 text-gray-500">🔍</span>
        </div>

        {/* Transaction buttons */}
        <div className="ml-4">
          <TransactionButtons onAdd={onAdd} isMobile={isMobile} className='z-20 shadow-md relative' />
        </div>
      </div>

      {/* Transaction List */}
      <h3 className="text-2xl font-bold mb-4">Transaction List</h3>
      <div className="transaction-list-container mt-4 overflow-x-auto dark:bg-gray-600 dark:text-gray-200">
        <table className="min-w-full border rounded-lg overflow-hidden dark:bg-gray-600 dark:text-gray-200">
          <thead className="bg-gray-200 dark:bg-gray-500 dark:text-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
                 <th className="py-3 px-4 text-left">Grade</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="bg-gray-200 dark:bg-gray-500 dark:text-gray-200">
            {paginatedTransactions.map((transaction, index) => (
              <tr key={transaction._id} className={index % 2 === 0 ? 'dark:bg-gray-600 dark:text-gray-200 hover:border-b hover:border-cyan-500' : 'bg-gray-200  className="bg-gray-200 dark:bg-gray-500 dark:text-gray-200"'}>
                <td className="py-3 px-4">{transaction.text}</td>
                 <td className="py-3 px-4">{transaction.grade}</td>
                <td className="py-3 px-4 text-right">{transaction.amount}</td>
                <td className="py-3 px-4">{transaction.category}</td>
                <td className="py-3 px-4">
                  <TimeSince date={transaction.createdAt} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <button className="px-4 py-2 border rounded-l-md bg-blue-500 text-white" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
            Previous
          </button>
          <span className="px-4 py-2 border-t border-b">{currentPage}/{totalPages}</span>
          <button className="px-4 py-2 border rounded-r-md bg-blue-500 text-white" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;