import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Transactions } from '../collections/TransactionCollection';

Meteor.methods({
  'transactions.add': function (transaction) {
    check(transaction, {
      userId: String,
      text: String,
      amount: Number,
        grade: Match.Maybe(String),
      category: String,
    });

    const { userId, text, amount, category, grade } = transaction;

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (amount === 0) {
      throw new Meteor.Error('invalid-amount', 'Amount cannot be zero');
    }

    const type = amount > 0 ? 'Income' : 'Expense';

    Transactions.insert({
      userId,
      text,
      amount,
      type,
      grade,
      category,
      createdAt: new Date(),
    });
  },
  'transactions.update': function (transaction) {
    if (!this.userId) {
      throw new Meteor.Error('User not authorized');
    }

    Transactions.update(transaction._id, {
      $set: {
        text: transaction.text,
        amount: transaction.amount,
        type: transaction.type,
        // add other fields if necessary
      },
    });
  },
  'transactions.delete': function (transactionId) {
    check(transactionId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Transactions.remove(transactionId);
  },

  'transactions.getGeneralTotals': function () {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const transactions = Transactions.find({ userId: this.userId }).fetch();

    const totalIncome = transactions.reduce((total, transaction) => {
      if (transaction.amount > 0) return total + transaction.amount;
      return total;
    }, 0);

    const totalExpense = transactions.reduce((total, transaction) => {
      if (transaction.amount < 0) return total + transaction.amount;
      return total;
    }, 0);

    const balance = totalIncome + totalExpense;

    return { totalIncome, totalExpense, balance };
  },

  getTransactionCountByCategory: function (category) {
    check(category, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const transactions = Transactions.find({ userId: this.userId, category }).fetch();

    const totalIncome = transactions.reduce((total, transaction) => {
      if (transaction.amount > 0) return total + transaction.amount;
      return total;
    }, 0);

    const totalExpense = transactions.reduce((total, transaction) => {
      if (transaction.amount < 0) return total + transaction.amount;
      return total;
    }, 0);

    return { totalIncome, totalExpense };
  },
 
});
