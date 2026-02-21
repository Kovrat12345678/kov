// ============================================================
// Itthoni Bolt - Email küldés PHP-n keresztül (send_email.php)
// ============================================================

// ============================================================
// ADMIN JELSZÓ
// ============================================================
const ADMIN_PASSWORD = "admin2011";
let isAdminLoggedIn = false;

// ============================================================
// PRODUCT DATA (localStorage)
// ============================================================
const STORAGE_KEY = "itthoni_bolt_products";
const API_URL = "api.php";

async function loadProducts() {
    try {
        const response = await fetch(API_URL);
        const serverData = await response.json();

        if (Array.isArray(serverData) && serverData.length > 0) {
            // Found products on server
            products = serverData.map(p => ({ stock: 1, ...p }));
            return products;
        }

        // If server is empty, check localStorage (migration)
        const localData = localStorage.getItem(STORAGE_KEY);
        if (localData) {
            const prods = JSON.parse(localData);
            if (Array.isArray(prods) && prods.length > 0) {
                products = prods.map(p => ({ stock: 1, ...p }));
                // Save to server for the first time
                await saveProducts(products);
                return products;
            }
        }
    } catch (e) {
        console.error("Hiba a termékek betöltésekor:", e);
    }

    // Default demo products if everything else fails
    products = [
        {
            id: 1,
            name: "Vezeték Nélküli Füles",
            price: "12.900 Ft",
            description: "Kiváló hangzás, aktív zajszűrés és kényelmes viselet egész nap.",
            image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800",
            stock: 3
        },
        {
            id: 2,
            name: "USB-C Gyorstöltő",
            price: "4.990 Ft",
            description: "20W gyorstöltés minden modern eszközhöz, kompakt kialakítás.",
            image: "https://images.unsplash.com/photo-1583860889048-ed1477169bb8?auto=format&fit=crop&q=80&w=800",
            stock: 5
        },
        {
            id: 3,
            name: "Okosóra Szíj - Nylon",
            price: "3.900 Ft",
            description: "Légáteresztő, fonott nylon szíj, kényelmes mindennapi viselet.",
            image: "https://images.unsplash.com/photo-1434493720993-9099839352e0?auto=format&fit=crop&q=80&w=800",
            stock: 2
        },
        {
            id: 4,
            name: "Laptop Állvány",
            price: "8.500 Ft",
            description: "Ergonomikus alumínium állvány, segíti a hűtést és a helyes testtartást.",
            image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800",
            stock: 1
        }
    ];
    return products;
}

async function saveProducts(newProducts) {
    products = newProducts;
    // Save to localStorage too as a backup
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(products)
        });
        const result = await response.json();
        if (!result.success) console.error("Szerver hiba:", result.message);
    } catch (e) {
        console.error("Hiba a szerverre mentéskor:", e);
    }
}

let products = [];
let editingProductId = null;
let uploadedImageData = null;

// ============================================================
// TIME SLOTS
// ============================================================
const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

// ============================================================
// DOM ELEMENTS
// ============================================================
const productContainer = document.getElementById('product-container');
const emptyState = document.getElementById('empty-state');
const modal = document.getElementById('reservation-modal');
const closeModalBtn = document.getElementById('close-modal');
const reservationForm = document.getElementById('reservation-form');
const productInfoText = document.getElementById('selected-product-info');
const toast = document.getElementById('toast');
const timeGrid = document.getElementById('time-grid');
const timeInput = document.getElementById('selected-time');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

// Admin elements
const adminForm = document.getElementById('admin-product-form');
const adminFormTitle = document.getElementById('admin-form-title');
const adminProductList = document.getElementById('admin-product-list');
const adminNameInput = document.getElementById('admin-product-name');
const adminPriceInput = document.getElementById('admin-product-price');
const adminDescInput = document.getElementById('admin-product-desc');
const adminImageInput = document.getElementById('admin-product-image');
const imageUploadArea = document.getElementById('image-upload-area');
const imagePreview = document.getElementById('image-preview');
const uploadPlaceholder = document.getElementById('upload-placeholder');
const editProductIdInput = document.getElementById('edit-product-id');
const adminCancelBtn = document.getElementById('admin-cancel-btn');
const adminStockInput = document.getElementById('admin-product-stock');

