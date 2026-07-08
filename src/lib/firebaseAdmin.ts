import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

let adminDb: ReturnType<typeof getFirestore> | null = null;
let adminAuth: ReturnType<typeof getAuth> | null = null;

try {
  // First, check if we have Environment Variables (for Vercel Production)
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    if (getApps().length === 0) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Replace escaped newlines with actual newlines
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    }
    adminDb = getFirestore();
    adminAuth = getAuth();
  } 
  // Fallback to local serviceAccountKey.json for development
  else {
    const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      if (getApps().length === 0) {
        initializeApp({
          credential: cert(serviceAccount)
        });
      }
      adminDb = getFirestore();
      adminAuth = getAuth();
    } else {
      console.warn('Firebase Admin credentials not found in env vars or local file.');
    }
  }
} catch (error) {
  console.error('Firebase Admin initialization error', error);
}

export { adminDb, adminAuth };
