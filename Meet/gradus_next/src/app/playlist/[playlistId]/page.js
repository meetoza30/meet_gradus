'use client';

import { useParams } from 'next/navigation';
import PlaylistViewer from '@/Components/PlaylistViewer';

const PlaylistPage = () => {
    
    const { playlistId } = useParams(); // Extracting playlistId from URL
    console.log(playlistId)
    if (!playlistId) return <div>Loading...</div>; // Handle initial state

    return <PlaylistViewer playlistId={playlistId} />;
};

export default PlaylistPage;
