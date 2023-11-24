import { Meteor } from 'meteor/meteor';
import { Analytics } from '../collections/Analytics';

Meteor.publish('analytics', function () {
  return Analytics.find();
});
