import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Image } from 'cloudinary-react';
import { Link, useParams } from 'react-router-dom';
import TimeSince from '../components/TimeSince';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const PostImage = ({ cloud_name, postImage }) => {
  if (!cloud_name) return <p>Cloud name is missing</p>;

  if (postImage) {
    return postImage.startsWith('data:') ? (
      <img src={postImage} className="h-12 w-12 rounded-lg hover:shadow-lg" alt="Post image" />
    ) : (
      <Image
        cloud_name={cloud_name}
        publicId={postImage}
        crop="scale"
        quality="auto"
        fetchFormat="auto"
        secure
        dpr="auto"
        width="48" 
        height="48" 
        responsive
        className="h-12 w-12 rounded-lg hover:shadow-lg"
        alt="Image related to the post"
      />
    );
  }

  return <p>No post image</p>;
};

const PostCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categoryId } = useParams();
  const [categoryPostCounts, setCategoryPostCounts] = useState({});
  const cloud_name = 'cedar-christian-bilingual-school';

  useEffect(() => {
    if (!categoryId) {
      // Debug: Logging a message to understand the flow
     // console.log("Fetching distinct categories");

      Meteor.call('getDistinctCategories', (err, result) => {
        setIsLoading(false);
        
        if (err) {
          setError(err);
         // console.error('Error fetching categories:', err.message);
          return;
        }
        
        // Debug: Logging received categories
       // console.log("Received categories:", result.categories);

        const categoriesWithAuthors = result.categories.map(category => {
          const author = result.authors.find(a => a._id === category.latestPost.authorId);
          return { ...category, latestPost: { ...category.latestPost, author } };
        });

       //console.log("Before setting categories: ", categories);
setCategories(categoriesWithAuthors);
//console.log("After setting categories: ", categoriesWithAuthors);

        categoriesWithAuthors.forEach(category => {
          if (category && category.name) {
            // Debug: Logging before calling the method
         
            Meteor.call('getPostCountByCategory', category.name, (error, count) => {
              if (error) {
               // console.error(`Error fetching post count for category ${category.name}:`, error);
              } else {
                // Debug: Logging successful count retrieval
               // console.log(`Successfully fetched post count for category ${category.name}:`, count);
                
                setCategoryPostCounts(prevCounts => ({ ...prevCounts, [category.name]: count }));
              }
            });
          }
        });
      });
    }
  }, [categoryId]);


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    {categories.map((category, index) => {
        const latestPost = category.latestPost;
        if (!latestPost || !latestPost.author) return null;

        return (
          <div
            key={index}
            className="relative dark:bg-gray-700 flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 hover:shadow-md focus-within:ring-"
          >
            <div className="flex-shrink-0">
              <PostImage cloud_name={cloud_name} postImage={latestPost.image} />
            </div>
            <div className="min-w-0 flex-1">
            <Link to={`/${category.name}`} className="focus:outline-none" aria-label={`Category: ${category.name}`}>
                <p className="text-sm font-medium dark:text-gray-400">{capitalizeFirstLetter(latestPost.category)}</p>
                  <span className='text-lg text-gray-700 dark:text-gray-400'>
                        <TimeSince date={latestPost.createdAt} className="text-sm font-medium dark:text-gray-400" />
                  </span>
              </Link>
              <div>
                <span className="text-primary dark:text-cyan-400 rounded py-2 px-1 shadow-md">
                  {categoryPostCounts[category.name] || 0}{' '}
                  <span aria-label={`${categoryPostCounts[category.name] === 1 ? 'post' : 'posts'}`}></span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostCategories;
