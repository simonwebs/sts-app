// Client: ProfilePage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { UserProfiles } from '../../api/collections/UserProfiles';
import { Meteor } from 'meteor/meteor';
import UserDetails from './UserDetails';
import ChatComponent from '../components/chat/ChatComponent'; // Assuming ChatComponent is in the same directory
import { FaComments } from 'react-icons/fa'; // Importing chat icon from react-icons

import ProfileHeader from './ProfileHeader'; // Assume this is a presentational component for the profile header

const ProfilePage = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]); // You would retrieve these from your database or state management
  const [conversationId, setConversationId] = useState(null); // This should be set based on the current conversation

  const { userId } = useParams(); // Ensure this matches the dynamic segment in your <Route path="/profile/:userId" ... />

  const [userProfileData, setUserProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleOpenChat = () => {
    // You would have logic here to retrieve the conversationId and messages
    const retrievedConversationId = 'some-conversation-id'; // Replace with actual ID retrieval logic
    const retrievedMessages = []; // Replace with actual messages retrieval logic
    
    setConversationId(retrievedConversationId);
    setMessages(retrievedMessages);
    setShowChat(true);
  };
  
  useTracker(() => {
    const subscription = Meteor.subscribe('userDetails', userId);
    if (subscription.ready()) {
      const user = Meteor.users.findOne({ _id: userId });
      const userProfile = UserProfiles.findOne({ userId: userId });

      setUserProfileData({ user, userProfile });
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userProfileData) {
    return <div>User profile not found.</div>;
  }

  return (
    <>
    <div className='min-h-screen'>
      <ProfileHeader user={userProfileData.user} />
      <div className='flex justify-center items-center'>
        <button
          className="chat-icon-button"
          onClick={handleOpenChat}
          aria-label="Open chat"
        >
          <FaComments size={24} />
        </button>

        {/* Chat Component - conditional rendering based on showChat state */}
        {showChat && (
          <ChatComponent
            messages={messages}
            conversationId={conversationId} />
        )}
      </div>
    <UserDetails userId={userId} />
    </div>
    </>
  );
};

export default ProfilePage;
