import React, { useState, useRef, useCallback } from 'react';
import { Meteor } from 'meteor/meteor';
import Swal from 'sweetalert2';
import Cropper from 'react-cropper';
import { MdAddAPhoto } from 'react-icons/md';
import JoditEditor from 'jodit-react';
import Loading from '../../../components/spinner/Loading';
import imageCompression from 'browser-image-compression';

const stripHtmlTags = (str) => str.replace(/<\/?[^>]+(>|$)/g, '');

const ProgressBar = ({ progress }) => (
  <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 z-[2000]">
    <div className="h-2 bg-green-500" style={{ width: `${progress}%` }} />
  </div>
);

const NewPostForm = ({ showModal, setShowModal }) => {
  const [description, setDescription] = useState('');
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState(null);
  const [category, setCategory] = useState('social');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const cropperRef = useRef(null);
  const editor = useRef(null);

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setMedia(reader.result);
    reader.onerror = error => console.error('Error reading image: ', error);
    reader.readAsDataURL(file);
  }, []);

  const handlePostSubmit = useCallback(async (event) => {
    event.preventDefault();

    const sanitizedCaption = stripHtmlTags(caption);
    const sanitizedDescription = stripHtmlTags(description);

    const wordCount = sanitizedCaption.split(' ').filter(Boolean).length; // Count words in caption
    if (wordCount > 150) {
      Swal.fire('Oops...', 'The caption must be up to 150 words!', 'error');
      return;
    }
    if (!sanitizedDescription || !media) {
      Swal.fire('Oops...', 'Please fill all required fields!', 'error');
      return;
    }

    const currentUser = Meteor.user();
    if (!currentUser) {
      Swal.fire('Oops...', 'You are not authenticated!', 'error');
      return;
    }

    const authorId = currentUser._id;
    setIsLoading(true);
    setProgress(0);

    try {
      const croppedImageBase64 = cropperRef.current.cropper.getCroppedCanvas().toDataURL('image/jpeg');
      const croppedImageBlob = await (await fetch(croppedImageBase64)).blob();

      const compressedImage = await imageCompression(croppedImageBlob, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      const reader = new FileReader();
      reader.readAsDataURL(compressedImage);
      reader.onloadend = function () {
        const base64data = reader.result;

        Meteor.call('posts.create', {
          authorId,
          caption: sanitizedCaption,
          description: sanitizedDescription,
          link: '',
          base64Media: base64data,
          isVideo: false,
          base64Thumbnail: null,
          category,
        }, (err, postId) => {
          setIsLoading(false);
          setProgress(0);
          if (err) {
            Swal.fire('Oops...', 'Something went wrong!', 'error');
            console.error(err);
          } else if (!postId) {
            Swal.fire('Oops...', 'Something went wrong!', 'error');
            console.error('PostId is undefined or null');
          } else {
            Swal.fire('Success!', 'Your post has been created.', 'success');
            setDescription('');
            setCaption('');
            setCategory('');
            setMedia(null);
            setShowModal(false);
          }
        });
      };
    } catch (e) {
      console.error(e);
    }
  }, [description, media, caption, category, cropperRef]);
// Function to clear the media
const clearMedia = () => {
  setMedia(null);
};

 return (
  <>
      <div className={`fixed mt-16 inset-0 bg-black bg-opacity-50 z-[1999] py-12 px-8 ${showModal ? 'block' : 'hidden'}`}>
        {isLoading && <ProgressBar progress={progress} />}
        <div className="relative p-6 bg-white w-11/12 md:max-w-xl mx-auto rounded shadow-lg z-50 overflow-hidden" style={{ paddingTop: '30px' }}> {/* Adjusted padding top here */}
          <div className="absolute top-2 right-4 flex space-x-2 z-60">
          <button
            className="py-2 px-4 bg-primary dark:bg-green-500 text-white rounded shadow-lg"
            disabled={isLoading}
            onClick={handlePostSubmit}
            aria-label="Publish post"
          >
            Publish post
          </button>
          <button
            className="py-2 px-4 bg-red-500 text-white rounded shadow-lg"
            onClick={() => setShowModal(false)}
            aria-label="Cancel"
          >
            Cancel
          </button>
        </div>
                <div className="overflow-y-auto max-h-[calc(100vh-200px)]" style={{ padding: '7px 0' }}> {/* Added gap above and below this div */}
              <form onSubmit={handlePostSubmit} className="mt-4">
              <label className="new-post-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="new-post-input"
              >
              <option value="health">Health</option>
              <option value="social">Social</option>
              <option value="prophecy">Prophecy</option>
              <option value="gospel">Gospel</option>
            </select>
            <JoditEditor
            ref={editor}
            value={caption}
            config={{ readonly: false }}
            tabIndex={1}
            onBlur={newContent => setCaption(newContent)}
            onChange={newContent => {}}
          />
           <JoditEditor
              ref={editor}
              value={description}
              config={{ readonly: false }}
              tabIndex={1}
              onBlur={newContent => setDescription(newContent)}
              onChange={newContent => {}}
              style={{ maxHeight: '200px', overflowY: description.split(' ').length > 200 ? 'scroll' : 'hidden' }}
            />
        {media ? (
            <div className="relative">
              <Cropper
                src={media}
                style={{ height: 300, width: '100%' }}
                aspectRatio={4 / 3}
                guides={false}
                ref={cropperRef}
              />
              <button
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                onClick={clearMedia}
              >
                X
              </button>
            </div>
          ) : (
             <label className="block w-full p-2 border border-gray-300 rounded mb-4 cursor-pointer text-center">
              <MdAddAPhoto size={24} />
              <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </label>
          )}
          </form>
        </div>
        </div>
      </div>
   {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[2000] flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="relative pt-1 w-2/3">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                    Loading
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-teal-600">
                    {progress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-200">
                <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default NewPostForm;
