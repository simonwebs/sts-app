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

    const confirmationCode = Random.id();
    NewsletterCollection.insert({
      email,
      confirmed: false,
      confirmationCode,
      createdAt: new Date(),
    });

    this.unblock();
    Meteor.call('sendConfirmationEmail', email, confirmationCode);
  },

  'newsletter.confirm'(token) {
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

  'sendConfirmationEmail'(email, confirmationCode) {
    check(email, String);
    check(confirmationCode, String);

    const emailContent = {
      to: email,
      from: 'support@cedarcbs.com',
      subject: 'Confirm your email address',
      text: `Please confirm your email address by clicking the following link: ${Meteor.absoluteUrl()}confirm-email/${confirmationCode}`,
      html: `<p>Please confirm your email address by clicking the following link: <a href="${Meteor.absoluteUrl()}confirm-email/${confirmationCode}">Confirm Email</a></p>`
    };

    // It's a good practice to wrap the send operation in a try-catch block
    try {
      Email.send(emailContent);
    } catch (error) {
      throw new Meteor.Error('email-send-failed', 'Failed to send confirmation email');
    }
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
