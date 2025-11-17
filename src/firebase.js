// src/firebase.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCl9SGSkEJOmP9N50aPyGE95Oh-YlPJu80",
  authDomain: "simpro-se-central.firebaseapp.com",
  projectId: "simpro-se-central",
  storageBucket: "simpro-se-central.firebasestorage.app",
  messagingSenderId: "59110524658",
  appId: "1:59110524658:web:72dcaa1dfddb004134f26b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Set up auth variables
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


// Export the auth functions and objects we'll need in our app
export { auth, provider, signInWithPopup, signOut, onAuthStateChanged };