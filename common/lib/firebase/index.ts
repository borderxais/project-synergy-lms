import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { firebaseConfig } from './config';

// Initialize Firebase only once
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error: any) {
  if (!/already exists/.test(error.message)) {
    console.error('Firebase initialization error', error.stack);
  }
}

export const db = getDatabase(app);