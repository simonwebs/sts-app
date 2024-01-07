// server/publications.js
import { Meteor } from 'meteor/meteor';
import { Transactions } from '../collections/TransactionCollection';

Meteor.publish('userTransactions', function () {
  const userId = this.userId;

  if (!userId) {
    return this.ready();
  }

  const transactions = Transactions.find({ userId });
  // console.log('Publishing transactions for user: ', userId, transactions.fetch());

  return transactions;
});

Meteor.publish('myTransactions', function () {
  return Transactions.find({ userId: this.userId });
});
