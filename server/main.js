import { Meteor } from 'meteor/meteor';
import { PostsCollection } from '../api/collections/posts.collection';
import { calculateCompatibility } from '../api/compatibility';

import './appConfig';
import './security';
import './routes';
import '../api/apiImports';
import '../infra/CustomError';
import '../infra/roles';
import '../api/publications/rolesPublication';
import '../infra/accounts';
import '../api/methods/RolesMethods';
import '../api/collections/UsersCollection';
import '../api/methods/usersMethods';
import '../api/publications/usersPublication';
import '../api/collections/Images';
import '../api/methods/emailMagicMethods';

Meteor.startup(() => {
  // Set up email
  process.env.MAIL_URL = process.env.SMTP_URL || 'smtp://username:password@smtp.thatconnect.meteorapp.com:587';

  // Use a default value if Meteor.settings or public or appInfo or name is undefined
  const appName = Meteor.settings?.public?.appInfo?.name || 'DefaultAppName';
  process.env.ROOT_URL = process.env.ROOT_URL || appName;

  try {
    initializePosts();
  } catch (error) {
    // console.error("An error occurred during initialization:", error);
  }

  const user1 = {
    interests: ['hiking', 'cooking', 'traveling'],
    behavior: 'introverted',
    relationshipPreferences: {
      marriage: true,
      friendship: false,
    },
  };

  const user2 = {
    interests: ['cooking', 'reading', 'gardening'],
    behavior: 'extroverted',
    relationshipPreferences: {
      marriage: false,
      friendship: true,
    },
  };

  // Calculate compatibility score
  const compatibilityScore = calculateCompatibility(user1, user2);
  console.log(`Compatibility Score: ${compatibilityScore}`);

  // Log the compatibility score (you might want to use it in your UI)
  console.log(`Compatibility Score: ${compatibilityScore}`);
});

function initializePosts () {
  try {
    PostsCollection.find({}).forEach((post) => {
      if (!Array.isArray(post.loves)) {
        PostsCollection.update(post._id, {
          $set: { loves: [] },
        });
      }
    });
  } catch (error) {
    // Handle errors during initialization
  }
}

// On server side
Meteor.publish(null, function () {
  if (!this.userId) return this.ready();
  return Meteor.users.find({ _id: this.userId }, { fields: { roles: 1 } });
}, { is_auto: true }); // This auto-publishes without needing an explicit subscription

Meteor.publish(null, function () {
  if (!this.userId) return this.ready();
  return Meteor.users.find({ _id: this.userId }, { fields: { roles: 1 } });
}, { is_auto: true });

Meteor.publish('userRoles', function () {
  if (!this.userId) {
    return this.ready();
  }
  return Meteor.users.find({ _id: this.userId }, { fields: { roles: 1 } });
});
