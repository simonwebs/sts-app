import React, { memo, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';


const people = [
  {
    id: 1,
    name: 'Whitney Francis',
    role: 'Teacher',
    imageUrl: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
    twitterUrl: '#',
    linkedinUrl: '#',
  },
  {
    id: 2,
    name: 'Whitney Francis',
    role: 'Teacher',
    imageUrl: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
    twitterUrl: '#',
    linkedinUrl: '#',
  },
  {
    id: 3,
    name: 'Whitney Francis',
    role: 'Teacher',
    imageUrl: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
    twitterUrl: '#',
    linkedinUrl: '#',
  },
  // More people...
];

const TeamMember = memo(({ person, isMiddle }) => (
  <li data-aos="fade-left">
    <figure className="hover-trigger">
      <img
        className={`mx-auto h-56 w-56 rounded-full transition-all ease-in-out duration-300 hover:translate-y-[-4px] hover:rounded-sm dark:text-white ${isMiddle ? 'h-64 w-64 rounded-md hover:h-72 hover:w-72 hover:shadow-md' : ''}`}
        src={person.imageUrl}
        alt={`${person.name} profile`}
        loading="lazy"
      />
      <figcaption>
        <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900 dark:text-white">{person.name}</h3>
        <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">{person.role}</p>
      </figcaption>
    </figure>
    <ul role="list" className="mt-6 flex justify-center gap-x-6">
      {/* Social Media Links */}
    </ul>
  </li>
));

const Team = () => { 
  useEffect(() => {
    AOS.init({
      duration: 1000, // You can also add more settings
    });
  }, []);
  return (  
  <section className="bg-white mt-10 dark:bg-gray-700/100" data-aos="fade-up">
    <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
      <header className="mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">Meet our team</h2>
        <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">Our passionate team is here to guide you on your spiritual journey, offering personalized support and resources whenever you need.</p>
      </header>
      <ul role="list" className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {people.map((person, index) => (
          <TeamMember person={person} key={person.id} isMiddle={index === 1} />
        ))}
      </ul>
    </div>
  </section>
);
        }
export default Team;
