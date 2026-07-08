import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

let adminDb: ReturnType<typeof getFirestore> | null = null;
let adminAuth: ReturnType<typeof getAuth> | null = null;

try {
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
    console.warn('Firebase Admin service account key not found at', serviceAccountPath);
  }
} catch (error) {
  console.error('Firebase Admin initialization error', error);
}

export { adminDb, adminAuth };
