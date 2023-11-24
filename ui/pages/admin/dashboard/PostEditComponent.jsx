import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import ClipLoader from 'react-spinners/ClipLoader';
import { PostsCollection } from '../../../../api/collections/posts.collection';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import TimeSince from '../../../components/TimeSince';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import PostEditModal from './PostEditModal'; // Import your PostEditModal component

const PostEditComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost] = useState(null);
  const postsPerPage = 4;

  const { posts, users, isLoading, currentUser } = useTracker(() => {
    const handle = Meteor.subscribe('postsWithAuthors');
    const currentUser = Meteor.user();
    let posts;
    if (currentUser && currentUser.isAdmin) {
      posts = PostsCollection.find({}).fetch(); // Show all posts for admin
    } else {
      posts = PostsCollection.find({ authorId: Meteor.userId() }).fetch(); // Show only current user's posts
    }
    const users = Meteor.users.find({}).fetch(); // Fetch all users
    return {
      posts,
      users,
      currentUser,
      isLoading: !handle.ready(),
    };
  });
  
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const getUsernameById = (id) => {
    const user = users.find(user => user._id === id);
    return user ? user.username : 'Unknown';
  };
  const userPostCount = posts.filter(post => post.authorId === Meteor.userId()).length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={25} color={'#4C3BAB'} />
      </div>
    );
  }
  const handleDelete = (postId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Meteor.call('posts.remove', postId, (error) => {
          if (error) {
           // console.error(error);
            Swal.fire('Error!', 'There was a problem deleting the post.', 'error');
          } else {
           // console.log('Post deleted successfully');
            Swal.fire('Deleted!', 'The post has been deleted.', 'success');
            setRefresh(!refresh);
          }
        });
      }
    });
  };
  const handleEdit = (post) => {
    Swal.fire({
      title: '<strong>Edit Post</strong>',
      html: `
        <div style="text-align: left;">
          <label for="swal-input-caption" style="font-weight: bold;">Caption:</label>
          <input id="swal-input-caption" class="swal2-input" placeholder="Caption" value="${post.caption}">
          <label for="swal-input-description" style="font-weight: bold;">Description:</label>
          <textarea id="swal-input-description" class="swal2-textarea" placeholder="Description">${post.description}</textarea>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true, // Add a cancel button
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const caption = Swal.getPopup().querySelector('#swal-input-caption').value;
        const description = Swal.getPopup().querySelector('#swal-input-description').value;
        if (!caption || !description) {
          Swal.showValidationMessage(`Please enter both caption and description`);
        }
        return { caption, description };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const editedPost = {
          ...post,
          caption: result.value.caption,
          description: result.value.description
        };
        // Update the post here
        Meteor.call('posts.update', post._id, { caption: result.value.caption, description: result.value.description }, (err) => {
          if (err) {
            Swal.fire('Error', 'Failed to update post', 'error');
          } else {
            Swal.fire('Success', 'Post updated successfully', 'success');
          }
        });
      }
    });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800/100">
      {/* Your JSX code here */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div>
  <p className="text-md dark:text-gray-300">Total {userPostCount === 1 ? 'Post' : 'Posts'} by {getUsernameById(Meteor.userId())}: {userPostCount}</p>
</div>

        <div className={'mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-4'}>
          {currentPosts.map((post) => (
            <article key={post._id} className={'flex flex-col items-start justify-between block'}>
              <div className="relative w-full">
                <img
                  src={post.image}
                  alt=""
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <span className='text-lg text-gray-700 dark:text-gray-400'>
                    <TimeSince date={post.createdAt} />
                  </span>
                  <span className="relative z-10 rounded-full bg-gray-300 dark:bg-gray-600 dark:text-gray-300 px-3 py-1.5 font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500 hover:text-gray-500">
                    {post.category}
                  </span>
                  <div>
      <span className="text-xs dark:text-gray-300">By: {getUsernameById(post.authorId)}</span>
    </div>
                </div>
                <div className="group relative mt-3">
                <h3 id='line-clamp-1' className="text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600 dark:text-gray-300">
  <Link to={`/post/${post._id}`}>
    {post.caption}
  </Link>
</h3>

                  <p  id='line-clamp-1' className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {post.description}
                  </p>
                </div>
                <div className="flex justify-end mt-2">
              <button onClick={() => handleEdit(post)} className="mr-2">
                <PencilSquareIcon className="h-6 w-6 text-blue-500" />
              </button>
              <button onClick={() => handleDelete(post._id)}>
                <TrashIcon onClick={() => handleDelete(post._id)} className="h-6 w-6 text-red-500" />
              </button>
            </div>
              </div>
            </article>
          ))}
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`rounded-lg bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${i + 1 === currentPage ? 'font-semibold' : ''}`}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      {showModal && selectedPost && (
  <PostEditModal
    post={selectedPost}
    onClose={() => setShowModal(false)}
  />
)}
    </div>
  );
};

export default PostEditComponent;
