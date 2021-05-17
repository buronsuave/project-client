import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwRPiEJB3EXHWjE6iIMeCbLEDzOUVLkN8",
  authDomain: "pwa-for-ode.firebaseapp.com",
  projectId: "pwa-for-ode",
  storageBucket: "pwa-for-ode.appspot.com",
  messagingSenderId: "424033048220",
  appId: "1:424033048220:web:f42118098b497e46dbbf59",
  measurementId: "G-Z56L1232DR"
};

const app = firebase.initializeApp(firebaseConfig);
export default app;