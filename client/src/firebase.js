// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-90f00.firebaseapp.com",
  projectId: "real-estate-90f00",
  storageBucket: "real-estate-90f00.appspot.com",
  messagingSenderId: "251048213492",
  appId: "1:251048213492:web:9a8bf238135a46bab457a1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);



// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
  
//   authDomain: "carmanagement-1ee84.firebaseapp.com",
//   projectId: "carmanagement-1ee84",
//   storageBucket: "carmanagement-1ee84.firebasestorage.app",
//   messagingSenderId: "578748167695",
//   appId: "1:578748167695:web:1425c276f94e63776cd57a",
//   measurementId: "G-T0B6JWSX4T"
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);
