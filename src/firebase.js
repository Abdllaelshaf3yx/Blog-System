import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAokUjsda43f5GfsSp7gnkLXGDrLArz2NM",
  authDomain: "blog-system-36714.firebaseapp.com",
  projectId: "blog-system-36714",
  storageBucket: "blog-system-36714.firebasestorage.app",
  messagingSenderId: "381496251277",
  appId: "1:381496251277:web:902c2143e64217226ca3c4",
  measurementId: "G-YQ256PW6VX",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
