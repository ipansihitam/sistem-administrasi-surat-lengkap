
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "dbdesakrakitan-300",
  appId: "1:694506794200:web:7d19717bc8f0df04f27bad",
  storageBucket: "dbdesakrakitan-300.appspot.com",
  apiKey: "AIzaSyB7QNpf3ILLMiuJwX7hmVZEbqg3414-fe4",
  authDomain: "dbdesakrakitan-300.firebaseapp.com",
  messagingSenderId: "694506794200",
  measurementId: "G-ER2L5X33M1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
