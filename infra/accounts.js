import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { RoutePaths } from '../ui/common/general/RoutePaths';
import { ServiceConfiguration } from 'meteor/service-configuration';
import { Roles } from 'meteor/alanning:roles';
import { UsersCollection } from '../api/collections/UsersCollection'; // Adjust the import path as needed

// Helper function to get the name for the user
function getNameFromUser(user) {
  if (user.services?.google?.given_name) {
    return `${user.services.google.given_name}, ${user.telephone || ''}`;
  }
  return `${user.username || user.emails[0].address.split('@')[0]}, ${user.telephone || ''}`;
}

Accounts.emailTemplates.siteName = 'Cedar Christian Bilingual School';
Accounts.emailTemplates.from = 'noreply@cedarcbs.com';
Accounts.emailTemplates.replyTo = 'support@cedarcbs.com';
Accounts.emailTemplates.enrollAccount.subject = (user) => {
  const name = user.profile && user.profile.name ? user.profile.name : 'User';
  return `Welcome to Cedar Christian Bilingual School, ${name}`;
};

// Reset password template setup
Accounts.emailTemplates.resetPassword = {
  subject() {
    return 'Reset Your Password';
  },
  text(user, url) {
    const username = getNameFromUser(user);
    return `Hello ${username},\n\nTo reset your password, simply click the link below:\n\n${url}\n\nThanks,\nThe Cedar Christian Bilingual School Team`;
  },
  html(user, url) {
    const username = getNameFromUser(user);
    return `Hello ${username},<br/><br/>To reset your password, simply click the link below:<br/><br/><a href="${url}">${url}</a><br/><br/>Thanks,<br/>The Cedar Christian Bilingual School Team`;
  },
};

// Overwrite the password reset URL
Accounts.urls.resetPassword = (token) => Meteor.absoluteUrl(`${RoutePaths.RESET_PASSWORD.substring(1)}/${token}`);



Accounts.onCreateUser((options, user) => {
  user.profile = options.profile || {};
 // Set a default placeholder profile image if one isn't provided
  user.profile.image = user.profile.image || 'https://via.placeholder.com/150';

  // Here, you need to add additional code to handle the username generation if it's not provided
  if (!user.username && user.emails) {
    let newUsername = user.emails[0].address.split('@')[0].replace(/\./g, '_');
    let suffix = 0;
    while (UsersCollection.findOne({ username: newUsername }, { fields: { _id: 1 } })) {
      suffix++;
      newUsername = `${user.emails[0].address.split('@')[0].replace(/\./g, '_')}${suffix}`;
    }
    user.username = newUsername;
  }

  // Set default roles
  user.roles = options.roles || ['user'];

  // Defer role assignment until after the user document is inserted
  Meteor.defer(() => {
    if (Array.isArray(user.roles)) {
      user.roles.forEach((role) => {
        Roles.createRole(role, { unlessExists: true });
        Roles.addUsersToRoles(user._id, role);
      });
    }
  });

  return user;
});


// Login and Logout hooks to update user status
Accounts.onLogin(({ user }) => {
  Meteor.users.update(user._id, { $set: { 'status.online': true } });
});

Accounts.onLogout(({ user }) => {
  if (user && user._id) {
    Meteor.users.update(user._id, { $set: { 'status.online': false } });
  }
});
// On server startup, configure third-party services
Meteor.startup(() => {
  // Google OAuth configuration
  const { googleClientId, googleSecret } = Meteor.settings;
  if (!googleClientId || !googleSecret) {
    throw new Error('Google client ID and secret are required in Meteor settings');
  }

  ServiceConfiguration.configurations.upsert(
    { service: 'google' },
    {
      $set: {
        clientId: googleClientId,
        secret: googleSecret,
        loginStyle: 'popup',
        redirectUri: 'https://thatconnect.meteorapp.com//_oauth/google',
        requestPermissions: ['profile', 'email'],
      },
    }
  );

  // Facebook OAuth configuration
  const { facebookAppId, facebookSecret } = Meteor.settings;
  if (facebookAppId && facebookSecret) {
    ServiceConfiguration.configurations.upsert(
      { service: 'facebook' },
      {
        $set: {
          appId: facebookAppId,
          secret: facebookSecret,
        },
      }
    );
  }
});
