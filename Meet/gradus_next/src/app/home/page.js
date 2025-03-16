"use client";
import PlaylistPage from "@/Components/PlaylistPage";
import VideoPage from "@/Components/VideoPage";
import { useState } from "react";
import Loader from "@/Components/Loader";

export default function Home() {
    const [playlistsReady, setPlaylistsReady] = useState(false);
  const [videosReady, setVideosReady] = useState(false);
 const showContent = playlistsReady && videosReady;
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        {!showContent && (
        <div className="flex items-center justify-center min-h-screen">
         <Loader />
        </div>
      )}
      <PlaylistPage zone="beyond" onLoaded={() => setPlaylistsReady(true)}/>
      <VideoPage zone="beyond" onLoaded={() => setVideosReady(true)} />
    </div>
  );
}
