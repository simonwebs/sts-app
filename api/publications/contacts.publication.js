import { Meteor } from 'meteor/meteor';
import { ContactsCollection } from '../collections/contacts.collection';

Meteor.publish('allContacts', function () {
  return ContactsCollection.find();
});