// ============================================================
// BACKGROUND PARTICLES
// ============================================================
function createParticles() {
    const container = document.getElementById('bg-particles');
    const colors = ['#8b5cf6', '#f472b6', '#06b6d4', '#a78bfa'];
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

// ============================================================
// RENDER PRODUCTS (Public View)
// ============================================================
function renderProducts() {
    productContainer.innerHTML = '';
    if (products.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    products.forEach((product, index) => {
        const isOutOfStock = product.stock <= 0;
        const card = document.createElement('div');
        card.className = 'product-card glass' + (isOutOfStock ? ' sold-out' : '');
        card.style.animationDelay = (index * 0.08) + 's';
        card.innerHTML = `
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-image"
                     onerror="this.src='https://via.placeholder.com/800x600/1a1a2e/8b5cf6?text=Nincs+kép'">
                <div class="product-badge ${isOutOfStock ? 'badge-sold-out' : 'badge-available'}">${isOutOfStock ? 'Elfogyott' : (product.stock + ' db')}</div>
                ${isOutOfStock ? '<div class="sold-out-overlay"><span>ELFOGYOTT</span></div>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">${product.price}</div>
                    ${isOutOfStock
                ? '<button class="reserve-btn btn-soldout" disabled>Elfogyott</button>'
                : `<button class="reserve-btn" onclick="openReservation(${product.id})">Lefoglalom</button>`
            }
                </div>
            </div>
        `;
        productContainer.appendChild(card);
    });
}

// ============================================================
// RENDER ADMIN PRODUCT LIST
// ============================================================
function renderAdminProducts() {
    adminProductList.innerHTML = '';
    if (products.length === 0) {
        adminProductList.innerHTML = '<p style="text-align:center;color:var(--text-muted);grid-column:1/-1;padding:2rem;">Még nincsenek termékek. Adj hozzá egyet fent!</p>';
        return;
    }
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'admin-product-card';
        const stockClass = product.stock <= 0 ? 'stock-zero' : (product.stock <= 2 ? 'stock-low' : 'stock-ok');
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="admin-product-img"
                 onerror="this.src='https://via.placeholder.com/800x400/1a1a2e/8b5cf6?text=Nincs+kép'">
            <div class="admin-product-body">
                <h4>${product.name}</h4>
                <div class="price">${product.price}</div>
                <p class="desc">${product.description}</p>
                <div class="stock-info ${stockClass}">Készlet: <strong>${product.stock} db</strong></div>
                <div class="admin-card-actions">
                    <button class="btn-edit" onclick="editProduct(${product.id})">✏️ Szerkesztés</button>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})">🗑️ Törlés</button>
                </div>
            </div>
        `;
        adminProductList.appendChild(card);
    });
}

// ============================================================
// ADMIN: ADD / EDIT / DELETE
// ============================================================
adminForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = adminNameInput.value.trim();
    const price = adminPriceInput.value.trim();
    const description = adminDescInput.value.trim();
    const stock = parseInt(adminStockInput.value) || 0;

    if (!name || !price || !description) {
        showToast('Kérlek töltsd ki az összes mezőt!', 'error');
        return;
    }

    if (editingProductId) {
        // Edit existing
        const product = products.find(p => p.id === editingProductId);
        if (product) {
            product.name = name;
            product.price = price;
            product.description = description;
            product.stock = stock;
            if (uploadedImageData) {
                product.image = uploadedImageData;
            }
            showToast('Termék sikeresen frissítve!', 'success');
        }
        cancelEdit();
    } else {
        // Add new
        const newProduct = {
            id: Date.now(),
            name,
            price,
            description,
            stock,
            image: uploadedImageData || 'https://via.placeholder.com/800x600/1a1a2e/8b5cf6?text=' + encodeURIComponent(name)
        };
        products.push(newProduct);
        showToast('Termék sikeresen hozzáadva!', 'success');
    }

    await saveProducts(products);
    renderProducts();
    renderAdminProducts();
    resetAdminForm();
});

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    editingProductId = id;
    adminNameInput.value = product.name;
    adminPriceInput.value = product.price;
    adminDescInput.value = product.description;
    adminStockInput.value = product.stock || 0;

    // Show current image
    if (product.image) {
        imagePreview.src = product.image;
        imagePreview.style.display = 'block';
        uploadPlaceholder.style.display = 'none';
        uploadedImageData = product.image;
    }

    adminFormTitle.textContent = '✏️ Termék Szerkesztése';
    document.getElementById('admin-save-btn').innerHTML = '<span>✏️</span> Frissítés';
    adminCancelBtn.style.display = 'flex';
    editProductIdInput.value = id;

    // Scroll to admin form
    document.getElementById('admin-section').scrollIntoView({ behavior: 'smooth' });
}

async function deleteProduct(id) {
    if (!confirm('Biztosan törlöd ezt a terméket?')) return;
    products = products.filter(p => p.id !== id);
    await saveProducts(products);
    renderProducts();
    renderAdminProducts();
    showToast('Termék törölve!', 'info');
}

function cancelEdit() {
    editingProductId = null;
    resetAdminForm();
}

function resetAdminForm() {
    adminForm.reset();
    editingProductId = null;
    uploadedImageData = null;
    imagePreview.style.display = 'none';
    imagePreview.src = '';
    uploadPlaceholder.style.display = 'flex';
    adminFormTitle.textContent = 'Új Termék Hozzáadása';
    document.getElementById('admin-save-btn').innerHTML = '<span>💾</span> Mentés';
    adminCancelBtn.style.display = 'none';
    editProductIdInput.value = '';
    adminStockInput.value = '1';
}

adminCancelBtn.addEventListener('click', cancelEdit);

// ============================================================
// IMAGE UPLOAD (Base64 → localStorage)
// ============================================================
imageUploadArea.addEventListener('click', () => adminImageInput.click());

imageUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    imageUploadArea.classList.add('dragover');
});

imageUploadArea.addEventListener('dragleave', () => {
    imageUploadArea.classList.remove('dragover');
});

imageUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    imageUploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
});

adminImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleImageFile(file);
});

function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
        showToast('Csak képfájlokat tudsz feltölteni!', 'error');
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        showToast('A kép túl nagy! Maximum 2MB.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        uploadedImageData = e.target.result;
        imagePreview.src = uploadedImageData;
        imagePreview.style.display = 'block';
        uploadPlaceholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

// ============================================================
// RESERVATION MODAL
// ============================================================
function renderTimeSlots() {
    timeGrid.innerHTML = '';
    timeSlots.forEach(time => {
        const slot = document.createElement('div');
        slot.className = 'time-slot';
        slot.innerText = time;
        slot.onclick = () => selectTime(time, slot);
        timeGrid.appendChild(slot);
    });
}

function selectTime(time, element) {
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    element.classList.add('selected');
    timeInput.value = time;
}

let currentReservationProduct = null;

function openReservation(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentReservationProduct = product;
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    productInfoText.innerText = `${product.name} — ${product.price}`;

    timeInput.value = '';
    renderTimeSlots();
    reservationForm.reset();
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

closeModalBtn.onclick = closeModal;
modal.onclick = (e) => { if (e.target === modal) closeModal(); };
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ============================================================
// FORM SUBMISSION (PHP EMAIL)
// ============================================================
reservationForm.onsubmit = async (e) => {
    e.preventDefault();

    if (!timeInput.value) {
        showToast('Kérlek válassz egy időpontot!', 'error');
        return;
    }

    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    btnText.textContent = 'Küldés...';
    btnLoader.style.display = 'inline-block';
    submitBtn.disabled = true;

    const payload = {
        name: document.getElementById('user_name').value,
        email: document.getElementById('user_email').value,
        phone: document.getElementById('user_phone').value || '',
        product_name: currentReservationProduct ? currentReservationProduct.name : '',
        product_price: currentReservationProduct ? currentReservationProduct.price : '',
        selected_time: timeInput.value,
        message: document.getElementById('user_message').value || ''
    };

    try {
        const response = await fetch('send_email.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
            // Decrease stock
            if (currentReservationProduct) {
                const prod = products.find(p => p.id === currentReservationProduct.id);
                if (prod && prod.stock > 0) {
                    prod.stock--;
                    await saveProducts(products);
                    renderProducts();
                    renderAdminProducts();
                }
            }
            showToast('Sikeres foglalás! Visszaigazolást küldtünk emailben.', 'success');
            closeModal();
            reservationForm.reset();
        } else {
            showToast('Hiba: ' + (result.message || 'Ismeretlen hiba'), 'error');
        }
    } catch (error) {
        console.error('Email Error:', error);
        showToast('Hiba történt az email küldésekor. Próbáld újra!', 'error');
    } finally {
        btnText.textContent = 'Foglalás Beküldése';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }
};

// ============================================================
// TOAST
// ============================================================
let toastTimeout;
function showToast(message, type = 'success') {
    clearTimeout(toastTimeout);
    toast.innerText = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';
    toastTimeout = setTimeout(() => {
        toast.style.display = 'none';
    }, 4000);
}

// ============================================================
// NAVIGATION
// ============================================================
// Scroll effect
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Hamburger menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[data-section="${id}"]`);
        if (link) {
            if (scrollY >= top && scrollY < top + height) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}
