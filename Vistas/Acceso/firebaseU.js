import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC2Czv75mK-OVZkHsZkdNP4Wvpq85Ok_40",
  authDomain: "prueba4b-e8d4d.firebaseapp.com",
  projectId: "prueba4b-e8d4d",
  storageBucket: "prueba4b-e8d4d.firebasestorage.app",
  messagingSenderId: "459652214597",
  appId: "1:459652214597:web:673239b3de79929f42582c",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore();

export const saveUser = (name, email, phone, question, answer, role) =>
  addDoc(collection(db, "users"), { name, email, phone, question, answer, role});

export const onGetUsers = (callback) =>
  onSnapshot(collection(db, "users"), callback);

export const deleteUser = (id) => deleteDoc(doc(db, "users", id));

export const getUser = (id) => getDoc(doc(db, "users", id));

export const updateUser = (id, newFields) =>
  updateDoc(doc(db, "users", id), newFields);
