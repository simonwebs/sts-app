import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { UserProfiles } from '../../api/collections/UserProfiles';
import { Meteor } from 'meteor/meteor';
import ChatWindow from '../components/chat/ChatWindow';

const LikesAndChats = () => {
  const currentUserId = Meteor.userId();
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Tracker for users who liked your profile
  const { likedUsers, isLoadingLikedUsers } = useTracker(() => {
    const handle = Meteor.subscribe('likedByUsers', currentUserId);
    console.log('Liked Users subscription ready:', handle.ready());
    
    return {
      likedUsers: handle.ready() ? UserProfiles.find({ likedBy: currentUserId }).fetch() : [],
      isLoadingLikedUsers: !handle.ready(),
    };
  }, [currentUserId]);

  // Tracker for all user contacts
  const { allUsers, isLoadingAllUsers } = useTracker(() => {
    const handle = Meteor.subscribe('userContacts');
    console.log('All Users subscription ready:', handle.ready());

    return {
      allUsers: handle.ready() ? Meteor.users.find({ _id: { $ne: currentUserId } }).fetch() : [],
      isLoadingAllUsers: !handle.ready(),
    };
  }, []);

  const handleUserSelect = (userId) => {
    // This check ensures that only valid user IDs are set
    if (typeof userId === 'string' && userId) {
      setSelectedUserId(userId);
    }
  };

  return (
    <div className="likes-and-chats">
      <div className="liked-users">
    
      </div>
    
      {selectedUserId && (
        <ChatWindow
          selectedUser={Meteor.users.findOne(selectedUserId)} // Get the selected user object
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
};

export default LikesAndChats;
