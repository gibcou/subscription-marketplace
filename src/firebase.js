// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyEg9sYVhQgmGsLaHSDT3bhnyDO-Q-rLk",
  authDomain: "sub-website.firebaseapp.com",
  projectId: "sub-website",
  storageBucket: "sub-website.firebasestorage.app",
  messagingSenderId: "572069246094",
  appId: "1:572069246094:web:3fafb3b746cbc31846c5df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;