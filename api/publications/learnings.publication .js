// @ts-nocheck
import { Meteor } from 'meteor/meteor';
import { LearningsCollection } from '../collections/learnings.collection';

Meteor.publish('myLearnings', function publishAllLearnings () {
  // const { userId } = this;
  // if (!userId) {
  //   throw new Meteor.Error('Access denied');
  // }
  return LearningsCollection.find(
    { archived: { $ne: true } },
    {
      fields: {
        createdAt: false,
      },
    },
  );
});
