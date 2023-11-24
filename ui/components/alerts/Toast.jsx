// imports/ui/Toast.jsx
import React, { useEffect } from 'react';

export const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg text-white shadow-lg ${bgColor}`}
      role="alert"
    >
      {message}
    </div>
  );
};
