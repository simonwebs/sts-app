import { UserProfiles } from './collections/UserProfiles';
import { UsersCollection } from './collections/UsersCollection';

export const calculateCompatibility = (user1, user2) => {
  // Example: A more complex algorithm considering shared interests, behavior, and age
  const sharedInterests = user1.interests.filter((interest) => user2.interests.includes(interest));

  // Adjust the weight based on the importance of each factor
  const behaviorWeight = 0.4; // Adjust as needed
  const ageWeight = 0.2; // Adjust as needed

  const behaviorSimilarity = user1.behavior === user2.behavior ? 20 * behaviorWeight : 0;
  const ageDifference = Math.abs(user1.age - user2.age);
  const ageCompatibility = (1 - ageDifference / 100) * 20 * ageWeight; // Assuming age ranges from 0 to 100

  const compatibilityScore =
    (sharedInterests.length / user1.interests.length) * 50 +
    behaviorSimilarity +
    ageCompatibility;

  // Return a compatibility score (a number between 0 and 100)
  return Math.floor(compatibilityScore);
};

export const updateCompatibility = (userId1, userId2) => {
  const user1 = UserProfiles.findOne(userId1);
  const user2 = UserProfiles.findOne(userId2);

  if (user1 && user2) {
    const compatibilityScore = calculateCompatibility(user1, user2);

    // Update compatibility scores in the database
    UserProfiles.update(userId1, { $set: { [`compatibility.${userId2}`]: compatibilityScore } });
    UserProfiles.update(userId2, { $set: { [`compatibility.${userId1}`]: compatibilityScore } });
  }
};
export const watchCompatibility = (userId) => {
  const user = UserProfiles.findOne(userId);

  if (user) {
    const compatibleUsers = {};

    // Watch for changes in the likedByUsers array
    user.likedByUsers.forEach((otherUserId) => {
      const compatibilityScore = user.compatibility[otherUserId] || 0;

      // Assuming you have a threshold for compatibility (adjust as needed)
      if (compatibilityScore >= 70) {
        const otherUser = UsersCollection.findOne(otherUserId);

        if (otherUser) {
          compatibleUsers[otherUserId] = {
            compatibilityScore,
            username: otherUser.username,
            image: otherUser.profile && otherUser.profile.images && otherUser.profile.images[0],
          };
        }
      }
    });

    // Do something with compatibleUsers (e.g., notify the user)
    console.log(`Compatible users for ${user._id}:`, compatibleUsers);
  }
};

// Additional logic or functions related to compatibility can be added here
