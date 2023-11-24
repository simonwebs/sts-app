import React, { useState } from 'react';
import { FaVideo, FaPhone, FaComments } from 'react-icons/fa';
import VideoCallComponent from '../../components/videoAndCallcomponents/VideoCallComponent';
import AudioCallComponent from '../../components/videoAndCallcomponents/AudioCallComponent';
import ChatComponent from '../../components/chat/ChatComponent';

const LetsTalk = () => {
  // State to manage the visibility of the call and chat components
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showAudioCall, setShowAudioCall] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // State and functions to handle messages
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (newMessage) => {
    setMessages([...messages, { text: newMessage, isOwn: true }]);
  };

  // Define the logic to end the audio call
  const handleEndAudioCall = () => {
    setShowAudioCall(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            MyApp
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0 flex justify-around">
            {/* Icon Buttons */}
            <FaVideo
              className="text-4xl cursor-pointer text-blue-500"
              onClick={() => setShowVideoCall(!showVideoCall)}
            />
            <FaPhone
              className="text-4xl cursor-pointer text-green-500"
              onClick={() => setShowAudioCall(!showAudioCall)}
            />
            <FaComments
              className="text-4xl cursor-pointer text-yellow-500"
              onClick={() => setShowChat(!showChat)}
            />

            {/* Video Call Component */}
            {showVideoCall && (
              <div className="fixed inset-0 bg-black bg-opacity-50">
                <div className="rounded-lg h-96 bg-white p-4 shadow m-4">
                  <VideoCallComponent />
                </div>
              </div>
            )}

            {/* Audio Call Component */}
            {showAudioCall && (
              <div className="fixed inset-0 bg-black bg-opacity-50">
                <div className="rounded-lg h-96 bg-white p-4 shadow m-4">
                  <AudioCallComponent onEndCall={handleEndAudioCall} />
                </div>
              </div>
            )}

            {/* Chat Component */}
            {showChat && (
              <div className="fixed inset-0 bg-black bg-opacity-50">
                <div className="rounded-lg h-96 bg-white p-4 shadow m-4">
                  <ChatComponent messages={messages} onSendMessage={handleSendMessage} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LetsTalk;