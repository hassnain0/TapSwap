// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVhK4SDn9II6rvTwrDR6ey84M5EGuogDk",
  authDomain: "updatedtapswap.firebaseapp.com",
  projectId: "updatedtapswap",
  storageBucket: "updatedtapswap.appspot.com",
  messagingSenderId: "411506741973",
  appId: "1:411506741973:web:2a81216525a16feeb9c85c",
  measurementId: "G-CZJCM17NM1"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export { db };
