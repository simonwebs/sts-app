// server/publications.js
import { Meteor } from 'meteor/meteor';
import { HistoriesCollection } from '../collections/HistoriesCollection';

Meteor.publish('history', function publishHistories () {
  const { userId } = this;
  if (!userId) {
    throw new Meteor.Error('Access denied');
  }

  return HistoriesCollection.find({ userId });
});
