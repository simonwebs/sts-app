/* eslint-disable quotes */
import React from 'react';
import { Link } from 'react-router-dom';

const Testimonial = ({ testimonials, darkMode }) => {
  const cardClass = `bg-${darkMode ? 'gray-700' : 'white'} shadow-lg rounded-lg overflow-hidden mb-4 mx-auto max-w-sm group transition-transform transform scale-100 hover:scale-105 focus:scale-105 focus:outline-none focus:ring focus:ring-cyan-500`;
  const imageContainerClass = 'mx-auto h-20 w-20 flex-shrink-0 rounded-full overflow-hidden overflow-visible';

  const imageClass = 'h-full w-full object-cover object-center rounded-full cursor-pointer absolute transition-all duration-300 ease-in-out transform hover:rounded-lg transition focus:outline-none border-2 border-cyan-700 shadow-lg m-0';

  const textClass = `p-4 text-xs ${darkMode ? 'text-white' : 'text-gray-700'}`;

  const buttonClass = `inline-flex items-center gap-x-2 rounded-md px-3.5 py-2.5
  text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2
  focus-visible:outline-offset-2 transition duration-300 ease-in-out 
  border border-white bg-gradient-to-r from-teal-500
  via-emerald-500 to-lime-600 hover:shadow-lg hover:opacity-75 hover:scale-105 hover:bg-gradient-to-r hover:from-teal-400 hover:via-emerald-400 hover:to-lime-500`;

  return (
    <div className='w-full bg-white dark:bg-gray-700 shadow-lg'>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-white dark:bg-gray-700">
        {testimonials.map((testimonial, index) => (
          <div key={index} className={cardClass}>
            <div className={imageContainerClass}>
              <img
                            className={imageClass }
                            style={{
                              zIndex: 1,
                              transform: 'scale(1)',
                            }}
                            loading="lazy"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(2)';
                              e.currentTarget.style.zIndex = '1000';
                              e.currentTarget.style.position = 'fixed';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.zIndex = '1';
                              e.currentTarget.style.position = 'static';
                            }}
                            src={testimonial.profileImage}
                alt={`${testimonial.name}'s Profile`}
                          />
            </div>
            <div className={textClass}>
              <h3 className="text-lg font-semibold">{testimonial.name}</h3>
              <p className="text-sm">{testimonial.testimony}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link to="/profile-form" className={buttonClass}>
          Find Your Match
        </Link>
      </div>
    </div>
  );
};

export default Testimonial;
