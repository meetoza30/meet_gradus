import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import HomeVideoCard from "./HomeVideoCard";

const CategoryVideos = ()=>{
    const {category} = useParams();
    console.log(category)
    const [videos, setVideos] = useState()
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        const fetchVideos = async ()=>{
            try{
                const response = await axios.get(`http://localhost:5000/fetchVideos/${category}`);
                
                // console.log(response.data.videos)
                setVideos(response?.data?.videos)
            }catch(error){
                console.error(error)
            }
        }

        fetchVideos()
        // console.log(videos)
        
    }, [])

    useEffect(() => {
        setTimeout(()=>{
            setLoading(false)
        }, 6000)
        console.log("Updated Videos:", videos);
      }, [videos]);

    return(
        <>
        {loading && <div>Loading...</div>}
        {!loading && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 p-4">
        {videos.map((video) => (
          <HomeVideoCard key={video.videoId} video = {video} />
        ))}
      </div>}
      </>
)
}

export default CategoryVideos;