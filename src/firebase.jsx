import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA29WJhLiNEAI3GVIE9HMMHCtTSD7IXXUk",
  authDomain: "budgetbuddy-e2782.firebaseapp.com",
  projectId: "budgetbuddy-e2782",
  storageBucket: "budgetbuddy-e2782.appspot.com",
  messagingSenderId: "894700914718",
  appId: "1:894700914718:web:a2fed57328864dd821460f",
  measurementId: "G-X1DNL23WJ5"
  
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };