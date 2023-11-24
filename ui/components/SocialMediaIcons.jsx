import React, { memo } from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const SocialMediaIcons = memo(() => {
  return (
    // Use Tailwind CSS classes for styling
    <div className="flex items-center justify-center space-x-4">
      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-gray-500 transition-colors duration-300">
        <FaFacebook size={24} />
      </a>
      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-gray-500 transition-colors duration-300">
        <FaInstagram size={24} />
      </a>
      <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-gray-500 transition-colors duration-300">
        <FaTwitter size={24} />
      </a>
      <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-400 hover:text-gray-500 transition-colors duration-300">
        <FaYoutube size={24} />
      </a>
    </div>
  );
});

export default SocialMediaIcons;
