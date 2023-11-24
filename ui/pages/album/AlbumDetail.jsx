import React, { useCallback, useState, useMemo, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
const ClipLoader = lazy(() => import('react-spinners/ClipLoader')); // Lazy-load
import { AlbumsCollection } from '../../../api/collections/AlbumsCollection';
import { Image, Transformation } from 'cloudinary-react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const AlbumDetail = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [fullSize, setFullSize] = useState(false);

  const { album, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('albumsWithAuthors', albumId);
    return {
      album: AlbumsCollection.findOne(albumId),
      isLoading: !handle.ready(),
    };
  }, [albumId]); 

  const handleFullSizeClick = useCallback(() => {
    if (fullSize) {
      window.scrollTo(0, localStorage.getItem('scrollPosition') || 0);
    } else {
      localStorage.setItem('scrollPosition', window.pageYOffset);
    }
    setFullSize(!fullSize);
  }, [fullSize]);

  const cloud_name = 'cedar-christian-bilingual-school';

  const albumImage = useMemo(() => {
    if (!album?.image) return <p>No album image</p>;

    const albumImageId = album.image;
    return albumImageId.startsWith('data:')
      ? <img src={albumImageId} className={fullSize ? 'w-screen h-screen object-contain' : 'w-full shadow-lg rounded-2xl bg-gray-50 object-cover object-center lg:h-[34.5rem] md:max-w-xl md:m-auto'} />
      : (
        <Image cloud_name={cloud_name} publicId={albumImageId} quality="auto" fetchFormat="auto" className={fullSize ? 'w-screen h-screen object-contain' : 'w-full shadow-lg rounded-2xl bg-gray-50 object-cover object-center lg:h-[34.5rem] md:max-w-xl md:m-auto'} aspectRatio="9:16">
          <Transformation quality="auto" crop="fit" gravity="face" />
        </Image>
      );
  }, [album, fullSize, cloud_name]);

    if (isLoading) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ClipLoader size={25} color={'#4C3BAB'} />
      </Suspense>
    );
  }

  if (!album) {
    return <div>Album not found.</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-6 md:px-16 py-10 mt-10">
      <div className={fullSize ? 'fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-black' : ''}>
        <button className="absolute top-10 left-10 z-10 p-2  m-8 rounded-full" onClick={() => navigate('/')}> <FaArrowLeft className='text-lg font-sm text-cyan-600 dark:text-gray-200 hover:text-cyan-800'/>
        </button>
        <button className="absolute top-10 right-10 z-10 p-2  m-8 rounded-full" onClick={() => navigate('/album')}>  <FaArrowRight className='text-lg font-sm text-cyan-600 dark:text-gray-200 hover:text-cyan-800'/>
        </button>
        <div className="cursor-pointer" onClick={handleFullSizeClick}>
          {albumImage}
        </div>
      </div>
    </div>
  );
};

export default React.memo(AlbumDetail);
