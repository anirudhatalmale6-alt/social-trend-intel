// lib/firebase.ts
"use client";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAHfdmPUfi5ioBXXRqWstPZvYOxp9nQODU",
  authDomain: "trend-arb-108e2.firebaseapp.com",
  projectId: "trend-arb-108e2",
  storageBucket: "trend-arb-108e2.firebasestorage.app",
  messagingSenderId: "550609632443",
  appId: "1:550609632443:web:2fea7d1f3a1f264b07bd9e",
  measurementId: "G-1DZ24ZGVG9",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
