// @ts-nocheck
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { LearningsCollection } from '../collections/learnings.collection';

Meteor.methods({
  'learnings.insert' ({ title, video, description, date, category, author, image }) {
    const { userId } = this;
    if (!userId) {
      throw new Meteor.Error('Access denied');
    }
    check(title, String);
    check(video, String);
    check(image, String);
    check(author, String);
    check(description, String);
    check(category, String);
    check(date, String);
    check(userId, String);

    if (!video) {
      throw new Meteor.Error('Photo is required.');
    }
    if (!image) {
      throw new Meteor.Error('Photo is required.');
    }
    if (!title) {
      throw new Meteor.Error('Title is required.');
    }

    if (!date) {
      throw new Meteor.Error('Date is required.');
    }
    if (!category) {
      throw new Meteor.Error('Category is required.');
    }
    if (!author) {
      throw new Meteor.Error('Author is required.');
    }
    if (!description) {
      throw new Meteor.Error('Content is required.');
    }

    return LearningsCollection.insert({
      title,
      video,
      date,
      description,
      author,
      image,
      category,
      createdAt: new Date(),
      userId,
    });
  },
  'learnings.archive' ({ learningId }) {
    check(learningId, String);

    LearningsCollection.update({ _id: learningId }, { $set: { archived: true } });
  },
  'learnings.remove' ({ learningId }) {
    check(learningId, String);

    LearningsCollection.remove(learningId);
  },
  'learnings.update' ({ learningId }) {
    check(learningId, String);
    LearningsCollection.update(learningId);
  },
});
