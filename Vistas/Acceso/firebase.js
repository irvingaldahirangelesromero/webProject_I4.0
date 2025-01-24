// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyC2Czv75mK-OVZkHsZkdNP4Wvpq85Ok_40",
  authDomain: "prueba4b-e8d4d.firebaseapp.com",
  projectId: "prueba4b-e8d4d",
  storageBucket: "prueba4b-e8d4d.firebasestorage.app",
  messagingSenderId: "459652214597",
  appId: "1:459652214597:web:673239b3de79929f42582c"
};
  
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
