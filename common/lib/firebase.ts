import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyB0QYf58txE9VQhcxDlmq2qGa_kuoqg-5I",
  authDomain: "privschool-d978c.firebaseapp.com",
  projectId: "privschool-d978c",
  storageBucket: "privschool-d978c.firebasestorage.app",
  messagingSenderId: "783560306322",
  appId: "1:783560306322:web:2c191807bef972963f404b",
  measurementId: "G-7244YXYSMC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Add scopes for Google OAuth
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

// Always prompt for account selection
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Set persistence to LOCAL
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

export { auth, db, googleProvider, analytics };
