"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HomeVideoCard from "./HomeVideoCard";
// import useLoading from "../Contexts/loadingContext";
import Link from "next/link";

const VideoPage = ({ zone, onLoaded }) => {
  const [categorizedVideos, setCategorizedVideos] = useState({});
//   const { setVideosLoading } = useLoading();
  const [scrollVisibility, setScrollVisibility] = useState({});
  const scrollRef = useRef({});

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        let response;
        if (zone === "beyond") {
          response = await axios.get("http://localhost:5001/fetchCategorizedVideos", {
            params: { email: "hellow@gmail.com" },
          });
          console.log(response?.data)
        } else if (zone === "academia") {
          response = await axios.get("http://localhost:5001/fetchAcademicCategorizedVideos", {
            params: { email: "hellow@gmail.com" },
          });
        }

        if (response) {
          setCategorizedVideos(response.data.categorizedVideos);

          // Initialize scroll button visibility state
          const initialVisibility = {};
          Object.keys(response.data.categorizedVideos || {}).forEach((category) => {
            initialVisibility[category] = { left: false, right: true };
          });
          setScrollVisibility(initialVisibility);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
       finally {
        if (onLoaded) onLoaded();
      }
    };

    fetchVideos();
  }, [zone]);

  const updateScrollButtonVisibility = (category) => {
    const container = scrollRef.current[category];
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setScrollVisibility((prev) => ({
        ...prev,
        [category]: {
          left: scrollLeft > 0,
          right: scrollLeft < scrollWidth - clientWidth - 10,
        },
      }));
    }
  };

  const scroll = (category, direction) => {
    const container = scrollRef.current[category];
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      // Update scroll button visibility after scrolling
      setTimeout(() => {
        updateScrollButtonVisibility(category);
      }, 500);
    }
  };

  useEffect(() => {
    Object.keys(scrollRef.current).forEach((category) => {
      const container = scrollRef.current[category];
      if (container) {
        container.addEventListener("scroll", () => updateScrollButtonVisibility(category));
      }
    });

    return () => {
      Object.keys(scrollRef.current).forEach((category) => {
        const container = scrollRef.current[category];
        if (container) {
          container.removeEventListener("scroll", () => updateScrollButtonVisibility(category));
        }
      });
    };
  }, [categorizedVideos]);

  return (
    <div className="p-6 space-y-12">
      {Object.keys(categorizedVideos || {}).map((category) => (
        <div key={category} className="relative">
          <Link href={`/videos/${category}?zone=${zone}`}>
            <h2 className="text-2xl font-semibold mb-4 text-white">{`${category}  >`}</h2>
          </Link>
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
              className="flex overflow-hidden hide-scrollbar gap-4 pb-16 border-b-2 border-green-200"
              onScroll={() => updateScrollButtonVisibility(category)}
            >
              {(categorizedVideos[category] || []).map((video) => (
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
