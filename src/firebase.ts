import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, persistentLocalCache, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "gen-lang-client-0026738913",
  appId: "1:754215628217:web:47d4475d54b59680d2da68",
  apiKey: "AIzaSyDGtBV6Uaz5ByXnVaBQImu3QKuJozh1NNI",
  authDomain: "gen-lang-client-0026738913.firebaseapp.com",
  storageBucket: "gen-lang-client-0026738913.firebasestorage.app",
  messagingSenderId: "754215628217",
  measurementId: "",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with offline persistence and specific database ID
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache()
}, "ai-studio-pokescanai-a31d3d7c-8816-4e3a-ae16-15c787a4f162");

