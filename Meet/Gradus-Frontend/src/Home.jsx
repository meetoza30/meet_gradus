import React, { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [categorizedVideos, setCategorizedVideos] = useState({});

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/fetchCategorizedVideos");
        setCategorizedVideos(response.data.categorizedVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="p-4">
      {Object.keys(categorizedVideos).map((category) => (
        <div key={category} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{category}</h2>
          <div className="flex overflow-x-auto space-x-4 p-2">
            {categorizedVideos[category].map((video) => (
              <div key={video.videoId} className="min-w-[200px] shadow-lg rounded-md p-2">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-auto rounded-md"
                />
                <p className="text-sm mt-2 font-medium">{video.title}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
