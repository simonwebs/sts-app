import React from 'react';

const featuredTestimonial = {
  body: "Since joining this dating service, I've had some of the most memorable conversations and dates. The platform's features make it easy to find people who really match what I'm looking for in a partner.",
  author: {
    name: 'Alex Johnson',
    handle: 'life_explorer',
    imageUrl: 'https://img.freepik.com/free-photo/integrate-scene-mobile-screen-frame_23-2150678768.jpg?size=626&ext=jpg&ga=GA1.1.729466320.1700403522&semt=ais', // Placeholder image URL
  },
};

const testimonials = [
  {
    body: 'Since joining the program, I have seen a significant improvement in my social skills and comfort in social settings. The community here is fantastic!',
    author: {
      name: 'Samuel Thompson',
      handle: 'Outdoor Enthusiast',
      imageUrl: 'https://img.freepik.com/free-photo/integrate-scene-mobile-screen-frame_23-2150678768.jpg?size=626&ext=jpg&ga=GA1.1.729466320.1700403522&semt=ais', // Placeholder image URL
    },
  },
  {
    body: 'The events and workshops have been a game-changer for my personal development. I’ve met some incredible people along the way!',
    author: {
      name: 'Jessica Pearson',
      handle: 'Networker',
      imageUrl: 'https://img.freepik.com/free-photo/integrate-scene-mobile-screen-frame_23-2150678768.jpg?size=626&ext=jpg&ga=GA1.1.729466320.1700403522&semt=ais', // Placeholder image URL
    },
  }
];

const TestimonialCard = ({ testimonial }) => {
  return (
    <figure className="flex flex-col items-center p-6 space-y-6 rounded-xl bg-white dark:bg-gray-700 shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
      <img
        className="w-20 h-20 rounded-full"
        src={testimonial.author.imageUrl}
        alt={testimonial.author.name}
        loading="lazy"
      />
      <blockquote className="text-center text-gray-800 dark:text-gray-300">
        <p className="text-lg font-medium">“{testimonial.body}”</p>
      </blockquote>
      <figcaption className="text-center">
        <p className="text-md font-semibold">{testimonial.author.name}</p>
        <p className="text-sm text-gray-500">{`@${testimonial.author.handle}`}</p>
      </figcaption>
    </figure>
  );
};

const Testimonial = () => {
  return (
    <div className="bg-white dark:bg-gray-700 py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-semibold leading-8 text-indigo-600 dark:text-indigo-300">Hear From Our Members</h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Real stories from real people who found love and companionship through our platform.
          </p>
        </div>

        <section className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <TestimonialCard testimonial={featuredTestimonial} />
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </section>
      </div>
    </div>
  );
};

export default Testimonial;
