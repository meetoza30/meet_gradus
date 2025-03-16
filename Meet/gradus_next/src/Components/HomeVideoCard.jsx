"use client";

import Image from "next/image";
import Link from "next/link";

const HomeVideoCard = ({ video }) => {
  return (
    <Link href="#" className="min-w-[280px] w-[280px] flex flex-col rounded-lg border border-green-200 p-2 transition-transform hover:scale-105">
      <div className="w-full aspect-video rounded-lg overflow-hidden">
        <img
          src={video?.thumbnail} 
          width={280} 
          height={157} 
          className="w-full h-full object-cover" 
          alt="Video Thumbnail" 
          
        />
      </div>
      <div className="mt-2 p-1">
        <h1 className="text-white text-base font-medium line-clamp-2">
          {video?.title}
        </h1>
        <p className="text-green-200 font-bold text-sm mt-1">{video?.channelName || "Channel name"}</p>
      </div>
    </Link>
  );
};

export default HomeVideoCard;
