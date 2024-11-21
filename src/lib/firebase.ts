import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD3j_5OJpU86sc29K48cWUkOdya_Be-K20",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "myzoom-121.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "myzoom-121",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "myzoom-121.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "396659738141",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:396659738141:web:21b37f8cb265a8b1e4a8f4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
try {
  enableIndexedDbPersistence(db);
} catch (err) {
  console.warn('Firebase persistence failed to enable:', err);
}