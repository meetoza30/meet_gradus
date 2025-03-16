'use client';

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import HomeVideoCard from "@/Components/HomeVideoCard";
import Loader from "@/Components/Loader";
import CategoryPlaylists from "@/Components/CategoryPlaylists";

const CategoryVideos = () => {
    const { category } = useParams();  // Get category from URL
    const searchParams = useSearchParams();  // Get query parameters
    const zone = searchParams.get("zone");

    const [videos, setVideos] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/fetchVideos/${category}`, {
                    params: { email: "hellow@gmail.com", zone: zone }
                });

                setVideos(response?.data?.videos || []);
                setPlaylists(response?.data?.playlists || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [category, zone]);

    return (
        <div className="flex flex-col mt-20">
            {loading ? (
                <div className="flex items-center justify-center min-h-screen mb-5">
                    <Loader />
                </div>
            ) : (
                <>
                    <CategoryPlaylists playlistData={playlists} />
                    <div className="text-2xl ml-6 font-semibold mb-4 text-white">{`${category} videos >`}</div>
                    <div className="grid mx-auto items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-20">
                        {videos.length > 0 ? (
                            videos.map((video) => <HomeVideoCard key={video.videoId} video={video} />)
                        ) : (
                            <div>No videos found</div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default CategoryVideos;
