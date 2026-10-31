// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDIabK7JjoArUid_z8C0VhLpayIESM9is",
  authDomain: "oiki-604c0.firebaseapp.com",
  projectId: "oiki-604c0",
  storageBucket: "oiki-604c0.firebasestorage.app",
  messagingSenderId: "661834461944",
  appId: "1:661834461944:web:995e2fc096005ecac7410d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
