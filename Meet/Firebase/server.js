const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const { getAuthURL, getTokens, oauth2Client } = require("./auth.js");
const authRouter = require("./Routes/auth.js");
const playlistRouter = require("./Routes/playlists.js");
const { admin, db } = require("./firebase.js");
// import pkg from'youtube-sr'
const youtube = require('youtube-sr').default;

  
const app = express();
// const {Youtube} = pkg;
app.use(express.json());
app.use(cors());
app.use('/', authRouter);
app.use('/', playlistRouter);

app.get('/fetchVideos/:category', async(req,res)=>{
  const {email} = req.body;
  const srcQuery = decodeURIComponent(req.params.category);
  // console.log(srcQuery)
  try {
    // const user = await admin.auth().getUserByEmail(email);
    // const userData = await db.collection("users").doc(user.uid).get();
    // const interests = userData.data().interests;
    // const srcQuery = interests.join(" OR ");
    console.log(srcQuery);
    const result = await youtube.search(srcQuery, {limit : 20})
    const videos = result.filter((item) => item.duration >= 120000) // Exclude videos shorter than 120 seconds
    .map((item) => ({
      videoId: item.id,
      title: item.title,
      thumbnail: item.thumbnail.url,
      channel: item.channel.name,
      url: item.url,
      views: item.views,
      uploadedAt: item.uploadedAt,
      duration: item.durationFormatted, 
    }));
    res.status(200).json({messgae : "Videos fetched successfully", videos})
  } catch (error) {
    res.status(400).json({error : error})
  }
})

app.get('/test', async (req,res)=>{
    const results = await youtube.getPlaylist("https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz", {fetchAll : true});
    res.send(results)
})
app.get('/getRelatedVideos', async (req, res) => {
  const { videoId } = req.body;
  
  if (!videoId) {
    return res.status(400).json({ error: "Video ID is required" });
  }

  try {
    // First, get the video details to extract relevant information
    const videoDetails = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,statistics',
        id: videoId,
        key : "AIzaSyBlwGcgF4mmb1bq7phB3N0z3_3RR2VxRY4"
      }
    });

  
    const videoInfo = videoDetails.data.items[0].snippet;
    const videoTags = videoInfo.tags || [];
    const videoTitle = videoInfo.title;
    const channelId = videoInfo.channelId;

    // Extract meaningful keywords from title and tags
    const keywords = [...new Set([
      ...videoTitle.split(' ').filter(word => word.length > 3),
      ...videoTags.slice(0, 3) // Take first 3 tags
    ])].join(' OR '); // Use OR operator
    
    // Use video title and tags to find related content
    const searchQuery = `${videoInfo.title} ${videoInfo.tags ? videoInfo.tags.join(' ') : ''}`;
    console.log(keywords)
    const relatedVideos = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: keywords,
        maxResults: 20,
        type: 'video',
        key : "AIzaSyBlwGcgF4mmb1bq7phB3N0z3_3RR2VxRY4",
        videoEmbeddable: true,
        
        // Exclude the current video from results
        // videoCategoryId: videoInfo.categoryId
      }
    });

    let allVideos = 
      relatedVideos.data.items
    .map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      description: item.snippet.description.slice(0, 100) + '...'
    }));

    // Remove duplicates
    // allVideos = Array.from(new Map(
    //   allVideos.map(video => [video.videoId, video])
    // ).values());

    // Shuffle the results for more randomness
    // allVideos = allVideos
    //   .sort(() => Math.random() - 0.5)
      


    res.status(200).json({
      message: "Related videos fetched successfully",
      allVideos
    });

  } catch (error) {
    console.error('Error fetching related videos:', error);
    res.status(400).json({
      error: "Failed to fetch related videos",
      details: error.message
    });
  }
});

app.get('/fetchCategorizedVideos', async (req, res) => {
  const { email } = req.query;
  console.log(email);

  try {
    const user = await admin.auth().getUserByEmail(email);
    const userData = await db.collection("users").doc(user.uid).get();
    const interests = userData.data().interests;

    if (!interests || interests.length === 0) {
      return res.status(400).json({ error: "User has no interests set" });
    }

    let categorizedVideos = {};

    for (const interest of interests) {
      try {
        const response = await youtube.search(interest, { limit: 20 });

        categorizedVideos[interest] = response
          .filter((item) => item.duration >= 120000) // Exclude videos shorter than 120 seconds
          .map((item) => ({
            videoId: item.id,
            title: item.title,
            thumbnail: item.thumbnail.url,
            channel: item.channel.name,
            url: item.url,
            views: item.views,
            uploadedAt: item.uploadedAt,
            duration: item.durationFormatted, // Include formatted duration
          }));

      } catch (error) {
        console.error(`Error fetching videos for ${interest}:`, error.message);
        categorizedVideos[interest] = [];
      }
    }

    res.status(200).json({ message: "Videos categorized successfully", categorizedVideos });

  } catch (error) {
    console.error("Error fetching user interests:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get('/getInterests', async (req, res)=>{
  try{
    const {email} = req.body;
    const user = await admin.auth().getUserByEmail(email);
    const userDoc = await db.collection("users").doc(user.uid).get();
    const userData = userDoc.data().interests
    res.status(200).json({message : "Interests fetched successfully", userData})
  }
  catch(err){
    res.status(400).json({error : "Something went wrong"});
  }
})

app.post('/save-notes/:videoId', async (req, res) => {
  try {
      const { notes, email } = req.body;
      const { videoId } = req.params;

      const user = await admin.auth().getUserByEmail(email);
      const userRef = db.collection("users").doc(user.uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
          return res.status(404).json({ error: "User not found" });
      }

      
      const existingNotes = userDoc.data().notes || {};

      
      existingNotes[videoId] = notes;

      
      const updatedUser = await userRef.update({ notes: existingNotes });

      res.status(200).json({ message: "Notes saved successfully", updatedUser });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.get('/auth', (req,res)=>{
  const url = getAuthURL();
  res.redirect(url)
})

app.get('/auth/callback', async(req,res)=>{
  const {code} = req.body;
  console.log(code)
  try{
    const tokens = await getTokens(code);
    console.log(tokens)
    oauth2Client.setCredentials(tokens);
    res.json(tokens)
  } catch(err){

  }
})

// app.post('/create-playlist', async (req,res)=>{
//   const {title, description} = req.body.snippet;

//   const {privacyStatus} = req.body.status;
//   const response = await axios.post('https://www.googleapis.com/youtube/v3/playlists?part=snippet,status', {
//     snippet : {title, description},
//     status : {privacyStatus},
//   },
// {
//   headers : {
//     Authorization : `Bearer ${oauth2Client.credentials.access_token}`
//   }
// })

// res.json({message : "Playlist created successfully", data: response.data})
// })



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
