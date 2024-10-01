import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyARl4RSDX3baF3FCTV8wNPBosWx1dOacKI",
  authDomain: "fir-login-42577.firebaseapp.com",
  projectId: "fir-login-42577",
  storageBucket: "fir-login-42577.appspot.com",
  messagingSenderId: "284133890673",
  appId: "1:284133890673:web:e240027d545e6d43e2d9d0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };