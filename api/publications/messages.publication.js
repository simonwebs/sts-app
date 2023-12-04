import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Messages } from '../collections/messages.collection';

if (Meteor.isClient) {
  Meteor.subscribe('myMessages');

  Tracker.autorun(() => {
    Messages.find({}).fetch();
  });
}

if (Meteor.isServer) {
  Meteor.publish('messages', function (otherUserId) {
    const query = otherUserId
      ? {
          $or: [
            { senderId: this.userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: this.userId },
          ],
        }
      : {
          $or: [
            { senderId: this.userId },
            { receiverId: this.userId },
          ],
        };
        const messages = Messages.find(query);

        return messages;
      });
}
