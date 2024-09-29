// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcecVlO7suZtUNriMyeVeRJOIIujtN-PM",
  authDomain: "krypto-airdrop.firebaseapp.com",
  projectId: "krypto-airdrop",
  storageBucket: "krypto-airdrop.appspot.com",
  messagingSenderId: "449309363525",
  appId: "1:449309363523:web:483fbe3625f02ccfd1022c",
  measurementId: "G-06MPVBBC8M"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export { db };
