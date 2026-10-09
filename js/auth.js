document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const accessKeyInput = document.getElementById('accessKey');
  const errorMessage = document.getElementById('errorMessage');
  const btnSubmit = document.getElementById('btnSubmit');

  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputKey = accessKeyInput.value.trim();
    if (!inputKey) return;

    btnSubmit.disabled = true;
    btnSubmit.innerText = "Memverifikasi...";
    if (errorMessage) errorMessage.style.display = "none";

    try {
      // Cek dokumen di koleksi 'akses'
      const snapshot = await db.collection('akses')
        .where('password', '==', inputKey)
        .get();

      if (snapshot.empty) {
        alert("Access Key salah! Periksa kembali key kamu.");
        resetButton();
        return;
      }

      let userData = null;
      snapshot.forEach(doc => {
        userData = doc.data();
        userData.id = doc.id;
      });

      // Simpan status login
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('userRole', userData.role || 'user');
      sessionStorage.setItem('userId', userData.id);

      // Arahkan ke dashboard sesuai role
      if (userData.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'dashboard.html';
      }

    } catch (error) {
      console.error(error);
      alert("Error database: " + error.message);
      resetButton();
    }
  });

  function resetButton() {
    btnSubmit.disabled = false;
    btnSubmit.innerText = "Masuk Sekarang";
  }
});
