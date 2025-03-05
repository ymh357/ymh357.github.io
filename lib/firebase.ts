import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyCocbt-dsvoMg5xAwy0f8rv_OA3_D_mNWc",
  authDomain: "e-invitation-89a39.firebaseapp.com",
  databaseURL: "https://e-invitation-89a39-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "e-invitation-89a39",
  storageBucket: "e-invitation-89a39.firebasestorage.app",
  messagingSenderId: "1005490214754",
  appId: "1:1005490214754:web:b3c49949305a367d8fbe3b",
  measurementId: "G-DJZWCQMJSE",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Realtime Database
export const db = getDatabase(app)

// Initialize Analytics
export const initAnalytics = () => {
  if (typeof window !== "undefined") {
    return getAnalytics(app)
  }
  return null
}

export default app

