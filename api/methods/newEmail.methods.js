// @ts-nocheck
import { Meteor } from 'meteor/meteor';
import { sendEmail } from 'meteor/quave:email-postmark';

Meteor.methods({
  newEmail ({ to, subject, content }) {
    sendEmail({
      to,
      subject,
      content,
    })
      .then(() => {
        throw new Meteor.Error(`Email sent to ${to}`);
      })
      .catch(error => {
        throw new Meteor.Error(`Error sending email to ${to}`, error);
      });
  },
});
