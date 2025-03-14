const express = require("express");
const { admin, db } = require("../firebase.js");

const authRouter = express.Router();


authRouter.post('/signup', async(req,res)=>{
    const { name, email, password, interests } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
      interests
    });

    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      email,
      interests,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: "User created successfully", user: userRecord });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})

authRouter.post('/login', async(req,res)=>{
    const { email, password } = req.body;

    try {
      const user = await admin.auth().getUserByEmail(email);
      res.status(200).json({ message: "User exists", user });
    } catch (error) {
      res.status(400).json({ error: "Invalid credentials" });
    }
})

module.exports = authRouter;
