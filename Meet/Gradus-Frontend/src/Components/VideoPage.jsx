import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HomeVideoCard from "./HomeVideoCard";
import { useNavigate } from "react-router-dom";

const VideoPage = () => {
  const [categorizedVideos, setCategorizedVideos] = useState({});
  const [loading, setLoading] = useState(true);
  const [scrollVisibility, setScrollVisibility] = useState({});
  const navigate = useNavigate()
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/fetchCategorizedVideos", {
          params: { email: "virat@gmail.com" },
        });
        setCategorizedVideos(response.data.categorizedVideos);
        
        // Initialize scroll button visibility state for each category
        const initialVisibility = {};
        Object.keys(response.data.categorizedVideos).forEach(category => {
          initialVisibility[category] = { left: false, right: true };
        });
        setScrollVisibility(initialVisibility);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const scrollRef = useRef({});
  const viewCategoryVideos = (category)=>{
    navigate(`/videos/${category}`)
  }
  const updateScrollButtonVisibility = (category) => {
    const container = scrollRef.current[category];
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      
      setScrollVisibility(prev => ({
        ...prev,
        [category]: {
          left: scrollLeft > 0,
          right: scrollLeft < scrollWidth - clientWidth - 10
        }
      }));
    }
  };

  const scroll = (category, direction) => {
    const container = scrollRef.current[category];
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({ 
        left: direction === "left" ? -scrollAmount : scrollAmount, 
        behavior: "smooth" 
      });
      
      // Update scroll button visibility after scrolling
      setTimeout(() => {
        updateScrollButtonVisibility(category);
      }, 500);
    }
  };

  // Add scroll event listeners
  useEffect(() => {
    const containers = scrollRef.current;
    
    const handleScroll = (category) => {
      updateScrollButtonVisibility(category);
    };
    
    // Set up event listeners for each scroll container
    Object.keys(containers).forEach(category => {
      const container = containers[category];
      if (container) {
        container.addEventListener('scroll', () => handleScroll(category));
      }
    });
    
    // Clean up
    return () => {
      Object.keys(containers).forEach(category => {
        const container = containers[category];
        if (container) {
          container.removeEventListener('scroll', () => handleScroll(category));
        }
      });
    };
  }, [categorizedVideos]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-xl">Loading videos...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-12">
      {Object.keys(categorizedVideos).map((category) => (
        <div key={category} className="relative">
          <h2 className="text-2xl font-semibold mb-4 underline cursor-pointer text-white" onClick={()=>{viewCategoryVideos(category)}}>{category}</h2>
          <div className="relative group">
            {/* Left Scroll Button */}
            {scrollVisibility[category]?.left && (
              <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => scroll(category, "left")}
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Scrollable Video Row */}
            <div
              ref={(el) => (scrollRef.current[category] = el)}
              className="flex overflow-hidden hide-scrollbar gap-4 pb-6"
              onScroll={() => updateScrollButtonVisibility(category)}
            >
              {categorizedVideos[category].map((video) => (
                <HomeVideoCard key={video.id} video={video} />
              ))}
            </div>

            {/* Right Scroll Button */}
            {scrollVisibility[category]?.right && (
              <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => scroll(category, "right")}
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoPage;