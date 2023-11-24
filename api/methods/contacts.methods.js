import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ContactsCollection } from '../collections/contacts.collection';
import { Email } from 'meteor/email';

Meteor.methods({
  'contacts.insert' ({ name, email, subject, description }) {
    check(name, String);
    check(email, String);
    check(subject, String);
    check(description, String);

    if (!name) {
      throw new Meteor.Error('Name is required.');
    }
    if (!email) {
      throw new Meteor.Error('Email is required.');
    }
    if (!subject) {
      throw new Meteor.Error('Subject is required.');
    }
    if (!description) {
      throw new Meteor.Error('description is required.');
    }

    // Insert contact into the collection
    const contactId = ContactsCollection.insert({
      name,
      email,
      subject,
      description,
      createdAt: new Date(),
    });

    // Send email
    Email.send({
      to: email,
      from: 'support@cedarcbs.com',
      subject: `Thank you for contacting us, ${name}`,
      text: `Hello ${name},\n\nThank you for contacting us. We have received your message with the subject: ${subject}. We will get back to you as soon as possible.\n\nBest regards,\nYour Company`,
    });

    return contactId;
  },
  'contacts.archive' ({ contactId }) {
    check(contactId, String);
    ContactsCollection.update({ _id: contactId }, { $set: { archived: true } });
  },
  'contacts.removeMany' (contactIds) {
    check(contactIds, Array);
    contactIds.forEach((contactId) => {
      check(contactId, String);
      ContactsCollection.remove(contactId);
    });
  },
  'contacts.remove' (contactId) {
    check(contactId, String);
    ContactsCollection.remove(contactId);
  },
  'contacts.update' ({ contactId }) {
    check(contactId, String);
    ContactsCollection.update(contactId);
  },
});
