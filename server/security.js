// server/security.js
import { UserProfiles } from '../api/collections/UserProfiles';

UserProfiles.allow({
  insert (userId) {
    // Allow users to insert documents only if they are logged in
    return !!userId;
  },
  update (userId, doc) {
    // Allow users to update their own documents
    return userId && userId === doc.authorId;
  },
  remove (userId, doc) {
    // Allow users to remove their own documents
    return userId && userId === doc.authorId;
  },
});
