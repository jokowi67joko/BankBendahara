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
      // 1. Coba cek langsung dokumen 'admin' di koleksi 'akses'
      const adminDoc = await db.collection('akses').doc('admin').get();
      
      let matchedData = null;

      if (adminDoc.exists && adminDoc.data().password === inputKey) {
        matchedData = adminDoc.data();
        matchedData.id = adminDoc.id;
      } else {
        // 2. Jika bukan admin, cari di seluruh dokumen dalam koleksi 'akses'
        const snapshot = await db.collection('akses')
          .where('password', '==', inputKey)
          .get();

        if (!snapshot.empty) {
          snapshot.forEach(doc => {
            matchedData = doc.data();
            matchedData.id = doc.id;
          });
        }
      }

      if (!matchedData) {
        alert("Access Key salah! Periksa kembali key kamu.");
        resetButton();
        return;
      }

      // Simpan session
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('userRole', matchedData.role || 'user');
      sessionStorage.setItem('userId', matchedData.id);

      // Pengalihan halaman
      if (matchedData.role === 'admin') {
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
