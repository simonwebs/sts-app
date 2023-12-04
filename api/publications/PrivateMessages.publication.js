import { Meteor } from 'meteor/meteor';
import { PrivateMessages } from '../collections/privateMessages.collection';
import { Notifications } from '../collections/notifications.collection'; // Import Notifications collection

Meteor.publish('privateMessages', function (senderId, receiverId) {
  if (!this.userId) {
    return this.ready();
  }

  const userIds = [senderId, receiverId].sort();
  const [sId, rId] = userIds;

  // Update: Notify the receiver about the new message
  const notificationId = Notifications.insert({
    userId: rId,
    message: 'You have a new message', // Customize the notification message
    timestamp: new Date(),
    read: false,
  });

  const privateMessagesCursor = PrivateMessages.find(
    {
      $or: [
        { senderId: sId, receiverId: rId },
        { senderId: rId, receiverId: sId },
      ],
    },
    {
      fields: {
        senderId: 1,
        receiverId: 1,
        readBy: 1,
        messageText: 1,
        timestamp: 1,
        deletedBy: 1,
        likes: 1,
      },
    }
  );

  // Update: Remove the notification once the user reads it
  privateMessagesCursor.observeChanges({
    added: () => {
      Notifications.remove(notificationId);
    },
  });

  return privateMessagesCursor;
});
