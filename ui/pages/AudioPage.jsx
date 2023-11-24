import React, { useState } from 'react';

const AudioPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioFiles = [
    { id: 1, title: 'Audio File 1', src: 'audio-file-1.mp3', cover: 'cover-1.jpg' },
    { id: 2, title: 'Audio File 2', src: 'audio-file-2.mp3', cover: 'cover-2.jpg' },
    // Add more audio files as needed
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg w-full md:w-96">
        <div className="flex items-center mb-4">
          <img
            src="profile-image.jpg"
            alt="Author Profile"
            className="w-12 h-12 rounded-full mr-3"
          />
          <div>
            <p className="text-base font-semibold">Username</p>
            <p className="text-sm text-gray-600">Author</p>
          </div>
        </div>
        {audioFiles.map((audio) => (
          <div key={audio.id} className="flex items-center mt-4">
            <img
              src={audio.cover}
              alt={`Cover for ${audio.title}`}
              className="w-16 h-16 object-cover rounded-md mr-3"
            />
            <div className="relative">
              <h2 className="text-lg font-semibold mb-2">{audio.title}</h2>
              <div className="relative">
                <img
                  src="album-cover-image.jpg"
                  alt="Album Cover"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <button
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-md"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {/* Pause Icon */}
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {/* Play Icon */}
                    </svg>
                  )}
                </button>
              </div>
              <audio src={audio.src} controls className="w-full mt-4"></audio>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AudioPage;
