import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import Swal from 'sweetalert2';
import { BuildingOffice2Icon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { FaWhatsapp, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

    useEffect(() => {
    AOS.init({ duration: 2000 }); // initialize AOS
  }, []);

  const isEmailValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailValid(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid email address',
      });
      return;
    }

    try {
      await Meteor.call('contacts.insert', { name, email, subject, description });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Your description was sent successfully!',
      });
      // Reset form fields after successful submission
      setName('');
      setEmail('');
      setSubject('');
      setDescription('');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error, check your information and resend',
      });
    }
  };
  return (
      <div className="min-h-screen container py-32 px-12 bg-gray-50 dark:bg-gray-700/100 mx-auto p-4" data-aos="fade-up">
      <h1 className="text-2xl font-semibold text-center mb-6 dark:text-gray-200">Get in Touch</h1> {/* Component Title */}
      <div className="flex flex-wrap -mx-3">
        <div className="w-full lg:w-1/2 px-3 mb-6 lg:mb-0">
          <div className="p-4 border-r border-gray-300">
            <div className="mb-4">
              <BuildingOffice2Icon className="h-6 w-6 text-primary  dark:text-cyan-500 inline-block mr-2" />
              <p className="inline-block dark:text-gray-300">That Connect</p>
            </div>
            <div className="mb-4">
              <EnvelopeIcon className="h-6 w-6 text-primary dark:text-cyan-500 inline-block mr-2" />
              <a href="mailto:admin@thatconnect.com" className="inline-block dark:text-gray-300">admin@thatconnect.com</a>
            </div>
            <div className="flex justify-start space-x-7">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="text-primary dark:text-cyan-500 hover:text-blue-500" size="24" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn className="text-primary dark:text-cyan-500 hover:text-blue-700" size="24" />
              </a>
              <a href="https://wa.me" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="text-primary dark:text-cyan-500 hover:text-green-500" size="24" />
              </a>
            </div>
          </div>
        </div>
       <div className="w-full lg:w-1/2 px-3">
          {/* Contact Form with Tailwind CSS for professional look */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Reduced width of inputs on large screens */}
            <input
              className="w-full lg:w-3/4 px-4 py-2 text-gray-900 dark:text-gray-200 dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm border rounded-md"
              type="text"
              name="name"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Your Name" // Accessibility: Aria-label for screen readers
            />
            <input
              className="w-full lg:w-3/4 px-4 py-2 text-gray-900 dark:text-gray-200 dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm border rounded-md"
              type="email"
              name="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Your Email"
            />
            <input
             className="w-full lg:w-3/4 px-4 py-2 text-gray-900 dark:text-gray-200 dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm border rounded-md"
              type="text"
              name="subject"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              aria-label="Subject"
            />
            <textarea
             className="w-full lg:w-3/4 px-4 py-2 text-gray-900 dark:text-gray-200 dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm border rounded-md"
              name="description"
              placeholder="Your Message"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-label="Your Message"
            />
            <button
              className="w-full lg:w-3/4 bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;