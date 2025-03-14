import React from "react";
import {Link} from 'react-router-dom'
const HomeVideoCard = ({ video }) => {
  return (
    <Link to=''>
    <div className="min-w-[280px] w-[280px] flex flex-col rounded-lg  transition-transform hover:scale-105">
      
      <div className="w-full aspect-video rounded-lg overflow-hidden">
        <img 
          src={video?.thumbnail} 
          className="w-full h-full object-cover" 
          alt="Video Thumbnail" 
        />
      </div>
      <div className="mt-2 p-1">
        <h1 className="text-white text-base font-medium line-clamp-2">
          {video?.title}
        </h1>
        <p className="text-green-200 font-bo text-sm mt-1">{video?.channel || "Channel name"}</p>
        <div className="flex items-center text-xs text-gray-400 mt-1">
          {/* <span>{video.views || "0 views"}</span> */}
          {/* <span className="mx-1">•</span> */}
          {/* <span>{video.uploadedAt || "1 day ago"}</span> */}
        </div>
      </div>
    </div>
    </Link>
  );
};

export default HomeVideoCard;