import React, { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const AudioCallComponent = ({ appId, channelName, uid, onEndCall }) => {
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [client, setClient] = useState(null);
  const [token, setToken] = useState(null);
  const [callActive, setCallActive] = useState(false);

  // Function to start the audio call
  const startAudioCall = async (client, appId, channelName, token, uid) => {
    try {
      await client.join(appId, channelName, token, uid);
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await client.publish(audioTrack);
      setLocalAudioTrack(audioTrack);
      setCallActive(true); // Indicate that the call is active
    } catch (error) {
      console.error('Failed to start the audio call:', error);
      // Handle the error (e.g., show an alert to the user)
    }
  };

  // Initialize the Agora client on mount
  useEffect(() => {
    const initClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    setClient(initClient);
  }, []);

  // Fetch the token from the server
  useEffect(() => {
    if (client && !token) {
      Meteor.call('agora.getToken', { channelName }, (error, retrievedToken) => {
        if (error) {
          console.error('Error fetching Agora token:', error);
        } else {
          setToken(retrievedToken);
          // Once the token is retrieved, start the audio call
          startAudioCall(client, appId, channelName, retrievedToken, uid);
        }
      });
    }
  }, [client, appId, channelName, uid]);

  // Cleanup function for the audio track when the component unmounts
  useEffect(() => {
    return () => {
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
        setCallActive(false); // Indicate that the call has ended
      }
      if (client) {
        client.leave();
      }
    };
  }, [localAudioTrack, client]);

  // Function to end the call
  const handleEndCall = async () => {
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    if (client) {
      await client.leave();
    }
    setCallActive(false);
    onEndCall?.(); // Call the passed in onEndCall function
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="mb-4 text-lg text-gray-800">
        {callActive ? 'In Call with User' : 'Call Ended'}
      </div>
      <button
        onClick={handleEndCall}
        className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold focus:outline-none"
        disabled={!callActive}
      >
        End Call
      </button>
      {/* Add more UI elements as necessary */}
    </div>
  );
};

export default AudioCallComponent;
