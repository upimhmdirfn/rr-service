document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ANIMATION & SCROLL EFFECT (Scroll Reveal) ---
    const header = document.querySelector('header');
    
    // Header Shadow on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    // Intersection Observer untuk Animasi Muncul
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 2. MOBILE MENU ---
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('open');
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('open');
        });
    });

    // --- 3. SETTINGS & THEME ---
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    if(settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsPanel.classList.toggle('active');
            const icon = settingsBtn.querySelector('i');
            icon.style.transform = settingsPanel.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
        });
    }

    document.addEventListener('click', (e) => {
        if (settingsPanel && settingsBtn && !settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
            settingsPanel.classList.remove('active');
            if(settingsBtn.querySelector('i')) settingsBtn.querySelector('i').style.transform = 'rotate(0deg)';
        }
    });

    // Dark Mode Logic
    const updateThemeIcon = (isDark) => {
        if(themeToggle) {
            themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i> Mode Terang' : '<i class="fas fa-moon"></i> Mode Gelap';
        }
    };

    if(localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        updateThemeIcon(true);
    }

    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon(isDark);
        });
    }

    // --- 4. HUMAN-LIKE WHATSAPP FORMAT ---
    const waForm = document.getElementById('waForm');
    if(waForm) {
        waForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('waName').value.trim();
            const method = document.getElementById('waMethod').value;
            const type = document.getElementById('waType').value;
            const damage = document.getElementById('waDamage').value;
            const message = document.getElementById('waMessage').value.trim();

            if (!name || !message) {
                alert("Mohon lengkapi Nama dan Detail/Alamat Anda.");
                return;
            }
            
            // Logic Waktu
            const timeNow = new Date().getHours();
            let greeting = "Pagi";
            if(timeNow >= 11 && timeNow < 15) greeting = "Siang";
            else if(timeNow >= 15 && timeNow < 18) greeting = "Sore";
            else greeting = "Malam";

            let waText = "";

            if (method === "Antar Jemput") {
                waText = `*REQUEST PICKUP SERVICE (ANTAR JEMPUT)* 🛵%0A%0A` +
                         `Halo Admin RR Service, selamat ${greeting}.%0A` +
                         `Saya *${name}*, mau minta tolong jemput HP saya untuk diservis ya.%0A%0A` +
                         `📱 *HP:* ${type}%0A` +
                         `⚠️ *Keluhan:* ${damage}%0A%0A` +
                         `📍 *Alamat Jemput & Detail Kondisi:*%0A${message}%0A%0A` +
                         `Mohon info estimasi biaya & waktu jemputnya. Terima kasih!`;
            } else {
                waText = `*BOOKING SERVICE (DATANG KE TOKO)* 🛠️%0A%0A` +
                         `Halo Admin, selamat ${greeting}.%0A` +
                         `Perkenalkan saya *${name}*. Saya rencana mau servis HP ke toko.%0A%0A` +
                         `📱 *Unit:* ${type}%0A` +
                         `⚠️ *Masalah:* ${damage}%0A%0A` +
                         `*Keterangan Tambahan:*%0A${message}%0A%0A` +
                         `Kira-kira bisa ditunggu tidak ya? Ditunggu balasannya, thanks!`;
            }

            const url = `https://wa.me/6281379689393?text=${waText}`;
            window.open(url, '_blank');
        });
    }

    // --- 5. FAQ Logic ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if(!isActive) item.classList.add('active');
        });
    });

    // --- 6. MODAL CEK STATUS (GOOGLE SHEETS) ---
    const modal = document.getElementById("statusModal");
    const btns = document.querySelectorAll("#btnCheckStatusNav, #btnCheckStatusHero");
    const spanClose = document.querySelector(".close-modal");
    const btnSearch = document.getElementById("btnSearchInvoice");
    const inputInvoice = document.getElementById("invoiceInput");
    const resultDiv = document.getElementById("statusResult");
    
    // URL SHEET CSV (Pastikan ini benar)
    const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT67IzL-bTN2UfDE4zcfDzhxiAAwhRRxQTDlPMHaCt0Zh0mx5RNzQnT-mk6tEFAqwSHoBQBlhXlZasM/pub?output=csv'; 

    btns.forEach(btn => btn?.addEventListener('click', (e) => {
        e.preventDefault(); modal.style.display = "block";
    }));
    
    if(spanClose) spanClose.addEventListener('click', () => {
        modal.style.display = "none";
        resultDiv.style.display = 'none';
        inputInvoice.value = '';
    });
    
    window.addEventListener('click', (e) => { if(e.target == modal) modal.style.display = "none"; });

    if(btnSearch) {
        btnSearch.addEventListener('click', async () => {
            const code = inputInvoice.value.trim().toUpperCase();
            if(code === '') { alert("Masukkan kode invoice!"); return; }

            resultDiv.style.display = 'block';
            resultDiv.className = 'status-result';
            resultDiv.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Sedang mencari data...</p>';

            try {
                const fetchUrl = `${SHEET_URL}&t=${Date.now()}`;
                const response = await fetch(fetchUrl, { cache: "no-store" });
                const dataText = await response.text();
                const rows = dataText.split('\n').map(row => row.split(','));
                
                let foundData = null;
                for (let i = 1; i < rows.length; i++) {
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

                    resultDiv.className = `status-result ${statusClass}`;
                    resultDiv.innerHTML = `
                        <div style="border-bottom:1px solid rgba(0,0,0,0.1); padding-bottom:10px; margin-bottom:10px;">
                            <h4 style="margin:0; color:var(--text-secondary); font-size:0.9rem;">Hai, ${foundData.name}</h4>
                            <h2 style="margin:5px 0;">${foundData.status}</h2>
                        </div>
                        <p style="font-weight:500;">${foundData.desc}</p>
                        <small style="opacity:0.7; margin-top:10px; display:block;">Data Real-time</small>
                    `;
                } else {
                    resultDiv.className = `status-result status-error`;
                    resultDiv.innerHTML = `<h3>Data Tidak Ditemukan</h3><p>Kode Invoice <b>${code}</b> tidak terdaftar.</p>`;
                }

            } catch (error) {
                console.error(error);
                resultDiv.className = `status-result status-error`;
                resultDiv.innerHTML = `<p>Gagal mengambil data. Cek koneksi internet.</p>`;
            }
        });
    }
});
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Delay dikit (0.5 detik) biar loadingnya kelihatan smooth, gak kedip doang
        setTimeout(() => {
            preloader.classList.add('hide');
            setTimeout(() => { preloader.remove(); }, 500);
        }, 500);
    }
});