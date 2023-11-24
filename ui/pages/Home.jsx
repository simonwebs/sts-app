import React, { lazy, Suspense, memo } from 'react';
import Connections from './Connections';
import Features from './Features';
const Hero = lazy(() => import('./Hero'));
const Card = lazy(() => import('./album/Card'));
const Testimonial = lazy(() => import('./Testimonial'));
const Explore = lazy(() => import('../components/userProfile/Explore'))

const Home = () => {
  return (
    <main role="main" aria-label="Main Content" className="main-content dark:bg-gray-700/100 flex flex-col items-center"> 
      <Suspense fallback={<div>Loading...</div>}>
        <section className="" aria-label="Hero Section">
          <Hero />
        </section>
        <section className="mt-10 mb-8" aria-label="Hero Section">
          <Connections />
        </section>
        <section className="mt-10 mb-8" aria-label="Hero Section">
          <Features />
        </section>
        <section className="mt-7 mb-4" aria-label="Hero Section">
          <Testimonial />
        </section>
      </Suspense>
    </main>
  );
};

export default memo(Home);