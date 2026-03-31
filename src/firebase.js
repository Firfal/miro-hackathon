import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCmvtnBsU3Xbiz7fNx7ozmE_HkIN6bGVn0",
  authDomain: "mindly-miro-hack.firebaseapp.com",
  projectId: "mindly-miro-hack",
  storageBucket: "mindly-miro-hack.firebasestorage.app",
  messagingSenderId: "242474925834",
  appId: "1:242474925834:web:845af811d78a182a6a04f3",
  measurementId: "G-NK7L6KFZW1",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
