document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const accessKeyInput = document.getElementById('accessKey');
  const btnSubmit = document.getElementById('btnSubmit');

  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputKey = accessKeyInput.value.trim();
    if (!inputKey) return;

    btnSubmit.disabled = true;
    btnSubmit.innerText = "Memverifikasi...";

    try {
      // Ambil dokumen 'admin' langsung via Firestore REST API (Anti-Offline)
      const projectId = "bankbendahara";
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/akses/admin`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Gagal menghubungi server (${response.status})`);
      }

      const doc = await response.json();

      // Ekstrak data field dari REST API format
      const fields = doc.fields || {};
      const savedPassword = fields.password ? (fields.password.stringValue || "") : "";
      const role = fields.role ? (fields.role.stringValue || "user") : "user";

      if (savedPassword === inputKey) {
        // Simpan sesi
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userRole', role);
        sessionStorage.setItem('userId', 'admin');

        // Redirect sesuai role
        if (role === 'admin') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'dashboard.html';
        }
      } else {
        alert("Access Key salah! Periksa kembali key kamu.");
        resetButton();
      }

    } catch (error) {
      console.error(error);
      alert("Error login: " + error.message);
      resetButton();
    }
  });

  function resetButton() {
    btnSubmit.disabled = false;
    btnSubmit.innerText = "Masuk Sekarang";
  }
});
