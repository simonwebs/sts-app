import React, { useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = ({ videoSrc }) => {  // Accept videoSrc as a prop
  const videoRef = React.createRef();

  useEffect(() => {
    const options = {
      autoplay: true,
      controls: true,
      sources: [
        {
          src: videoSrc,  // Now this will work
          type: 'video/mp4'
        }
      ]
    };

    let player;
    if (!videojs.getPlayers()['my-video']) {
      player = videojs(videoRef.current, options, function onPlayerReady() {
        console.log('Player is ready');
      });
    } else {
      player = videojs.getPlayers()['my-video'];
    }

    player.on('error', function() {
      console.log('Videojs generated an error:', player.error());
    });

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [videoRef, videoSrc]);  // Added videoSrc to dependency array

  useEffect(() => {
    console.log("Video Source URL:", videoSrc);  // Debugging line
  }, [videoSrc]);

  return (
    <div>
      <video
        ref={videoRef}
        id="my-video"
        className="video-js"
      ></video>
    </div>
  );
};

export default VideoPlayer;
