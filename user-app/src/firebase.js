import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVuSCp_CkfSaQDRHUjiTyP4tLDBCgUdGA",
  authDomain: "project-8c1ebe5f-7391-452c-814.firebaseapp.com",
  projectId: "project-8c1ebe5f-7391-452c-814",
  storageBucket: "project-8c1ebe5f-7391-452c-814.firebasestorage.app",
  messagingSenderId: "877559542260",
  appId: "1:877559542260:web:ea4c97fb861467ec8809a1",
  measurementId: "G-WYD6KL1SGN"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
