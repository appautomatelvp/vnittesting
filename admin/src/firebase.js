// ============================================================
// FILE: src/firebase.js
// Cấu hình Firebase - Thay thế các giá trị bên dưới bằng
// thông tin Firebase project của bạn (lấy từ Firebase Console)
// ============================================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyACw62O9MOxdssL08Vbe0bp36pXGIdK_v8",
  authDomain: "freelacer-web1-5a188.firebaseapp.com",
  projectId: "freelacer-web1-5a188",
  storageBucket: "freelacer-web1-5a188.firebasestorage.app",
  messagingSenderId: "613305277804",
  appId: "1:613305277804:web:6d80f1e2d8111317292749"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
