import { Meteor } from 'meteor/meteor';
import { NewsletterCollection } from '../collections/NewsletterCollection';

Meteor.publish('allNewsletters', function publishAllNewsletters () {
  return NewsletterCollection.find();
});