window.addEventListener('scroll', updateActiveNav);

// ============================================================
// INTERSECTION OBSERVER (Animate on scroll)
// ============================================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));

// Initial render
async function init() {
    createParticles();
    await loadProducts();
    renderProducts();
    renderAdminProducts();
    console.log("Itthoni Bolt inicializálva.");
}

init();

// ============================================================
// ADMIN LOGIN / LOGOUT
// ============================================================
function loginAdmin() {
    const pw = prompt('🔐 Admin jelszó:');
    if (pw === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        document.getElementById('admin-section').style.display = '';
        document.getElementById('nav-admin-link').style.display = '';
        document.getElementById('admin-login-btn').style.display = 'none';
        showToast('Sikeres bejelentkezés! Üdv admin!', 'success');
        document.getElementById('admin-section').scrollIntoView({ behavior: 'smooth' });
    } else if (pw !== null) {
        showToast('Hibás jelszó!', 'error');
    }
}

function logoutAdmin() {
    isAdminLoggedIn = false;
    document.getElementById('admin-section').style.display = 'none';
    document.getElementById('nav-admin-link').style.display = 'none';
    document.getElementById('admin-login-btn').style.display = '';
    showToast('Kijelentkezés sikeres.', 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Secret admin access: press Ctrl+Shift+A
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (!isAdminLoggedIn) loginAdmin();
    }
});
