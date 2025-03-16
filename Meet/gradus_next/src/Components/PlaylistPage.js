"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PlaylistCard from "./PlaylistCard";
import { usePathname } from "next/navigation";

const PlaylistPage = (props) => {
  const [playlists, setPlaylists] = useState({});
  const scrollRef = useRef(null);
  const pathname = usePathname();

  const [scrollVisibility, setScrollVisibility] = useState({
    left: false,
    right: true,
  });
//   const playlists = {
//     "playlist1": {
//       "channelName": "Tech Explained",
//       "playName": "JavaScript Mastery: Learn from Scratch",
//       "playThumbnail": "https://via.placeholder.com/380x214.png?text=JavaScript+Mastery"
//     },
//     "playlist2": {
//       "channelName": "CodeWithMe",
//       "playName": "Next.js Full Course for Beginners",
//       "playThumbnail": "https://via.placeholder.com/380x214.png?text=Next.js+Course"
//     },
//     "playlist3": {
//       "channelName": "Design Insights",
//       "playName": "UI/UX Design Principles for Developers",
//       "playThumbnail": "https://via.placeholder.com/380x214.png?text=UI%2FUX+Design"
//     },
//     "playlist4": {
//       "channelName": "AI Hub",
//       "playName": "Machine Learning Basics: A Step-by-Step Guide",
//       "playThumbnail": "https://via.placeholder.com/380x214.png?text=Machine+Learning"
//     },
//     "playlist5": {
//       "channelName": "Web Dev Simplified",
//       "playName": "React vs Vue vs Angular: Which One to Choose?",
//       "playThumbnail": "https://via.placeholder.com/380x214.png?text=React+vs+Vue+vs+Angular"
//     }
//   }
  
  
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const updateScrollButtonVisibility = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
      setScrollVisibility({
        left: scrollLeft > 0,
        right: scrollLeft + clientWidth < scrollWidth - 10,
      });
    }
  };

  useEffect(() => {
    console.log("Props received in PlaylistPage:", props.zone );

    if (!props.zone) {
      console.error("Error: zone is undefined. Check if the parent component is passing it correctly.");
      return;
    }

    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/getPlaylists/${props.zone}`, {
          params: { email: "hellow@gmail.com" },
        });
        setPlaylists(response.data.playlists);
        console.log(response.data.playlists);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        if (props.onLoaded) props.onLoaded();
      }
    };

    fetchPlaylist();
  }, [props.zone]);

  useEffect(() => {
    if (Object.keys(playlists).length > 0) {
      setTimeout(updateScrollButtonVisibility, 100);
    }
  }, [playlists]);

  useEffect(() => {
    const currentScrollRef = scrollRef.current;
    if (currentScrollRef) {
      currentScrollRef.addEventListener("scroll", updateScrollButtonVisibility);
    }
    return () => {
      if (currentScrollRef) {
        currentScrollRef.removeEventListener("scroll", updateScrollButtonVisibility);
      }
    };
  }, []);

  return (
    <div className="p-6 space-y-12 mt-20">
      <h2 className="text-2xl font-semibold mb-4 text-white">{`Curated playlists for you >`}</h2>
      <div className="relative group">
        {scrollVisibility.left && (
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll("left")}
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div ref={scrollRef} className="flex overflow-hidden hide-scrollbar gap-4 pb-6" onScroll={updateScrollButtonVisibility}>
          {Object.keys(playlists).map((playlistId) => (
            <PlaylistCard key={playlistId} playlist={playlists[playlistId]} playlistId={playlistId} />
          ))}
        </div>

        {scrollVisibility.right && (
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll("right")}
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;
