// Client: ProfilePage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { UserProfiles } from '../../api/collections/UserProfiles';
import { Meteor } from 'meteor/meteor';
import UserDetails from './UserDetails';
//import ChatComponent from '../components/chat/ChatComponent';
import ProfileHeader from './ProfileHeader';

const ProfilePage = () => {
  const [showChat, setShowChat] = useState(false);
  // const [messages, setMessages] = useState([]);
  // const [conversationId, setConversationId] = useState(null);
  
  const { userId } = useParams();
  const [userProfileData, setUserProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
          
        </div> 
        <UserDetails userId={userId} />
      </div>
    </>
  );
};

export default ProfilePage;
