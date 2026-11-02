// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZNTWFuos0Wnf8atpFLVVQzeiJrOMQ4T4",
  authDomain: "bivasstyle.firebaseapp.com",
  projectId: "bivasstyle",
  storageBucket: "bivasstyle.firebasestorage.app",
  messagingSenderId: "678618365025",
  appId: "1:678618365025:web:85d52351c9268134e9be20",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
