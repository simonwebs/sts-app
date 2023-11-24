import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { CommonRoutes } from '../../common/general/CommonRoutes';
import { useNavigate } from 'react-router-dom';
import { ErrorAlert } from '../../components/alerts/ErrorAlert';
import Swal from 'sweetalert2';

const AdminRemovePost = () => {
  const navigate = useNavigate();
  const [postId, setPostId] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [error, setError] = useState();

  const removePost = (e) => {
    e.preventDefault();
    Meteor.call('posts.remove', postId, targetUserId, (error) => {
      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error trying to remove a post',
        });
        setError(error);
        return;
      }
      setPostId('');
      setTargetUserId('');
      setError(null);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'The post was removed!',
      });
    });
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <h3 className="rounded-full px-3 py-2 text-lg font-medium">
          Remove Post (Admin)
        </h3>
        {error && <ErrorAlert message={error.reason || 'Unknown error'} />}
        <form action="" className="mt-5 flex flex-col">
          <div>
            <label htmlFor="targetUserId" className="block text-sm font-medium text-gray-700">
              Target User ID
            </label>
            <div className="mt-1 border-b border-gray-300 focus-within:border-primary/60">
              <input
                id="targetUserId"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="block w-full border-0 border-b border-transparent bg-gray-500 focus:border-primary/60 focus:ring-0 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="postId" className="block text-sm font-medium text-gray-700">
              Post ID
            </label>
            <div className="mt-1 border-b border-gray-300 focus-within:border-primary/60">
              <input
                id="postId"
                value={postId}
                onChange={(e) => setPostId(e.target.value)}
                className="block w-full border-0 border-b border-transparent bg-gray-500 focus:border-primary/60 focus:ring-0 sm:text-sm"
              />
            </div>
          </div>
          <button
            onClick={() => navigate(CommonRoutes.HOME)}
            className=" py-2 px-3 font-serif font-medium text-[18px] text-slate-900 bg-primary rounded-[10px] outline-none hover:text-white hover:bg-opacity-40 transition ease-in-out duration-150"
          >
            Back to Home
          </button>
          <button
            onClick={removePost}
            type="submit"
            className=" py-2 px-3 font-serif font-medium text-[18px] text-white bg-primary/60 rounded-[10px] outline-none hover:text-white hover:bg-opacity-40 transition ease-in-out duration-150"
          >
            Remove
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminRemovePost;
