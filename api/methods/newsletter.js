import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';
import { Email } from 'meteor/email';
import emailValidator from 'email-validator';
import { NewsletterCollection } from '../collections/NewsletterCollection';

Meteor.methods({
  'newsletter.insert'(email) {
    check(email, String);

    if (!emailValidator.validate(email)) {
      throw new Meteor.Error('invalid-email', 'Invalid email address');
    }

    const existingEmail = NewsletterCollection.findOne({ email });
    if (existingEmail) {
      throw new Meteor.Error('email-exists', 'Email already subscribed');
    }

    const confirmationCode = Random.id(6);

    NewsletterCollection.insert({
      email,
      confirmed: false,
      confirmationCode,
      createdAt: new Date(),
    });

    Meteor.call('sendConfirmationEmail', email, confirmationCode);
  },

  'newsletter.removeMultiple'(ids) {
    check(ids, Array);
    NewsletterCollection.remove({ _id: { $in: ids } });
  },

'newsletter.confirm': function(token) {
    check(token, String);
    
    const subscription = NewsletterCollection.findOne({ confirmationCode: token });
    if (!subscription) {
      throw new Meteor.Error('invalid-token', 'Invalid confirmation token');
    }

    if (subscription.confirmed) {
      return { status: 'already-confirmed' };
    }

    NewsletterCollection.update(subscription._id, { $set: { confirmed: true } });
    return { status: 'confirmed' };
  },
  'newsletter.update'({ emailId, newFields }) {
    check(emailId, String);
    check(newFields, Object);
    NewsletterCollection.update(emailId, { $set: newFields });
  },
 'sendConfirmationEmail'(email, confirmationCode) {
    check(email, String);
    check(confirmationCode, String);
    Email.send({
      to: email,
      from: 'support@cedarcbs.com',
      subject: 'Confirm your email address',
      text: `Confirm your email address by clicking the following link: ${Meteor.absoluteUrl()}confirm-email/${confirmationCode}`,
      html: `
        <html>
          <body>
            <h1>Confirm your email address</h1>
            <p>
              Confirm your email address by clicking the following link: 
              <a href="${Meteor.absoluteUrl()}confirm-email/${confirmationCode}">Confirm Email</a>
            </p>
          </body>
        </html>
      `
    });
  },

  'newsletter.archive'({ emailId }) {
    check(emailId, String);
    NewsletterCollection.update(
      { _id: emailId },
      { $set: { archived: true } },
    );
  },

   'sendWelcomeEmail'(email) {
    check(email, String);
    Email.send({
      to: email,
      from: 'support@cedarcbs.com',
      subject: 'Welcome to cedarcbs',
      text: 'Welcome to cedarcbs! Thank you for joining us.',
      html: `
        <html>
          <body>
            <h1>Welcome to cedarcbs</h1>
            <p>Thank you for joining us.</p>
          </body>
        </html>
      `
    });
  },
});
