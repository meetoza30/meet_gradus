// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFKBklkmaFcSoyjRUXxMMwyZutg5egppM",
  authDomain: "practice-e1140.firebaseapp.com",
  projectId: "practice-e1140",
  storageBucket: "practice-e1140.firebasestorage.app",
  messagingSenderId: "1017273854064",
  appId: "1:1017273854064:web:1e297bb2eb99d03dedacb5",
  measurementId: "G-B9GTGTQJNQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);