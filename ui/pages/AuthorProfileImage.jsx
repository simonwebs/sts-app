import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthorProfileImage = ({ cloudName = 'techpulse', authorImage }) => {
  const [errorLoading, setErrorLoading] = useState(false);

  let profileImageUrl;
  if (authorImage && authorImage.startsWith('http')) {
    profileImageUrl = authorImage;
  } else {
    profileImageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_auto,c_scale,q_auto,f_auto,dpr_auto/${authorImage}`;
  }

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  let imageSize = width < 640 ? '24px' : '60px';
  // Reduce imageSize by 20%
  imageSize = `calc(${imageSize} * 0.8)`;
  const borderRadius = '50%';

  const handleError = () => {
    setErrorLoading(true);
  };

  if (errorLoading) {
    profileImageUrl = 'https://res.cloudinary.com/seyimsmultimedia/image/upload/t_Grayscale/v1699499831/seychelles-multimedia_y1zqrt.png'; // Replace with your fallback image path
  }

  return (
    <img
      src={profileImageUrl}
      alt="Author Profile"
      className="author-profile-image-hover" // Add this class
      style={{
        width: imageSize,
        height: imageSize,
        borderRadius,
        objectFit: 'cover', /* This ensures the image retains its aspect ratio */
      }}
      onError={handleError}
    />
  );
};

AuthorProfileImage.propTypes = {
  cloudName: PropTypes.string,
  authorImage: PropTypes.string.isRequired,
};

export default AuthorProfileImage;
