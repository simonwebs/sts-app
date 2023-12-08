import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { UserProfiles, Messages } from '../../api/collections/UserProfiles';

const MatchList = () => {
  const currentUser = useTracker(() => Meteor.user(), []);
  const [matchedUsers, setMatchedUsers] = useState([]);

  useEffect(() => {
    const fetchMatchedUsers = async () => {
      if (currentUser && currentUser.profile) {
        console.log('Subscribing to matchedUserProfiles');

        // Subscribe to matchedUserProfiles with the current user's _id
        const subscription = Meteor.subscribe('matchedUserProfiles', currentUser._id);

        // Wait for the subscription to be ready
        if (subscription.ready()) {
          // Fetch matched user profiles
          const matchedUsersCursor = UserProfiles.find({ matches: currentUser._id });
          const matchedUsersArray = matchedUsersCursor.fetch();

          console.log('Matched Users:', matchedUsersArray);
          setMatchedUsers(matchedUsersArray);
        }
      }
    };

    fetchMatchedUsers();
  }, [currentUser]);

  const startChat = (otherUserId) => {
    console.log('Starting chat with user ID:', otherUserId);

    const chatExists = !!Messages.findOne({
      $or: [
        { senderId: currentUser._id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUser._id },
      ],
    });

    if (chatExists) {
      console.log(`Chat with ${otherUserId} already exists.`);
    } else {
      console.log(`Start new chat with ${otherUserId}.`);
      // Logic to initiate a new chat
    }
  };

  return (
    <div>
      <h2>Your Matches</h2>
      <ul>
        {matchedUsers.map((user) => (
          <li key={user._id}>
            <div>
              <p>{`${user.firstName} ${user.lastName}`}</p>
              <p>{`Bio: ${user.personalBio || 'No bio available'}`}</p>
              <p>{`Age: ${user.age}`}</p>
              <p>{`Country: ${user.country || 'Not specified'}`}</p>
              <button onClick={() => startChat(user._id)}>Start Chat</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchList;
