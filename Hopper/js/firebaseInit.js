// Firebase, Auth, Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp({
  apiKey: "AIzaSyDCAIu3eklNJYW9Xr-KkOqfLMkoyVsNX24",
  authDomain: "hopper-web.firebaseapp.com",
  projectId: "hopper-web",
  storageBucket: "hopper-web.firebasestorage.app",
  messagingSenderId: "226671750148",
  appId: "1:226671750148:web:0bd671153ae0679ba55951",
});

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
