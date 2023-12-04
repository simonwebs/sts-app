import { Meteor } from 'meteor/meteor';
import { PostsCollection } from '../api/collections/posts.collection';
import $ from 'jquery'; 

import './appConfig';
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
  if (Meteor.isClient) {
    const googleAnalyticsId = Meteor.settings.public.googleAnalyticsId;

    $.getScript(`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`, function() {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', googleAnalyticsId);
    });
  }
});

  Meteor.startup(() => {
  // Set up email
  process.env.MAIL_URL = process.env.SMTP_URL || 'smtp://username:password@smtp.thatconnect.meteorapp.com:587';
  Meteor.settings?.public?.appInfo?.name || process.env.ROOT_URL;

    try {
    initializePosts();
  
  } catch (error) {
    //console.error("An error occurred during initialization:", error);
  }
  
  });

function initializePosts() {
  try {
    PostsCollection.find({}).forEach((post) => {
      if (!Array.isArray(post.loves)) {
        PostsCollection.update(post._id, {
          $set: { loves: [] },
        });
      }
    });
  } catch (error) {
   // console.error("An error occurred while initializing posts:", error);
  }
}
// On server side
Meteor.publish(null, function () {
  if (!this.userId) return this.ready();
  return Meteor.users.find({ _id: this.userId }, { fields: { roles: 1 } });
}, { is_auto: true }); // This auto-publishes without needing an explicit subscription

Meteor.publish('userRoles', function () {
  if (!this.userId) {
    console.log('Publishing details for student ID: null');
    return this.ready();
  }

  console.log('Publishing details for student ID:', this.userId);
  return Meteor.users.find({ _id: this.userId }, { fields: { roles: 1 } });
});
