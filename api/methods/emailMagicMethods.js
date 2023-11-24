import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';

Meteor.methods({
  'email.sendMagicLink' (data) {
    // Make sure that the data argument is an object
    check(data, Object);

    // Logic for sending email
    Email.send({
      to: data.to,
      from: 'no-reply@cedarcbs.com',
      subject: 'Magic Link for Login',
      text: `Click on the following link to login: ${data.url}`,
    });
  },

});
