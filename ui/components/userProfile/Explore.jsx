import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import ProfileCard from './ProfileCard';
import { useNavigate } from 'react-router-dom';

const Explore = ({ className }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();
  const [swipeDirection, setSwipeDirection] = useState('');

  // Fetch profiles
  useTracker(() => {
    const handler = Meteor.subscribe('allUsersDetails');
    if (!handler.ready()) {
      setProfiles([]);
    } else {
      const fetchedProfiles = Meteor.users.find().fetch();
      setProfiles(fetchedProfiles);
    }
  }, []);

  const handleSwipe = (direction) => {
    // Set the swipe direction to trigger the animation
    setSwipeDirection(direction);

    // Use a timeout to allow for a smooth transition before removing the card
    setTimeout(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = direction === 'left' ? prevIndex + 1 : prevIndex - 1;
        return (nextIndex + profiles.length) % profiles.length;
      });
      setSwipeDirection(''); // Reset swipe direction
    }, 500); // Match this timeout with your CSS animation duration
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft') {
        handleSwipe('left');
      } else if (event.key === 'ArrowRight') {
        handleSwipe('right');
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleSwipe]);

  const handleViewDetails = (userId) => {
    console.log('Navigating to user profile with ID:', userId);
    navigate(`/profile/${userId}`);
  };

  return (
    <div className={`${className}`}>
      {profiles.map((profile, index) => (
        <div
          key={profile._id}
          className={`profile-card-container ${index === activeIndex ? 'active' : 'hidden'} ${swipeDirection === 'left' ? 'swipe-left' : swipeDirection === 'right' ? 'swipe-right' : ''}`}
        >
          <ProfileCard
            key={profile._id}
            user={profile}
            onSwipeLeft={() => handleSwipe('left')}
            onSwipeRight={() => handleSwipe('right')}
            onViewDetails={handleViewDetails}
          />
        </div>
      ))}
    </div>
  );
};

export default Explore;
