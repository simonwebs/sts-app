/* eslint-disable multiline-ternary */
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Image } from 'cloudinary-react';

const SearchResult = ({ user }) => {
  const location = useLocation();
  const searchResult = location.state?.searchResult;

  const profileImageId = user?.newImage || user?.profile?.image;
  const cloudName = 'swed-dev';

  const profileImage = profileImageId && profileImageId.startsWith('data:')
    ? profileImageId
    : <Image
        cloudName={cloudName}
        publicId={profileImageId}
        width="auto"
        crop="scale"
        quality="auto"
        fetchFormat="auto"
        secure
        dpr="auto"
        responsive
        className="w-7 h-7 rounded-full mb-1 object-cover"
        alt={`${user?.username}'s avatar`}
      />;

  return (
   <div className={`p-4 bg-white dark:bg-gray-800 shadow-lg fixed w-full m-4 z-10 ${searchResult?.length ? 'block' : 'hidden'}`}>
  {searchResult?.map((item, index) => (
        <div key={index} className="flex items-center my-4 space-x-3">
          {item?.caption ? (
            <Link aria-label={`Post - ${item.caption}`} to={`/post/${item._id}`} key={item._id} className="flex flex-col">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">{item?.caption}</h2>
              <p className="text-gray-500 dark:text-gray-300">{item?.description}</p>
            </Link>
          ) : (
            <Link aria-label={`User - ${item.username}`} to={`/profile/${item._id}`} key={item._id} className="flex items-center space-x-2">
              {profileImage}
              <p className="text-md font-normal text-gray-900 dark:text-white cursor-pointer">{item?.username}</p>
            </Link>
          )}
        </div>
  ))}
    </div>
  );
};
export default SearchResult;
