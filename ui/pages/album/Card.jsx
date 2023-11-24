import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { AlbumsCollection } from '../../../api/collections/AlbumsCollection';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { debounce } from 'lodash';
import Loading from '../../components/spinner/Loading';

const LazyImage = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    className="object-cover w-full h-40 sm:h-64 rounded-lg shadow-lg ring-2 ring-indigo-200 hover:translate-y-2 transform transition duration-300 ease-in-out"
  />
);

const ScrollButton = ({ direction, onClick }) => (
  <button
    aria-label={`Scroll ${direction}`}
    onClick={onClick}
    className="absolute top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
  >
    {direction === 'left' ? <FaArrowLeft /> : <FaArrowRight />}
  </button>
);

const Card = () => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const { id } = useParams();
  const { albums, isLoading } = useTracker(() => {
    const albumHandle = Meteor.subscribe('albumsWithAuthors');
    const fetchedAlbums = AlbumsCollection.find({}, { sort: { createdAt: -1 } }).fetch();
    return {
      albums: fetchedAlbums,
      isLoading: !albumHandle.ready(),
    };
  }, [id]);

  useEffect(() => {
    // ... existing useEffect logic ...
  }, [albums]);

  const handleScroll = (direction) => {
    // ... existing handleScroll logic ...
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative overflow-x-auto">
      <div ref={scrollRef} className="flex overflow-x-auto scroll-smooth scrollbar-hide">
        {albums.map((album, index) => ( // Corrected: Added 'index' as a parameter
          <div key={album._id} className={`flex-none p-4 lg:w-1/5 md:w-1/3 sm:w-1/2 ${index === 0 ? 'first-card' : index === albums.length - 1 ? 'last-card' : ''}`}>
            <Link to={`/album/${album._id}`}>
              <LazyImage src={album.image} alt={album.title} />
            </Link>
          </div>
        ))}
      </div>
      {showLeftArrow && (
        <ScrollButton direction="left" onClick={() => handleScroll('left')} />
      )}
      {showRightArrow && (
        <ScrollButton direction="right" onClick={() => handleScroll('right')} />
      )}
    </div>
  );
};

export default React.memo(Card);
