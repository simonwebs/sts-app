import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { UserProfiles } from '../../../api/collections/UserProfiles';

const UserMatches = () => {
  const { currentUserProfile, potentialMatches, isLoading } = useTracker(() => {
    const noDataAvailable = { currentUserProfile: null, potentialMatches: [] };
    const currentUserHandler = Meteor.subscribe('currentUserMatches');
    const potentialMatchesHandler = Meteor.subscribe('potentialMatches'); // You need to create this publication
    if (!currentUserHandler.ready() || !potentialMatchesHandler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }
    const currentUserProfile = UserProfiles.findOne({ userId: Meteor.userId() });
    const potentialMatches = UserProfiles.find({ userId: { $ne: Meteor.userId() } }).fetch();
    return { currentUserProfile, potentialMatches, isLoading: false };
  }, []);

  const calculateMatchPercentage = (currentUserProfile, otherUserProfile) => {
    let score = 0;
    const criteria = {
      gender: 1,
      bodyHeight: 1,
      bodyType: 1,
      age: 1,
      location: 1,
      interests: 1,
      educationLevel: 1,
      lifestyleChoices: 1
    };
    const totalCriteria = Object.keys(criteria).length;
  
    // Check gender preference
    if (currentUserProfile.lookingForGender.includes(otherUserProfile.biologicalGender)) {
      score += criteria.gender;
    }
  
    // Check body height preference
    if (currentUserProfile.lookingForBodyHeight.includes(otherUserProfile.bodyHeight)) {
      score += criteria.bodyHeight;
    }
  
    // Check body type preference
    if (currentUserProfile.lookingForBodyType.includes(otherUserProfile.bodyType)) {
      score += criteria.bodyType;
    }
  
    // Check age preference
    const otherUserAge = new Date().getFullYear() - new Date(otherUserProfile.birthDate).getFullYear();
    if (otherUserAge >= currentUserProfile.agePreferenceMin && otherUserAge <= currentUserProfile.agePreferenceMax) {
      score += criteria.age;
    }
  
    // Check location preference
    if (currentUserProfile.country === otherUserProfile.country && currentUserProfile.city === otherUserProfile.city) {
      score += criteria.location;
    }
  
    // Check shared interests
    if (currentUserProfile.interests.some(interest => otherUserProfile.interests.includes(interest))) {
      score += criteria.interests;
    }
  
    // Check education level preference
    if (currentUserProfile.educationLevel === otherUserProfile.educationLevel) {
      score += criteria.educationLevel;
    }
  
    // Check lifestyle choices preference
    if (currentUserProfile.lifestyleChoices.some(choice => otherUserProfile.lifestyleChoices.includes(choice))) {
      score += criteria.lifestyleChoices;
    }
  
    // Add more criteria checks as needed
  
    // Return a normalized score as a percentage
    return (score / totalCriteria) * 100;
  };
  
  const getProfilePhotoUrl = (user) => {
    const defaultPhotoUrl = '/path/to/default/image.jpg'; // Replace with the path to your default image
    return user.profilePhotos && user.profilePhotos.length > 0
      ? user.profilePhotos[0].photoUrl // Assuming the first photo is the profile photo
      : defaultPhotoUrl;
  };

  if (isLoading) {
    return <div>Loading matches...</div>;
  }

  return (
    <div className="matches-container">
      {potentialMatches.map(otherUser => {
        const matchPercentage = calculateMatchPercentage(currentUserProfile, otherUser);
        const profilePhotoUrl = getProfilePhotoUrl(otherUser);
        return (
          <div key={otherUser._id} className="match-card">
            <img src={profilePhotoUrl} alt={`${otherUser.firstName}'s profile`} className="match-photo" />
            <div className="match-details">
              <p>{otherUser.firstName} {otherUser.lastName}</p>
              <p>Match: {matchPercentage.toFixed(2)}%</p>
              {/* Render more details about the other user */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserMatches;
