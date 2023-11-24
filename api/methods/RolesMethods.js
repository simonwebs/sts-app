import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';
import { Accounts } from 'meteor/accounts-base';
import { AppRoles } from '../../infra/AppRoles';
import { Roles } from 'meteor/alanning:roles';

// Helper Functions
const checkUserRole = (userId, roles) => {
  return Roles.userIsInRole(userId, roles);
};

// Meteor Methods
Meteor.methods({
  //z
  'roles.isAdmin'(){
const { userId } = this;
if(!userId){
throw new Error('Access denied');
}
return Roles.userIsInRole(userId, AppRoles.ADMIN);
  },

  'sendLoginToken': function (email) {
    check(email, String);

    const user = Accounts.findUserByEmail(email);
    if (!user) {
      throw new Meteor.Error('user-not-found', 'User not found');
    }

    // Check if the current user has permission to send login tokens
    if (!checkUserRole(this.userId, ['admin', 'super-admin'])) {
      throw new Meteor.Error('not-authorized', 'You are not authorized to send login tokens.');
    }

    const stampedToken = Accounts._generateStampedLoginToken();
    Accounts._insertLoginToken(user._id, stampedToken);
    
    Email.send({
      to: email,
      from: 'Seychelles IMS Multimedia <noreply@seyimsmultimedia.com>',
      subject: 'Your Login Token for Seychelles IMS Multimedia',
      text: `Here is your login token: ${stampedToken.token}\n\nYou can use it to sign in securely to your account.`,
    });
  },
  'getUserData': function (userId) {
    check(userId, String);

    // Check if the current user has permission to fetch user data
    if (!checkUserRole(this.userId, ['admin', 'super-admin'])) {
      throw new Meteor.Error('not-authorized', 'You are not authorized to access user data.');
    }

    const user = Meteor.users.findOne({ _id: userId }, {
      fields: { 'profile.name': 1, 'emails.address': 1 }
    });

    if (!user) {
      throw new Meteor.Error('user-not-found', 'User not found');
    }

    return user;
  },
    'user.checkIfAdmin'() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to check if you are an admin.');
    }
    return Roles.userIsInRole(this.userId, 'admin');
  },
  // ... other methods ...
});

Meteor.startup(() => {
  // Ensure index on the 'emails.address' field for faster lookups
  Meteor.users.createIndex({ 'emails.address': 1 });
});
