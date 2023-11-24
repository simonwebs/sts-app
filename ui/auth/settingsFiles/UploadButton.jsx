import React from 'react';

const UploadButton = ({ onClick, progress }) => {
  return (
    <div>
      <input type="file" onChange={onClick} />
      <button onClick={onClick}>Upload</button>
      {progress > 0 && <p>Upload progress: {progress}%</p>}
    </div>
  );
};
export default UploadButton;
