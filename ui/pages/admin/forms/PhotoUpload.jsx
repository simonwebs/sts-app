import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';

const PhotoUpload = ({ image, setImage }) => {
  const [progress, setProgress] = useState(0);
  const cropperRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentLoaded = Math.round((event.loaded / event.total) * 100);
          setProgress(percentLoaded);
        }
      };
      reader.onload = () => {
        setImage(reader.result);
        setProgress(100);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImage = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    setImage(cropper.getCroppedCanvas().toDataURL());
  };

  const clearImage = () => {
    setImage(null);
    setProgress(0);
  };

  return (
    <div>
      <h2 className='dark:text-gray-300'>Upload your Photo</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {progress > 0 && progress < 100 && (
        <div>
          <progress value={progress} max="100" />
        </div>
      )}
      {image && (
        <div>
          <Cropper
            src={image}
            ref={cropperRef}
            style={{ height: 400, width: '100%' }}
            // Cropper.js options
            aspectRatio={1}
            guides={false}
          />
          <button onClick={getCroppedImage}>Crop Image</button>
          <button onClick={clearImage}>Clear Image</button>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;