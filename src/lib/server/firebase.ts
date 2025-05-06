// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAkIl787gjWIioG_mVdV6eD-r4CIMdRIw",
  authDomain: "mental-health-work.firebaseapp.com",
  projectId: "mental-health-work",
  storageBucket: "mental-health-work.firebasestorage.app",
  messagingSenderId: "991006276312",
  appId: "1:991006276312:web:10327127e98acdc63af5ad",
  measurementId: "G-VSELE52BMB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
