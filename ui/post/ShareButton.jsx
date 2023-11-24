import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { FaShare } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ShareButton = ({ postId }) => {
  const [shareCount, setShareCount] = useState(0);
  const postUrl = `https://www.cedarcbs.com/post/${postId}`;

  useEffect(() => {
    if (postId) {
      Meteor.call('posts.getShareCount', postId, (error, result) => {
        if (error) {
          console.error('Error getting share count:', error);
        } else {
          setShareCount(result || 0);
        }
      });
    }
  }, [postId]);
  

  const handleShareClick = () => {
    // Increment share count optimistically
    setShareCount(prevCount => prevCount + 1);
  
    Meteor.call('posts.incrementShareCount', postId, (error) => {
      if (error) {
        console.error('Error incrementing share count:', error);
        setShareCount(prevCount => prevCount - 1); // Revert if there's an error
      }
    });
  
    // Updated confirmation dialog for sharing with single link
    Swal.fire({
      title: 'Share this post',
      text: 'Choose a platform to share on:',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Share on Facebook',
      denyButtonText: 'Share on WhatsApp',
    }).then((result) => {
      const shareMessage = `testing ap\nView post: ${postUrl}`;
      if (result.isConfirmed) {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank');
      } else if (result.isDenied) {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
      }
    });
  };
  
  return (
    <button onClick={handleShareClick} className="share-button">
      <FaShare />
      <span>{shareCount} Shares</span>
    </button>
  );
};

export default ShareButton;
