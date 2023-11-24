import React, { useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { XMarkIcon } from '@heroicons/react/24/solid';

const Navigation = ({ isOpen, toggleSidebar, items, onNavigate }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const groupedItems = items.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  const currentYear = new Date().getFullYear();

  return (
    <nav className={`guest-navigation fixed flex flex-shrink-0 w-64 p-5 bg-cyan-700/100 dark:bg-cyan-800 border-r dark:border-gray-600 h-full z-30 flex flex-col ${isOpen ? 'open' : 'closed'}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="lg:hidden flex justify-end">
        <button onClick={toggleSidebar} className="p-2 text-white">
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      <ul className="space-y-2 py-4 my-2 flex-grow">
        {Object.keys(groupedItems).map((category) => (
          <li key={category}>
            <button
              onClick={() => setOpenDropdown(openDropdown === category ? null : category)}
              className="flex justify-between items-center w-full text-white p-2 rounded-md hover:bg-cyan-700"
            >
              {category}
              <span className="text-white text-xs">
                {openDropdown === category ? <FiMinus className="inline w-3 h-3" /> : <FiPlus className="inline w-3 h-3" />}
              </span>
            </button>
            {openDropdown === category && (
              <ul className="ml-4">
                {groupedItems[category].map((item) => (
                  <li key={item.name} className="flex items-center space-x-2 py-1 px-4 rounded-md hover:bg-cyan-700">
                    <item.icon className="h-5 w-5 text-white" />
                    <button
                      className="block text-sm text-white w-full text-left"
                      onClick={() => {
                        onNavigate(item.name); // Changed this line
                        toggleSidebar();
                      }}
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 'auto' }} className="text-white text-center mb-20">
        <p>Cedar Christian Bilingual School</p>
        <p>© {currentYear} All Rights Reserved.</p>
      </div>
    </nav>
  );
};

export default Navigation;
