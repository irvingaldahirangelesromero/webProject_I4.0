// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

  const firebaseConfig = {
  apiKey: "AIzaSyA1BVK0cBnicFymqgfFyRtnenN6Fop01qQ",
  authDomain: "tienda-444b0.firebaseapp.com",
  projectId: "tienda-444b0",
  storageBucket: "tienda-444b0.firebasestorage.app",
  messagingSenderId: "85178500578",
  appId: "1:85178500578:web:33ebea8ade67704ddea5bb"
  };
  
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
