// Home.jsx
import React, { lazy, Suspense, memo } from 'react';
import Features from './Features';
import Loading from '../components/spinner/Loading';
import MapComponent from './map/MapComponent';
import Testimonial from './Testimonial';
const Hero = lazy(() => import('./Hero'));

const Home = () => {
  const latitude = 6.3702928;
  const longitude = 2.3912362;
  const testimonialsData = [
    {
      profileImage: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
      name: 'John Doe',
      testimony: "I never thought I'd find my life partner online, but thanks to this amazing platform, I met the love of my life.",
    },
    {
      profileImage: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
      name: 'Jane Doe',
      testimony: 'Finding a life partner can be a daunting task, but this platform made it all so easy. I connected with someone who shares my values and dreams. Our journey together has been nothing short of magical.',
    },
     {
      profileImage: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
      name: 'Jane Doe',
      testimony: 'Finding a life partner can be a daunting task, but this platform made it all so easy. I connected with someone who shares my values and dreams. Our journey together has been nothing short of magical.',
    },
  // Add more testimonies as needed
  ];

  return (
    <main role="main" aria-label="Main Content" className="main-content bg-white dark:bg-gray-700 flex flex-col items-center">
      <Suspense fallback={<div><Loading /></div>}>
        <section className="" aria-label="Hero Section">
          <Hero />
        </section>
        <section className="mt-10 mb-8" aria-label="Features Section">
         <Features currentIndex={0} />
        </section>
        <section className="mt-10 mb-8" aria-label="Features Section">
           <Testimonial testimonials={testimonialsData} darkMode={true} />
        </section>
         <section className="mt-10 mb-8" aria-label="Features Section">
          <MapComponent lat={latitude} lng={longitude} />
        </section>
      </Suspense>
    </main>
  );
};

export default memo(Home);
