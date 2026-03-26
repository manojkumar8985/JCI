import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace these placeholders with your actual Firebase project configuration
// You can find this in your Firebase Console -> Project Settings -> General -> Your apps -> SDK setup and configuration -> Firebase SDK snippet
const firebaseConfig = {
  apiKey: "AIzaSyDCf1IuLcJgk0wBxuFnpADZxgqlPiwKQZQ",
  authDomain: "inv-attendence.firebaseapp.com",
  projectId: "inv-attendence",
  storageBucket: "inv-attendence.firebasestorage.app",
  messagingSenderId: "633020779888",
  appId: "1:633020779888:web:780d38014769ebb11453b5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
