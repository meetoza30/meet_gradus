'use client';

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Loader from "@/components/Loader";
import HomeVideoCard from "@/components/HomeVideoCard";

const VideoSearchPage = () => {
  const [videosData, setVideosData] = useState([]);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    if (!searchQuery) return;
    
    const fetchVideos = async () => {
      try {
        const results = await axios.get("http://localhost:5001/search", {
          params: { query: searchQuery },
        });
        setVideosData(results?.data.videos || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, [searchQuery]);

  return (
    <div className="flex items-center">
      <div className="container mx-auto mt-16 flex flex-col items-center">
        <h2 className="text-white text-xl font-bold mt-6 mb-10"><span className="text-green-300">Showing results for:</span><span className="underline ml-2">{searchQuery}</span> </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-16">
          {videosData.length > 0 ? (
            videosData.map((video) => (
              <HomeVideoCard key={video.videoid} video={video} />
            ))
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoSearchPage;
