import { Meteor } from 'meteor/meteor';
import React, { lazy, memo } from 'react';
import { NewsletterCollection } from '../../../../api/collections/NewsletterCollection'; // Update the import
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import Swal from 'sweetalert2'; // Import SweetAlert2

const Loading = lazy(() => import('../../../components/spinner/Loading'));

const NewsletterItem = memo(({ newsletter }) => (
    <div className="mt-8 m-7 flex p-1 flex-col bg-primary rounded-lg shadow-lg dark:bg-primary ">
      <div className="-my-2 -mx-4 overflow-hidden">
        <div className="p-5 inline-block min-w-full py-2 align-middle">
          <div className="overflow-hidden shadow ring-2-rounded-lg md:rounded-lg">
            <div className="min-w-full divide-y divide-gray-300">
              <dl className="mt-1 flex-grow flex flex-col justify-between"></dl>
              <div className="mt-5 ml-4 flex items-center justify-between">
                <div>
                  <a
                    href="#"
                    onClick={(event) =>
                      removeNewsletter(event, newsletter._id)
                    }
                    className="text-red-600 hover:text-red-900"
                  >
                    <span className="bg-sky-50 text-md font-bold shadow-lg shadow-cyan-500/50 relative inline-flex items-center px-3 py-0 border border-transparent dark:text-red-500/80 hover:bg-slate-500/70 dark:hover:text-red-500 rounded-r-full">
                      Delete
                    </span>
                  </a>
                </div>
                <div>
                  <a
                    href="#"
                    onClick={(event) =>
                      updateNewsletter(event, newsletter._id)
                    }
                    className="inline-flex items-right text-green-600 hover:text-red-900"
                  >
                    <span className="bg-sky-50 text-md font-bold shadow-lg shadow-cyan-900/50 relative inline-flex items-center px-3 py-0 border border-transparent dark:text-sky-500/80 hover:bg-sky-500/70 dark:hover:text-white rounded-l-full">
                      Update
                    </span>
                  </a>
                </div>
              </div>

              <div className="ml-4 grid grid-cols-1 divide-y">
                <div className="text-left text-slate-100 dark:text-slate-50 text-sm">
                  <span className="text-sky-400">Emil : </span>&
                  {newsletter.email}
                </div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="w-0 flex-1 flex">
                    <a
                      href={'mainotifyemail.email}'}
                      className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-100 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                    >
                      <img
                        src="./log/Mail.svg"
                        className="w-5 h-5 bg-primary text-white"
                        aria-hidden="true"
                      />
                      <span className="ml-3 text-sky-500">Email</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1"></div>
        </div>
      </div>
    </div>
));
const removeNewsletter = (_id) => {
  Meteor.call('newsletter.remove', { newsletterId: _id }, (error) => {
    if (error) {
      console.error(error);
    } else {
      Swal.fire('Success', 'Newsletter removed successfully', 'success');
    }
  });
};

const updateNewsletter = (_id) => {
  Meteor.call('newsletter.update', { newsletterId: _id }, (error) => {
    if (error) {
      console.error(error);
    } else {
      Swal.fire('Success', 'Newsletter updated successfully', 'success');
    }
  });
};
const Newsletter = () => {
  const isLoading = useSubscribe('allNewsletter');
  const newsletters = useFind(() =>
    NewsletterCollection.find(
      { archived: { $ne: true } },
      { sort: { createdAt: -1 } },
    ),
  );

  if (isLoading()) {
    return <Loading />;
  }

  return (
    <div className="bg-white dark:bg-slate-200 w-full divide-y divide-gray-300">
      <div className="bg-white dark:bg-slate-100">
        <div className="text-center">
          <h2 className="px-3 py-6 text-3xl font-serif font-medium text-center dark:text-primary">
            NewsLetter
          </h2>
        </div>
        <ul
          role="list"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
        >
          {newsletters.map((newsletter) => (
            <NewsletterItem key={newsletter._id} newsletter={newsletter} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Newsletter;
