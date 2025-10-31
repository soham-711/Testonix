// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiFRKczmUnUYtALsITeUkxbMHpFoHC7Ks",
  authDomain: "testonix.firebaseapp.com",
  projectId: "testonix",
  storageBucket: "testonix.firebasestorage.app",
  messagingSenderId: "318463893985",
  appId: "1:318463893985:web:8dd3be7388333ec1e272a0",
  measurementId: "G-VD3MKBDB46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);

