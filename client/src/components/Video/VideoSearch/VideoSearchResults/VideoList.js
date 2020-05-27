import React from 'react';
import VideoListItem from './VideoListItem';

const VideoList = ({ onVideoPlay, onVideoAddToQueue, searchResults }) => {
  return (
    <ul className="videoList col-md-4 abridged">
      {
        searchResults && searchResults.map((searchItem) => {
          return (
            <VideoListItem
              onVideoPlay={onVideoPlay}
              onVideoAddToQueue={onVideoAddToQueue}
              key={searchItem.video.id}
              searchItem={searchItem} />
          );
        })
      }
    </ul>
  );
};

export default VideoList;