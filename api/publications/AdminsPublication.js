import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
Meteor.publish('userRoles', function () {
  console.log('userRoles', Meteor)
  if (!this.userId) {
    return this.ready();
  }
  return Meteor.users.find({ _id: this.userId }, {
    fields: { roles: 1 }
  });
});

}
