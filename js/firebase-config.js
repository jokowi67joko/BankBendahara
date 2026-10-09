// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJA-HpHbU3-egRvAdcYdzTB_Bf9-mnjA",
  authDomain: "bankbendahara.firebaseapp.com",
  projectId: "bankbendahara",
  storageBucket: "bankbendahara.firebasestorage.app",
  messagingSenderId: "87938401504",
  appId: "1:87938401504:web:9da3e9ca0eaff16ad27c85"
};

// Inisialisasi Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Daftarkan 'db' ke objek global window agar dikenali oleh auth.js
window.db = firebase.firestore();
var db = window.db;
