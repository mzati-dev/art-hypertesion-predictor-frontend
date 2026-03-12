import { cert, getApps, initializeApp, App, getApp } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

// Verify all required environment variables exist
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 
    !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || 
    !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
  throw new Error('Missing Firebase Admin configuration in environment variables');
}

// Format the private key by replacing escaped newlines
const formattedPrivateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n');

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: formattedPrivateKey
};

// Initialize Firebase Admin app
const adminApp: App = getApps().length === 0 
  ? initializeApp({
      credential: cert(serviceAccount)
    })
  : getApp();

// Get Auth instance
const adminAuth: Auth = getAuth(adminApp);

export { adminApp, adminAuth };
export default adminApp;