import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Transactions = new Mongo.Collection('transactions');

const TransactionsSchema = new SimpleSchema({
  _id: String,
  userId: String,
  text: String,
  amount: Number,
  type: {
    type: String,
    allowedValues: ['Income', 'Expense'],
  },
  category: {
    type: String,
    allowedValues: [
      'Income', 'School Fees', 'Canteen Expense', 'Canteen', 'Donation', 'Uniform', 'Salary', 'Salary Advance', 'Books',
      'Tithe', 'Investment', 'Transportation', 'Stationary', 'Light Bill',
      'Water bill', 'Telephone Calls', 'Internet Services', 'Bank Deposit',
      'Bank Withdrawer', 'MTN Deposit', 'MTN Withdrawer',
    ],
  },
  grade: {
    type: String,
    allowedValues: [
      'nursery 1',
      'nursery 2',
      'grade 1',
      'grade 2',
      'grade 3',
      'grade 4',
      'grade 5',
      'grade 6',
      'grade 7',
      'grade 8',
      'grade 9',
      'grade 10',
      'grade 11',
      'grade 12',
    ],
    optional: false,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert && !this.isSet) return new Date();
    },
  },
});

Transactions.attachSchema(TransactionsSchema);
