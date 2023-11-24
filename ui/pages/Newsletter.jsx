import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';

const Newsletter = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
    }),
    onSubmit: (values, { resetForm }) => {
      const email = values.email;

      if (email) {
        Meteor.call('newsletter.insert', email, (error) => {
          if (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.reason,
            });
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'You have subscribed to our newsletter.',
            });
            resetForm();
          }
        });
      }
    },
  });

  return (
    <section className="bg-gray-100 dark:bg-gray-700 sm:py-12 lg:py-12 shadow-sm dark:shadow-gray-600 rounded" aria-labelledby="newsletter-heading">
      <h2 id="newsletter-heading" className="sr-only">Newsletter Signup</h2>
      <div className="grid grid-cols-1 gap-10 px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <header className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:col-span-7">
          <h3 className="text-gray-400">Craving the Latest Updates in Education?</h3>
          <p className="text-gray-500">Sign up for our newsletter.</p>
        </header>
     <form onSubmit={formik.handleSubmit} className="w-full max-w-md lg:col-span-5 lg:pt-2">
        <div className="flex gap-x-4">
          <label htmlFor="email" className="sr-only">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            placeholder="Enter your email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`min-w-0 flex-auto rounded-md border-0 px-3.5 py-2 text-gray-900 dark:text-gray-200 dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''
              }`}
          />
          <button
            type="submit"
            className="flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Subscribe
          </button>
        </div>
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
        ) : null}
          <p className="mt-4 text-sm leading-6 dark:text-gray-400">
            We care about your data. Read our{' '}
            <Link to={'/privacy'} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
              privacy policy
            </Link> 
          </p>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
