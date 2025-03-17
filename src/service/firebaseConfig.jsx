// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDMwKpsVyQYfZgYpRa7Gdzih8UVhti-qkM",
  authDomain: "ai-trip-planner-ba8ad.firebaseapp.com",
  projectId: "ai-trip-planner-ba8ad",
  storageBucket: "ai-trip-planner-ba8ad.firebasestorage.app",
  messagingSenderId: "318284010711",
  appId: "1:318284010711:web:d9a5c3790908c3978b4c92"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);