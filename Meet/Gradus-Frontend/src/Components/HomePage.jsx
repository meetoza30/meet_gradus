import React from "react";
import Navbar from "./Navbar";
import VideoPage from "./VideoPage";

const HomePage = ()=>{
    return(
        <div className="flex flex-col">
            <Navbar />
            <VideoPage />
        </div>
    )
}

export default HomePage;