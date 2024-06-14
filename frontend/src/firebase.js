// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-fac78.firebaseapp.com",
  projectId: "mern-auth-fac78",
  storageBucket: "mern-auth-fac78.appspot.com",
  messagingSenderId: "520068939964",
  appId: "1:520068939964:web:b14c30ebc2f701f016d0b9",
  measurementId: "G-M0JLDZY3D1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
