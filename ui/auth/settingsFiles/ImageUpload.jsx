import React from 'react';

const ImageUpload = ({ handleImage }) => (
  <div>
    <input
      type="file"
      id="newImage"
      accept="image/*, video/*"
      onChange={(e) => handleImage(e.target.files)}
      placeholder="Image"
    />
    <button onClick={handleImage}>Upload</button>
  </div>
);
export default ImageUpload;
