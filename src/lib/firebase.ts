import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCZiCjUpaBs2NlNmZDInAR9jXeZaxmdX98",
  authDomain: "kandyan-queen-salon.firebaseapp.com",
  projectId: "kandyan-queen-salon",
  storageBucket: "kandyan-queen-salon.firebasestorage.app",
  messagingSenderId: "1028229150997",
  appId: "1:1028229150997:web:bc1835575edef3b738911c",
  measurementId: "G-PCWWMSZ0RY"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

let analytics;
if (typeof window !== "undefined") {
  isSupported().then((yes) => yes && (analytics = getAnalytics(app)));
}

export { app, analytics, db, auth, storage };
