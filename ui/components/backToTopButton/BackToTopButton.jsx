import React, { useEffect, useState } from 'react';
import { Arrow } from './Arrow';

export const BackToTopButton = () => {
  const [backToTopButton, setBackToTopButton] = useState(false);
  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        setBackToTopButton(true);
      } else {
        setBackToTopButton(false);
      }
    });
  }, []);
  const scrollY = () => {
    window.scrollTo({
      top: 20,
      behavior: 'smooth',
    });
  };
  return (
    <>
     { backToTopButton && (
        <button onClick={scrollY}
          className="fixed z-50 bottom-10 w-7 h-7 right-8 bg-white rounded-full shadow-lg flex justify-center items-center text-4xl hover:drop-shadow-3xl hover:animate-bounce duration-300 ring-1 ring-cyan-500 dark:ring-cyan-500 hover:ring-primary dark:hover:ring-pink-500 text-white focus:ring-offset-2"><span className='text-lg font-serif text-primary font-bold'><Arrow /></span></button>
     )}
    </>
  );
};
