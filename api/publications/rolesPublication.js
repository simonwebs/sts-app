import { Meteor } from 'meteor/meteor';

Meteor.publish('userRoleComposite', function () {
  if (!this.userId) return this.ready();

  return Meteor.users.find({_id: this.userId}, {
    fields: {
      roles: 1,
      username: 1,
      email: 1,
    }
  });
});
