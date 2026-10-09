import { auth } from "./firebase-config.js";
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const loginForm = document.getElementById("login-form");
const errorMsg = document.getElementById("error-msg");
const btnSubmit = document.getElementById("btn-submit");
const btnText = btnSubmit?.querySelector(".btn-text");

// 1. Tangani Submit Form Tanpa Reload
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Mencegah reload browser

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!email || !password) {
      errorMsg.textContent = "Email dan password wajib diisi!";
      return;
    }

    // Set Loading state
    errorMsg.textContent = "";
    btnSubmit.disabled = true;
    if (btnText) btnText.textContent = "Memproses...";

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Sukses login -> onAuthStateChanged di bawah akan menangani redirect otomatis
    } catch (error) {
      console.error("Firebase Login Error:", error.code, error.message);

      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMsg.textContent = "Email atau Password/Admin Key salah!";
      } else if (error.code === "auth/invalid-email") {
        errorMsg.textContent = "Format email tidak valid!";
      } else if (error.code === "auth/network-request-failed") {
        errorMsg.textContent = "Koneksi internet bermasalah. Coba lagi.";
      } else {
        errorMsg.textContent = "Gagal masuk: " + error.message;
      }

      // Reset state tombol jika gagal
      btnSubmit.disabled = false;
      if (btnText) btnText.textContent = "Masuk Sekarang";
    }
  });
}

// 2. Pemantau Status Autentikasi & Routing Halaman
onAuthStateChanged(auth, async (user) => {
  const currentPath = window.location.pathname;
  const isLoginPage = currentPath.endsWith("index.html") || currentPath.endsWith("/") || currentPath === "";

  if (user) {
    if (isLoginPage) {
      try {
        const idTokenResult = await user.getIdTokenResult();
        const isAdmin = !!idTokenResult.claims.admin;

        // Arahkan ke dashboard atau admin
        if (isAdmin) {
          window.location.replace("admin.html");
        } else {
          window.location.replace("dashboard.html");
        }
      } catch (err) {
        // Fallback jika klaim gagal dicek
        window.location.replace("dashboard.html");
      }
    }
  } else {
    // Jika tidak sedang login dan mencoba buka dashboard/admin
    if (!isLoginPage) {
      window.location.replace("index.html");
    }
  }
});
