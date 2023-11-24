import React from 'react';

const Modal = ({ showModal, setShowModal, children }) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 ${showModal ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0" onClick={() => setShowModal(false)}></div>
      <div className="relative p-6 bg-white w-11/12 md:max-w-xl mx-auto rounded shadow-lg z-50">
        <button className="absolute top-4 right-4 text-gray-700" onClick={() => setShowModal(false)}>
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
