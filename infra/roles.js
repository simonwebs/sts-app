// server/main.js or server/startup.js
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { AppRoles } from './AppRoles';

Roles.createRole(AppRoles.ADMIN, { unlessExists: true})
Roles.createRole(AppRoles.SUPERADMIN, { unlessExists: true})
Roles.createRole(AppRoles.SUPPORT, { unlessExists: true})

Meteor.startup(() => {
  // Then, find the admin user by email.
  const user = Meteor.users.findOne({ 'emails.address': 'admin@cedarcbs.com' });
  
  // Check if the user exists and if they're not already an admin.
  if (user && !Roles.userIsInRole(user._id, AppRoles.ADMIN)) {
    Roles.addUsersToRoles(user._id, AppRoles.ADMIN);
  }
});

Meteor.startup(() => {
  const emails = [
    'fadecsolution@gmail.com',
    'teacher1@example.com',
    'teacher2@example.com',
    // ... other emails
    'teacher15@example.com',
  ];

  emails.forEach((email) => {
    const user = Meteor.users.findOne({ 'emails.address': email });

    if (user && !Roles.userIsInRole(user._id, AppRoles.SUPERADMIN)) {
      Roles.addUsersToRoles(user._id, AppRoles.SUPERADMIN);
    }
  });
});

Meteor.startup(() => {
 const emails = [
    'fadecsolution@gmail.com',
    's.agbey@yahoo.com',
    'student2@example.com',
    // ... other emails
    'student15@example.com',
  ];

  emails.forEach((email) => {
    const user = Meteor.users.findOne({ 'emails.address': email });
  if (user && !Roles.userIsInRole(user._id, AppRoles.SUPPORT)) {
    Roles.addUsersToRoles(user._id, AppRoles.SUPPORT);
    }
  });
});