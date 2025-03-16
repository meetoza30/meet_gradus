import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyByHlcafaGGi9y4Oc5WvWPC4Yc-ZTh-IZ0",
  authDomain: "gradus-26a77.firebaseapp.com",
  projectId: "gradus-26a77",
  storageBucket: "gradus-26a77.appspot.com",
  messagingSenderId: "818433218009",
  appId: "1:818433218009:web:0dd0cfc85b484bfc7f75c8",
  measurementId: "G-C3R3JBHL1P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); 
export const db = getFirestore(app);
export default app;