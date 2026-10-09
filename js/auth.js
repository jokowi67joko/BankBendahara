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

        // Tampilkan status loading
        btnSubmit.disabled = true;
        btnSubmit.innerText = "Memverifikasi...";
        errorMessage.style.display = "none";

        try {
            // Mencari dokumen di koleksi 'akses' yang password-nya cocok
            const snapshot = await db.collection('akses')
                .where('password', '==', inputKey)
                .get();

            if (snapshot.empty) {
                // Jika tidak ada key yang cocok
                showError("Access Key salah! Periksa kembali key kamu.");
                resetButton();
                return;
            }

            // Ambil data user yang cocok
            let userData = null;
            snapshot.forEach(doc => {
                userData = doc.data();
                userData.id = doc.id;
            });

            // Simpan info session ke LocalStorage
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userRole', userData.role || 'user');
            sessionStorage.setItem('userId', userData.id);

            // Arahkan halaman sesuai role
            if (userData.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'dashboard.html';
            }

        } catch (error) {
            console.error("Login error:", error);
            showError("Terjadi gangguan koneksi atau database.");
            resetButton();
        }
    });

    function showError(msg) {
        errorMessage.innerText = msg;
        errorMessage.style.display = "block";
    }

    function resetButton() {
        btnSubmit.disabled = false;
        btnSubmit.innerText = "Masuk Sekarang";
    }
});
h === "";

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
