// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDXaV09pWVqtc8zG0955G1xDQ_5nHfSdgA",
    authDomain: "tapapp-8dfcb.firebaseapp.com",
    projectId: "tapapp-8dfcb",
    storageBucket: "tapapp-8dfcb.appspot.com",
    messagingSenderId: "1081304071358",
    appId: "1:1081304071358:web:4e3fc4924a953a74a932ef",
    measurementId: "G-44WKZ2ERM8"
  };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export { db };
