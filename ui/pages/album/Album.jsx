import React, { useState, useCallback } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { AlbumsCollection } from '../../../api/collections/AlbumsCollection';
const Image = React.lazy(() => import('cloudinary-react').then(module => ({ default: module.Image })));
const Transformation = React.lazy(() => import('cloudinary-react').then(module => ({ default: module.Transformation })));
const ClipLoader = React.lazy(() => import('react-spinners/ClipLoader'));
import AuthorProfileImage from '../AuthorProfileImage';

const AlbumItem = ({ album, onClick }) => {
  const cloud_name = 'cedar-christian-bilingual-school';

  return (
    <article
      key={album._id}
      className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
      onClick={() => onClick(album.image)}
    >
      <Image
        cloud_name={cloud_name}
        publicId={album.image}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        alt="Album"
      >
        <Transformation crop="fill" quality="auto" fetchFormat="auto" />
      </Image>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
      <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
      <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
        <time dateTime={album.createdAt} className="mr-8">
          {formatDate(album.createdAt)}
        </time>
        <div className="-ml-4 flex items-center gap-x-4">
          <svg viewBox="0 0 2 2" className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50">
            <circle cx={1} cy={1} r={1} />
          </svg>
          <div className="flex gap-x-2.5">
          <AuthorProfileImage
  cloud_name={cloud_name}
  authorImage={album.author?.profile?.image}
  size={40} // Adjust the size as needed
/>

          </div>
        </div>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
        {album.caption}
      </h3>
    </article>
  );
};


const Album = () => {
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const { albums, isLoading } = useTracker(() => {
    const albumHandle = Meteor.subscribe('albumsWithAuthors');
    const fetchedAlbums = AlbumsCollection.find({}).fetch();
    const authorIds = fetchedAlbums.map(album => album.authorId);
    const authors = Meteor.users.find({ _id: { $in: authorIds } }).fetch();
    const albumsWithAuthors = fetchedAlbums.map(album => {
      const author = authors.find(a => a._id === album.authorId);
      return { ...album, author };
    });

    return {
      albums: albumsWithAuthors,
      isLoading: !albumHandle.ready(),
    };
  });

  const openFullscreen = useCallback((imageUrl) => {
    setFullscreenImage(imageUrl);
  }, []);

  const closeFullscreen = useCallback(() => {
    setFullscreenImage(null);
  }, []);

 if (isLoading) {
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <ClipLoader size={25} color={'#4C3BAB'} />
      </React.Suspense>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-700 album-container">
      {fullscreenImage && (
       <div
  className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75"
  onClick={closeFullscreen}
  style={{ zIndex: 1000 }}>
  <img src={fullscreenImage} alt="Fullscreen View" className="max-w-full max-h-full"/>
</div>

      )}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-20">
        <div id="album-collection" className="mx-auto max-w-2xl text-center mt-32">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-300 sm:text-4xl">Album Collection</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Explore our collection of beautiful albums.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none md:grid-cols-3 lg:grid-cols-4">
          {albums.map((album, index) => (
            <AlbumItem
              key={album._id}
              album={album}
              onClick={openFullscreen}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default Album;
