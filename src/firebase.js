// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwtmwogAFAGgI7fPZZr6w51YOfrVWmzuE",
  authDomain: "onlineshop-b913b.firebaseapp.com",
  projectId: "onlineshop-b913b",
  storageBucket: "onlineshop-b913b.firebasestorage.app",
  messagingSenderId: "964911509840",
  appId: "1:964911509840:web:4c660c1694a7e8e12abc55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);