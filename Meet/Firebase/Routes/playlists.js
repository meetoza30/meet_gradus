const express = require("express");
const { admin, db } = require("../firebase.js");

const playlistRouter = express.Router();

playlistRouter.post('/create-playlist', async(req,res)=>{
try{    
  const {videoIds, playlistName, uid} = req.body;
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    const existingPlaylistIds = userDoc.data().playlists;
    console.log(existingPlaylistIds)
    const existingPlaylists = await Promise.all(
      existingPlaylistIds.map(async (id) => {
        const docRef = db.collection("playlists").doc(id);
        const docSnap = await docRef.get();
        return docSnap.exists ? docSnap.data() : null;
      })
    );
    
    const isPlaylistExists = existingPlaylists.some(
      (playlist) => playlist && playlist.playlistName === playlistName
    );
    
    if (isPlaylistExists) {
      throw new Error("Playlist name already exists");
    }
    const newPlaylistRef = db.collection("playlists").doc();
    const playlistInfo = {
          playlistId : newPlaylistRef.id,
          uid,
          playlistName,
          videoIds : videoIds || [],
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        }
        
        const newplaylist = await newPlaylistRef.set(playlistInfo);
        await userRef.update({
            playlists: admin.firestore.FieldValue.arrayUnion(newPlaylistRef.id),
          });

        res.json({message : "Created successfully", newplaylist})
      }
        catch(error){
          res.json({error : error.message})
        }
})

playlistRouter.get('/get-playlists', async(req,res)=>{
  const {uid} = req.body;
  const userRef = db.collection("users").doc(uid);
  const userDoc = await userRef.get()
  const playlistIds = userDoc.data().playlists;

  const playlistRefs = playlistIds.map(id => db.collection("playlists").doc(id))
  const playlistDocs = await Promise.all(playlistRefs.map(ref => ref.get()))
  const userPlaylists = playlistDocs.map(doc => ({id : doc.id, ...doc.data()}))
  res.json({userPlaylists})
})

playlistRouter.post('/insertVideo/:playlistId', async(req,res)=>{
   try{
     const {videoId} = req.body;
    const {playlistId} = req.params;

    const playlistRef = db.collection("playlists").doc(playlistId);
    

    await playlistRef.update({
      videoIds: admin.firestore.FieldValue.arrayUnion(videoId)
  });
  const playlistDoc = await playlistRef.get();
  res.json({message : "Video added successfully", playlistDoc})
}catch(error){
  res.json({error : error.message})
}
    
})

module.exports = playlistRouter;
