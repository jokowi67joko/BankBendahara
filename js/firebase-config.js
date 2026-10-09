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

// Inisialisasi Firestore dengan force long-polling agar tidak terputus di jaringan seluler/browser HP
const firestoreDb = firebase.firestore();
firestoreDb.settings({
  experimentalForceOwningTab: true,
  experimentalLongPolling: true,
  merge: true
});

window.db = firestoreDb;
var db = window.db;
