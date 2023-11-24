import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { StarIcon } from '@heroicons/react/20/solid';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation


const videoSources = [
  'https://www.shutterstock.com/shutterstock/videos/1086824975/preview/stock-footage-couple-gently-kissing-close-up.webm',
  'https://www.shutterstock.com/shutterstock/videos/1086824996/preview/stock-footage-boy-whispering-in-girl-s-ear.webm',
  'https://www.shutterstock.com/shutterstock/videos/1108452581/preview/stock-footage-young-man-touching-female-hair-while-standing-outdoors-during-the-date-romantic-date-on-the-roof.webm',
];

// Update the card information for different membership tiers
const cards = [
  {
    name: 'Silver Membership',
    description: 'Access basic features and weekly updates. Ideal for beginners.',
    icon: StarIcon,
    iconClassName: 'text-silver', // Add custom color class in your CSS
  },
  {
    name: 'Gold Membership',
    description: 'Unlock premium features with daily updates. Perfect for enthusiasts.',
    icon: StarIcon,
    iconClassName: 'text-gold', // Add custom color class in your CSS
  },
  {
    name: 'Platinum Membership',
    description: 'Experience all features with priority support. Best for experts.',
    icon: StarIcon,
    iconClassName: 'text-platinum', // Add custom color class in your CSS
  },
];


const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const [activeDescription, setActiveDescription] = useState(0);

  const descriptions = [
    "The only dating place to help you meet your loved one.",
    "Connect with singles in your area now."
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveDescription((prevActiveDescription) => (prevActiveDescription + 1) % descriptions.length);
    }, 3000); // Change the description every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let intervalId;

    if (isSmallScreen) {
      intervalId = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % (cards.length + 1)); // Include +1 for the title and description card
      }, 3000);
    } else {
      setActiveIndex(cards.length); // Set to the title and description index on larger screens
    }

    return () => clearInterval(intervalId);
  }, [isSmallScreen]);

  return(  
    <section className="relative bg-gray-900 overflow-hidden">
      <Carousel
        showArrows={false}
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        infiniteLoop
        autoPlay
        interval={5000}
        transitionTime={1000}
        stopOnHover
        swipeable
        emulateTouch
        useKeyboardArrows
        dynamicHeight={false}
        className="carousel-video"
      >
        {videoSources.map((src, index) => (
    <div key={index} className="carousel-video-item" style={{ height: '48vh' }}>
      <video
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata" // or "none"
        poster="/path-to-poster-image.jpg" // placeholder image path
      >
        <source src={src} type="video/webm" />
        <source src="/path-to-fallback-video.mp4" type="video/mp4" /> {/* Fallback for browsers that don't support webm */}
        Your browser does not support the video tag.
      </video>
    </div>
  ))}
      </Carousel>
  
      {/* Title and Description Content */}
      <div className="absolute top-1/4 left-0 right-0 text-center text-white px-4 z-20">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold">
          That Connect
        </h1>
        <div className="relative mt-8 mb-20"> {/* Adjust top margin of the text */}
          {descriptions.map((description, index) => (
            <p key={index} className={`absolute w-full text-base sm:text-lg lg:text-xl xl:text-2xl transition-opacity duration-1000 ${activeDescription === index ? 'opacity-100' : 'opacity-0'}`}>
              {description}
            </p>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 w-full mt-4 px-4 py-6 space-y-4 md:space-y-0 md:flex md:flex-wrap md:justify-center md:gap-4 z-20" style={{ marginTop: '10vh' }}>
        {cards.map((card, index) => (
          <div key={card.name} className={`p-6 ring-1 ring-inset ring-white/10 shadow-lg transition-opacity duration-1000 ${isSmallScreen ? (index === activeIndex ? 'block' : 'hidden') : 'md:block md:w-1/4 md:max-w-xs'}`}>
            <card.icon className={`h-6 w-6 ${card.iconClassName} mb-2`} aria-hidden="true" />
            <Link to="/price-page" className="hover:underline"> {/* This will make only the text clickable */}
              <h3 className="text-white font-semibold">{card.name}</h3>
              <p className="text-gray-400">{card.description}</p>
            </Link>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-30"></div> {/* Overlay */}
    </section>
  );
};

export default React.memo(Hero);