// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "quickmart-6fd3a.firebaseapp.com",
  projectId: "quickmart-6fd3a",
  storageBucket: "quickmart-6fd3a.appspot.com",
  messagingSenderId: "744692666568",
  appId: "1:744692666568:web:1efdbd43b0e1f9900a55fd"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);