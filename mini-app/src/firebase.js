// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

   const firebaseConfig = {
  apiKey: "AIzaSyCRH4HOEDo9M2emvyLXIDrmkJQ_39Qekuo",
  authDomain: "tapswap-e9c29.firebaseapp.com",
  projectId: "tapswap-e9c29",
  storageBucket: "tapswap-e9c29.appspot.com",
  messagingSenderId: "802210819831",
  appId: "1:802210819831:web:e3ba2057cdf55d36cbedf2",
  measurementId: "G-W9MH7ZQK1N"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
