document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MOBILE MENU TOGGLE ---
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // --- 2. SETTINGS PANEL & DARK MODE ---
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    if(settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsPanel.classList.toggle('active');
            const settingsIcon = settingsBtn.querySelector('i');
            settingsIcon.style.transform = settingsPanel.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
        });
    }

    document.addEventListener('click', (e) => {
        if (settingsPanel && settingsBtn && !settingsBtn.contains(e.target) && !settingsPanel.contains(e.target)) {
            settingsPanel.classList.remove('active');
            if(settingsBtn.querySelector('i')) settingsBtn.querySelector('i').style.transform = 'rotate(0deg)';
        }
    });

    const icon = themeToggle ? themeToggle.querySelector('i') : null;
    if(localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        if(icon) {
            icon.classList.replace('fa-moon', 'fa-sun');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Mode Terang';
        }
    }

    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                if(icon) icon.classList.replace('fa-moon', 'fa-sun');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i> Mode Terang';
                localStorage.setItem('theme', 'dark');
            } else {
                if(icon) icon.classList.replace('fa-sun', 'fa-moon');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i> Mode Gelap';
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // --- 3. WHATSAPP FORM LOGIC ---
    const waForm = document.getElementById('waForm');
    if(waForm) {
        waForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('waName').value;
            const type = document.getElementById('waType').value;
            const damage = document.getElementById('waDamage').value;
            const message = document.getElementById('waMessage').value;

            if (!name || !message) {
                alert("Harap lengkapi Nama dan Detail Keluhan.");
                return;
            }

            const text = `Halo Admin RR SERVICE, saya ingin booking service.%0A%0A` +
                         `👤 *Nama:* ${name}%0A` +
                         `📱 *Tipe HP:* ${type}%0A` +
                         `🔧 *Kerusakan:* ${damage}%0A` +
                         `📝 *Keluhan:* ${message}`;

            const url = `https://wa.me/6281379689393?text=${text}`;
            window.open(url, '_blank');
        });
    }

    // --- 4. FAQ ACCORDION LOGIC ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    // --- 5. MODAL CEK STATUS (UPDATE: SHOW NAME & CACHE BUSTING) ---
    const modal = document.getElementById("statusModal");
    const btnNav = document.getElementById("btnCheckStatusNav");
    const btnHero = document.getElementById("btnCheckStatusHero");
    const spanClose = document.querySelector(".close-modal");
    const btnSearch = document.getElementById("btnSearchInvoice");
    const inputInvoice = document.getElementById("invoiceInput");
    const resultDiv = document.getElementById("statusResult");

    // ⚠️ PASTIKAN LINK INI ADALAH LINK CSV DARI "PUBLISH TO WEB" ⚠️
    const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT67IzL-bTN2UfDE4zcfDzhxiAAwhRRxQTDlPMHaCt0Zh0mx5RNzQnT-mk6tEFAqwSHoBQBlhXlZasM/pub?output=csv'; 

    function openModal(e) { 
        if(e) e.preventDefault(); 
        modal.style.display = "block"; 
    }
    
    function closeModal() { 
        modal.style.display = "none"; 
        resultDiv.style.display = 'none'; 
        inputInvoice.value = ''; 
    }

    if(btnNav) btnNav.addEventListener('click', openModal);
    if(btnHero) btnHero.addEventListener('click', openModal);
    if(spanClose) spanClose.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target == modal) closeModal(); });

    if(btnSearch) {
        btnSearch.addEventListener('click', async () => {
            const code = inputInvoice.value.trim().toUpperCase();
            
            if(code === '') {
                alert("Masukkan kode invoice!");
                return;
            }

            // Tampilkan Loading
            resultDiv.style.display = 'block';
            resultDiv.className = 'status-result';
            resultDiv.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Sedang mencari data...</p>';

            try {
                // UPDATE: Menambahkan Timestamp (?t=...) agar browser tidak menyimpan cache lama
                const fetchUrl = `${SHEET_URL}&t=${Date.now()}`;
                
                const response = await fetch(fetchUrl, { cache: "no-store" });
                const dataText = await response.text();
                
                // Parse CSV
                const rows = dataText.split('\n').map(row => row.split(','));
                
                let foundData = null;

                // ASUMSI STRUKTUR SHEET:
                // Index 0 = No
                // Index 1 = Invoice (Kolom B)
                // Index 2 = Nama (Kolom C) -> KITA AMBIL INI
                // Index 3 = Status (Kolom D)
                // Index 4 = Keterangan (Kolom E)

                for (let i = 1; i < rows.length; i++) {
                    // Bersihkan tanda kutip jika ada
                    const currentInv = rows[i][1] ? rows[i][1].replace(/['"]+/g, '').trim().toUpperCase() : '';
                    
                    if (currentInv === code) {
                        foundData = {
                            name: rows[i][2] ? rows[i][2].replace(/['"]+/g, '').trim() : 'Pelanggan',
                            status: rows[i][3] ? rows[i][3].replace(/['"]+/g, '').trim() : 'Tanpa Status',
                            desc: rows[i][4] ? rows[i][4].replace(/['"]+/g, '').trim() : '-'
                        };
                        break;
                    }
                }

                if (foundData) {
                    let statusClass = 'status-pending'; 
                    const statusLower = foundData.status.toLowerCase();
                    
                    if(statusLower.includes('selesai') || statusLower.includes('siap') || statusLower.includes('bisa')) {
                        statusClass = 'status-success';
                    } else if (statusLower.includes('gagal') || statusLower.includes('batal')) {
                        statusClass = 'status-error';
                    }

                    // TAMPILAN HASIL BARU (DENGAN NAMA)
                    resultDiv.className = `status-result ${statusClass}`;
                    resultDiv.innerHTML = `
                        <div style="border-bottom:1px solid rgba(0,0,0,0.1); padding-bottom:10px; margin-bottom:10px;">
                            <h4 style="margin:0; color:var(--text-secondary); font-size:0.9rem;">Hai, ${foundData.name}</h4>
                            <h2 style="margin:5px 0;">${foundData.status}</h2>
                        </div>
                        <p style="font-weight:500;">${foundData.desc}</p>
                        <small style="opacity:0.7; margin-top:10px; display:block;">Data Real-time dari Database</small>
                    `;
                } else {
                    resultDiv.className = `status-result status-error`;
                    resultDiv.innerHTML = `
                        <h3>Data Tidak Ditemukan</h3>
                        <p>Kode Invoice <b>${code}</b> tidak terdaftar.</p>
                        <p style="font-size:0.9rem">Pastikan input Kode Invoice sudah benar.</p>
                    `;
                }

            } catch (error) {
                console.error('Error fetching sheet:', error);
                resultDiv.className = `status-result status-error`;
                resultDiv.innerHTML = `<p>Gagal mengambil data. Pastikan koneksi internet lancar.</p>`;
            }
        });
    }
});