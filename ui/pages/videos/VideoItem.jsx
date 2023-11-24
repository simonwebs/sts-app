import React from 'react'

const VideoItem = ({ video }) =>{
  const renderVideo = () => {
    if (video.platform === 'youtube') {
      const videoId = new URL(video.url).searchParams.get('v');
      return (
        <iframe
          width="400"
          height="225"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          muted
        ></iframe>
      );
    }
    // Handle other platforms here...
  };

  return (
    <div>
      <h2>{video.title}</h2>
      <p>By: {video.authorId}</p>
      <p>Category: {video.category}</p>
      <p>Platform: {video.platform}</p>
      <p>View Count: {video.viewCount}</p>
      <p>Loves: {video.loves.length}</p>
      {renderVideo()}
    </div>
  );
}
export default VideoItem