// Import Picker from meteorhacks:picker
import { Picker } from 'meteor/meteorhacks:picker';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
// Import your UsersCollection
import { UsersCollection } from '../api/collections/UsersCollection';

// Define a new Picker route for searching users
Picker.route('/search-users', (params, req, res) => {
  // Get the search query from the request
  const searchQuery = req.query.q;

  // Fetch users from UsersCollection that match the search query
  const users = UsersCollection.find(
    {
      $or: [
        { username: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive username search
        // Add additional fields for searching here based on your schema
      ],
    },
    { fields: { username: 1, profile: 1 } },
  ).fetch();

  // Prepare user data
  const userData = users.map((user) => ({
    username: user.username,
    profileImage: user.profile.image,
  }));

  // Send user data as JSON
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(userData));
});
// Define a new Picker route
Picker.route('/all-users', (params, req, res, next) => {
  // Fetch users from UsersCollection
  const users = UsersCollection.find({}, { fields: { username: 1, profile: 1 } }).fetch();

  // Check if users exist
  if (users && users.length > 0) {
    // Prepare user data
    const userData = users.map(user => ({
      username: user.username,
      profileImage: user.profile.image,
    }));

    // Send user data as JSON
    res.end(JSON.stringify(userData));
  } else {
    // Send error message if no users found
    res.end(JSON.stringify({ error: 'No users found' }));
  }
});

Picker.route('/admin-route', async (params, req, res, next) => {
  // This assumes you have a way to get the userId from the request, e.g., a token.
  const authToken = req.headers['meteor-authorization']; // Replace with your token's header key
  const hashedToken = Accounts._hashLoginToken(authToken);

  // Find the user by the hashed token
  const user = Meteor.users.findOneAsync(
    { 'services.resume.loginTokens.hashedToken': hashedToken },
    { fields: { _id: 1, roles: 1 } },
  );

  if (!user) {
    res.end(JSON.stringify({ error: 'Not authorized' }));
    return;
  }

  const userId = user._id;
  const isAdmin = Roles.userIsInRole(userId, 'admin');

  if (isAdmin) {
    res.end(JSON.stringify({ message: 'Welcome to the admin route.' }));
  } else {
    res.end(JSON.stringify({ error: 'Not authorized' }));
  }
});
