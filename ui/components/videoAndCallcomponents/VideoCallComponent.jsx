import React, { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { Meteor } from 'meteor/meteor';

const VideoCallComponent = ({ appId, channelName, uid, onEndCall }) => {
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [client, setClient] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Initialize the Agora client on mount
    const initClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    setClient(initClient);
  }, []);

  useEffect(() => {
    // Fetch the token from the server
    Meteor.call('agora.getToken', { channelName }, (error, retrievedToken) => {
      if (error) {
        console.error('Error fetching Agora token:', error);
      } else {
        setToken(retrievedToken);
      }
    });
  }, [channelName]);

  useEffect(() => {
    // Start the video call once the client is initialized and the token is fetched
    if (client && token) {
      const startVideoCall = async () => {
        try {
          await client.join(appId, channelName, token, uid);
          const videoTrack = await AgoraRTC.createCameraVideoTrack();
          await client.publish(videoTrack);
          setLocalVideoTrack(videoTrack);
          videoTrack.play('local-video');
        } catch (error) {
          console.error('Failed to start the video call:', error);
        }
      };

      startVideoCall();
    }

    return () => {
      // Cleanup function to stop and close the video track when the component unmounts
      localVideoTrack?.stop();
      localVideoTrack?.close();
      setLocalVideoTrack(null);
    };
  }, [client, token, appId, channelName, uid]);

  const handleEndCall = async () => {
    if (client) {
      await client.leave();
    }
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    setLocalVideoTrack(null);
    onEndCall?.(); // Call the passed in onEndCall function
  };

  return (
    <div className="flex flex-col py-16 px-8 min-h-screen">
      <div className="px-4 py-2 bg-white shadow-md">
        <h2 className="text-xl text-center font-semibold text-gray-800">Video Call</h2>
      </div>
      <div className="flex-grow p-4 bg-gray-100 overflow-hidden">
        <div id="local-video" className="w-full h-full bg-black"></div>
      </div>
      <div className="px-4 py-2 bg-white shadow-up-md">
        <div className="flex space-x-4 justify-center">
          <button onClick={handleEndCall} className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold focus:outline-none">End Call</button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallComponent;
