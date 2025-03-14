// import admin from "firebase-admin";
const admin = require('firebase-admin')
const {getAuth} = require('firebase/auth')
const {getFirestore} = require('firebase/firestore')

// import serviceAccount from "./practice-e1140-firebase-adminsdk-fbsvc-e252b646db.json" assert { type: "json" };
const serviceAccount = require('./practice-e1140-firebase-adminsdk-fbsvc-e252b646db.json')

const firebaseConfig = {
  apiKey: "AIzaSyByHlcafaGGi9y4Oc5WvWPC4Yc-ZTh-IZ0",
  authDomain: "gradus-26a77.firebaseapp.com",
  projectId: "gradus-26a77",
  storageBucket: "gradus-26a77.appspot.com", // Fixed this
  messagingSenderId: "818433218009",
  appId: "1:818433218009:web:0dd0cfc85b484bfc7f75c8",
  measurementId: "G-C3R3JBHL1P"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
module.exports = { admin, db };
