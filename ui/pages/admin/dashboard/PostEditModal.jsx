import React from 'react';

// PostEditModal component
const PostEditModal = ({ showModal, onDelete, closeModal, editedPost, setEditedPost, handleSaveChanges, isSaving }) => {
  return (
    <div>
       {isSaving && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
          }}
        ></div>
       )}
      <div>
        <label>
          Caption:
          <textarea
            rows={2}
            value={editedPost.caption}
            onChange={(e) => setEditedPost({ ...editedPost, caption: e.target.value })}
            className="block w-full h-auto rounded-lg focus:ring-blue-500 focus:border-primary sm:text-sm"
            placeholder="Enter caption here..."
          ></textarea>
        </label>
      </div>
      <div>
        <label>
          Description:
          <textarea
            rows={2}
            value={editedPost.description}
            onChange={(e) => setEditedPost({ ...editedPost, description: e.target.value })}
            className="block w-full h-auto rounded-lg focus:ring-blue-500 focus:border-primary sm:text-sm"
            placeholder="Enter description here..."
          ></textarea>
        </label>
      </div>

      <div className="flex justify-between mt-4">
         <button
          type="button"
          onClick={closeModal}
          className="inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-gray-300 text-base font-medium text-black hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-75 sm:text-sm"
        >
          Cancel
        </button>
       <button
  type="button"
  onClick={handleSaveChanges}
  className="inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-75 sm:text-sm"
>
  {isSaving
    ? <ClipLoader size={30} color={'#ffffff'} />
    : 'Save'
  }
</button>
      </div>
    </div>
  );
};

export default PostEditModal;
