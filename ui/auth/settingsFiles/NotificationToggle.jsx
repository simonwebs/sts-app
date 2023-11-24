import React from 'react';

const NotificationToggle = ({ notifications, setNotifications }) => {
  const handleChange = (event) => {
    setNotifications(event.target.checked);
  };

  return (
    <div className="mb-4">
      <label className="block dark:text-white ml-3">
        Notifications:
        <input type="checkbox" checked={notifications} onChange={handleChange} className="mt-1" />
      </label>
    </div>
  );
};
export default NotificationToggle;
