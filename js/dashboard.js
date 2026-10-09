import { auth, db } from './firebase-config.js';
import { collection, onSnapshot, doc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.getElementById('btn-logout').addEventListener('click', () => signOut(auth));

const memberList = document.getElementById('member-list');
const saldoEl = document.getElementById('total-saldo');
const logList = document.getElementById('log-list');

function getCurrentWeekId() {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    const weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    return d.getUTCFullYear() + '-W' + weekNo;
}

// Read-only Realtime Saldo
onSnapshot(doc(db, "kas", "saldo"), (docSnap) => {
    if (docSnap.exists()) {
        saldoEl.textContent = `Rp ${docSnap.data().nominal.toLocaleString('id-ID')}`;
    }
});

// Read-only Realtime Anggota
onSnapshot(collection(db, "anggota"), (snapshot) => {
    memberList.innerHTML = '';
    const currentWeek = getCurrentWeekId();
    
    snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const isPaidThisWeek = data.minggu_ke_terakhir === currentWeek;

        const div = document.createElement('div');
        div.className = 'member-card';
        div.innerHTML = `
            <strong>${data.nama}</strong>
            <span class="badge ${isPaidThisWeek ? 'lunas' : 'belum'}">${isPaidThisWeek ? 'Lunas' : 'Belum Bayar'}</span>
        `;
        memberList.appendChild(div);
    });
});

// Fetch Berita Publik (Free API CNN Indonesia / Antara News)
async function fetchNews() {
    const container = document.getElementById('news-container');
    try {
        const res = await fetch('https://api-berita-indonesia.vercel.app/cnn/terbaru');
        const data = await res.json();
        const articles = data.data.posts.slice(0, 5); // Ambil 5 berita terbaru
        
        articles.forEach(item => {
            const div = document.createElement('div');
            div.className = 'news-item';
            div.innerHTML = `
                <img src="${item.thumbnail}" alt="Thumbnail">
                <div class="news-item-content">
                    <strong><a href="${item.link}" target="_blank" style="color: var(--text-main); text-decoration: none;">${item.title}</a></strong>
                </div>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        container.innerHTML = "<p>Gagal memuat berita terkini.</p>";
    }
}
fetchNews();
