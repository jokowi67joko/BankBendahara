import { auth, db } from './firebase-config.js';
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc, runTransaction, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.getElementById('btn-logout').addEventListener('click', () => signOut(auth));

const memberList = document.getElementById('admin-member-list');
const saldoEl = document.getElementById('total-saldo');
const NOMINAL_KAS = 2000;

// Utility untuk mengambil ID minggu saat ini (contoh: "2026-W41")
function getCurrentWeekId() {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    const weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    return d.getUTCFullYear() + '-W' + weekNo;
}

// 1. Real-time Listener Saldo
onSnapshot(doc(db, "kas", "saldo"), (docSnap) => {
    if (docSnap.exists()) {
        const saldo = docSnap.data().nominal;
        saldoEl.textContent = `Rp ${saldo.toLocaleString('id-ID')}`;
    }
});

// 2. Real-time Listener Anggota
onSnapshot(collection(db, "anggota"), (snapshot) => {
    memberList.innerHTML = '';
    const currentWeek = getCurrentWeekId();
    
    snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const id = docSnap.id;
        const isPaidThisWeek = data.minggu_ke_terakhir === currentWeek;

        const div = document.createElement('div');
        div.className = 'member-card';
        div.innerHTML = `
            <div>
                <strong>${data.nama}</strong><br>
                <span class="badge ${isPaidThisWeek ? 'lunas' : 'belum'}">${isPaidThisWeek ? 'Lunas' : 'Belum Bayar'}</span>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <label>
                    <input type="checkbox" ${isPaidThisWeek ? 'checked disabled' : ''} onchange="bayarKas('${id}', '${data.nama}')"> Bayar
                </label>
                <button class="danger" style="padding: 4px 8px; font-size: 12px;" onclick="hapusAnggota('${id}')">Hapus</button>
            </div>
        `;
        memberList.appendChild(div);
    });
});

// 3. Tambah Anggota
document.getElementById('add-member-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nama = document.getElementById('member-name').value;
    await addDoc(collection(db, "anggota"), {
        nama: nama,
        minggu_ke_terakhir: "",
    });
    document.getElementById('member-name').value = '';
});

// 4. Logika Bayar Kas (Ter-ekspos ke global window agar bisa dipanggil inline HTML)
window.bayarKas = async (id, nama) => {
    const currentWeek = getCurrentWeekId();
    try {
        await runTransaction(db, async (transaction) => {
            const saldoRef = doc(db, "kas", "saldo");
            const memberRef = doc(db, "anggota", id);
            
            const saldoDoc = await transaction.get(saldoRef);
            let saldoBaru = NOMINAL_KAS;
            if (saldoDoc.exists()) {
                saldoBaru = saldoDoc.data().nominal + NOMINAL_KAS;
            }

            // Update Saldo
            transaction.set(saldoRef, { nominal: saldoBaru }, { merge: true });
            
            // Update Status Anggota
            transaction.update(memberRef, { minggu_ke_terakhir: currentWeek });
            
            // Catat ke Log
            const logRef = doc(collection(db, "kas/log/riwayat")); 
            transaction.set(logRef, {
                nama: nama,
                nominal: NOMINAL_KAS,
                minggu_ke: currentWeek,
                timestamp: serverTimestamp()
            });
        });
    } catch (e) {
        console.error("Gagal bayar kas: ", e);
        alert("Gagal memproses pembayaran. Cek koneksi.");
    }
};

window.hapusAnggota = async (id) => {
    if(confirm("Yakin ingin menghapus anggota ini?")) {
        await deleteDoc(doc(db, "anggota", id));
    }
}
