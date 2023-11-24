import React, { useEffect, useState } from 'react';

const DEFAULT_COLOR = '#4c3bab';
const LOCAL_STORAGE_KEY = 'color';

const ColorChange = () => {
  const storedColor = localStorage.getItem(LOCAL_STORAGE_KEY) || DEFAULT_COLOR;
  const [color, setColor] = useState(storedColor);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--primary-text-color', color);
    localStorage.setItem(LOCAL_STORAGE_KEY, color);
  }, [color]);

  return (
    <div className="mb-4">
      <label className="block dark:text-white ml-3" htmlFor="color-input">
        Color:
        <input
          type="color"
          id="color-input"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="mt-1"
        />
      </label>
    </div>
  );
};
export default ColorChange;
