import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { UserProfiles } from '../../../api/collections/UserProfiles';
import ProfileCard from './ProfileCard';
import { useNavigate } from 'react-router-dom'; 

const Explore = ({ user, className }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate(); 
  const [swipeDirection, setSwipeDirection] = useState('');

  // Fetch profiles
  useTracker(() => {
    const handler = Meteor.subscribe('userProfiles.all');
    if (!handler.ready()) {
      setProfiles([]);
    } else {
      const fetchedProfiles = UserProfiles.find({}).fetch();
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

  // Effects and loading handling omitted for brevity
  if (!profiles.length) {
    return <div className="explore-no-more">No more profiles to show.</div>;
  }

  const handleViewDetails = (authorId) => {
    console.log('Navigating to author profile with ID:', authorId);
    navigate(`/profile/${authorId}`);
  };

  // Get the active profile
  const activeProfile = profiles[activeIndex];

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
          likedByUsers={user?.likedByUsers} 
        />
        </div>
      ))}
    </div>
  );
};

export default Explore;