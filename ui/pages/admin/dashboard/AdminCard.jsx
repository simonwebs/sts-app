import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { AlbumsCollection } from '../../../../api/collections/AlbumsCollection';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Roles } from 'meteor/alanning:roles';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

const AlbumImage = ({ album, index, totalLength, onDelete, onEdit }) => (
  <div
    className={`snap-center flex-none p-4 ${
      index === 0 ? 'ml-4' : index === totalLength - 1 ? 'mr-4' : ''
    }`}
  >
    <Link to={`/albums/${album._id}`} className="block">
      <img
        src={album.image}
        alt={album.caption}
        className={'h-25 sm:h-48 w-48 shadow-md object-cover object-center rounded-lg border-2 transition-transform duration-300 hover:translate-y-[-10px]'}
      />
    </Link>
    <div className="flex flex-row gap-8 mt-4 ml-5 flex justify-center item-center">
    <div>
 <TrashIcon onClick={() => onDelete(album._id)} className="w-7 h-7 text-lg text-red-600 rounded"/>
    </div>
   <div>
     <PencilSquareIcon onClick={() => onEdit(album._id, album.caption)} className="w-7 h-7 text-lg text-primary rounded"/>
   </div>
    </div>
  </div>
);

const AdminCard = () => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(scrollRef.current?.scrollLeft > 0);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [refresh, setRefresh] = useState(false);

  // Check for arrow visibility
  const checkArrowsVisibility = () => {
    const container = scrollRef.current;

    if (container.scrollLeft === 0) {
      setShowLeftArrow(false);
    } else {
      setShowLeftArrow(true);
    }

    if (container.scrollLeft + container.offsetWidth >= container.scrollWidth) {
      setShowRightArrow(false);
    } else {
      setShowRightArrow(true);
    }
  };

  const handleDelete = (albumId) => {
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
        Meteor.call('albums.remove', albumId, (error) => {
          if (error) {
            console.error(error);
            Swal.fire('Error!', 'There was a problem deleting the album.', 'error');
          } else {
            console.log('Album deleted successfully');
            Swal.fire('Deleted!', 'The album has been deleted.', 'success');
            setRefresh(!refresh);
          }
        });
      }
    });
  };

  const handleEdit = (albumId, caption) => {
    Swal.fire({
      title: 'Edit Caption',
      input: 'text',
      inputValue: caption,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Meteor.call('albums.updateCaption', albumId, result.value, (error) => {
          if (error) {
            console.error(error);
            Swal.fire('Error!', 'There was a problem updating the caption.', 'error');
          } else {
            console.log('Caption updated successfully');
            Swal.fire('Updated!', 'The caption has been updated.', 'success');
            setRefresh(!refresh);
          }
        });
      }
    });
  };

  const { albums, isLoading } = useTracker(() => {
    const albumHandle = Meteor.subscribe('albumsWithAuthors');
    const userId = Meteor.userId();
    const isAdmin = Roles.userIsInRole(userId, ['admin']);

    const fetchedAlbums = AlbumsCollection.find(
      isAdmin ? {} : { authorId: userId },
      { sort: { createdAt: -1 }, limit: 5 },
    ).fetch();

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

  const handleScrollLeft = () => {
    scrollRef.current.scrollBy({ right: 200, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', checkArrowsVisibility);
      checkArrowsVisibility();
      return () => {
        container.removeEventListener('scroll', checkArrowsVisibility);
      };
    }
  }, [scrollRef.current]);

  const renderedAlbums = useMemo(() => (
    albums?.map((album, index) => (
      <AlbumImage key={album._id} album={album} index={index} totalLength={albums?.length} onDelete={handleDelete} onEdit={handleEdit} />
    ))
  ), [albums]);

  return (
    <div className="relative">
      {isLoading
        ? (
        <div className="flex justify-center items-center h-24">
          <div className="lds-dual-ring"></div>
        </div>
          )
        : albums.length > 0
          ? (
        <div className="flex items-center relative">
          {showLeftArrow && <FaArrowLeft className="h-8 w-8 text-primary absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={handleScrollLeft} />}
          {showRightArrow && <FaArrowRight className="h-8 w-8 text-primary absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={handleScrollRight} />}
          <div ref={scrollRef} className="w-full flex overflow-x-scroll no-scrollbar snap-x-mandatory">
            {renderedAlbums}
          </div>
        </div>
            )
          : (
        <div className="flex justify-center items-center h-24 text-gray-500">
          No image found
        </div>
            )}
    </div>
  );
};

export default AdminCard;
