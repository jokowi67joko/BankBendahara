    try {
      const apiKey = "AIzaSyBJA-HpHbU3-egRvAdcYdzTB_Bf9-mnjA";
      const projectId = "bankbendahara";
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/akses/admin?key=${apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errDetail = await response.json();
        alert("Pesan error Google: " + (errDetail.error?.message || response.statusText));
        resetButton();
        return;
      }

      const doc = await response.json();
      const fields = doc.fields || {};
      const savedPassword = fields.password ? (fields.password.stringValue || "") : "";
      const role = fields.role ? (fields.role.stringValue || "user") : "user";

      if (savedPassword === inputKey) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userRole', role);
        sessionStorage.setItem('userId', 'admin');

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
      alert("Error script: " + error.message);
      resetButton();
    }
