/* ============================================
   Kárai Art Gallery — Admin Logic
   ============================================ */

const API_URL = 'api.php';
const paintingsTableBody = document.getElementById('paintingsTableBody');
const paintingModal = document.getElementById('paintingModal');
const paintingForm = document.getElementById('paintingForm');
const modalTitle = document.getElementById('modalTitle');
const totalCountEl = document.getElementById('totalCount');
const soldCountEl = document.getElementById('soldCount');
const toastEl = document.getElementById('toast');

let allPaintings = [];

// --- Fetch Data ---
async function fetchPaintings() {
    try {
        const response = await fetch(`${API_URL}?action=list`);
        const data = await response.json();
        allPaintings = data;
        renderTable();
        updateStats();
    } catch (error) {
        showToast('Hiba az adatok betöltésekor!', 'error');
        console.error('Fetch error:', error);
    }
}

// --- Render Table ---
function renderTable() {
    paintingsTableBody.innerHTML = '';

    allPaintings.forEach(painting => {
        const tr = document.createElement('tr');

        const statusBadge = painting.sold
            ? `<span class="badge badge-sold">Eladva</span>`
            : `<span class="badge badge-available">Elérhető</span>`;

        tr.innerHTML = `
            <td><img src="${painting.image}" class="table-img" alt=""></td>
            <td>
                <strong>${painting.title_hu}</strong><br>
                <small style="color:var(--text-muted)">${painting.title_en}</small>
            </td>
            <td><span class="badge badge-category">${painting.category}</span></td>
            <td>${painting.price}</td>
            <td>${statusBadge}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn sold-toggle" title="Állapot váltása" onclick="toggleSold(${painting.id})">💰</button>
                    <button class="action-btn" title="Szerkesztés" onclick="openEditModal(${painting.id})">✏️</button>
                    <button class="action-btn delete" title="Törlés" onclick="deletePainting(${painting.id})">🗑️</button>
                </div>
            </td>
        `;
        paintingsTableBody.appendChild(tr);
    });
}

function updateStats() {
    totalCountEl.textContent = allPaintings.length;
    soldCountEl.textContent = allPaintings.filter(p => p.sold).length;
}

// --- CRUD Actions ---
async function deletePainting(id) {
    if (!confirm('Biztosan törölni szeretnéd ezt a festményt?')) return;

    const formData = new FormData();
    formData.append('id', id);

    try {
        const response = await fetch(`${API_URL}?action=delete`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            showToast('Festmény sikeresen törölve.');
            fetchPaintings();
        } else {
            showToast('Hiba a törlés során!', 'error');
        }
    } catch (error) {
        showToast('Szerver hiba történt!', 'error');
    }
}

async function toggleSold(id) {
    const formData = new FormData();
    formData.append('id', id);

    try {
        const response = await fetch(`${API_URL}?action=toggle-sold`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            fetchPaintings();
        }
    } catch (error) {
        showToast('Hiba a státusz váltásakor!', 'error');
    }
}

// --- Modal Handling ---
const openAddModalBtn = document.getElementById('openAddModal');
const closeModalBtn = document.getElementById('closeModal');
const cancelModalBtn = document.getElementById('cancelModal');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');

openAddModalBtn.onclick = () => {
    modalTitle.textContent = 'Új festmény hozzáadása';
    paintingForm.reset();
    document.getElementById('paintingId').value = '';
    imagePreview.innerHTML = '';
    paintingModal.classList.add('active');
};

function closeModal() {
    paintingModal.classList.remove('active');
}

closeModalBtn.onclick = closeModal;
cancelModalBtn.onclick = closeModal;

window.onclick = (e) => {
    if (e.target === paintingModal) closeModal();
};

function openEditModal(id) {
    const p = allPaintings.find(item => item.id === id);
    if (!p) return;

    modalTitle.textContent = 'Festmény szerkesztése';
    document.getElementById('paintingId').value = p.id;
    document.getElementById('title_hu').value = p.title_hu;
    document.getElementById('title_en').value = p.title_en;
    document.getElementById('category').value = p.category;
    document.getElementById('price').value = p.price;
    document.getElementById('details_hu').value = p.details_hu;
    document.getElementById('details_en').value = p.details_en;
    document.getElementById('description_hu').value = p.description_hu;
    document.getElementById('description_en').value = p.description_en;
    document.getElementById('sold').checked = p.sold;

    imagePreview.innerHTML = p.image ? `<img src="${p.image}" alt="">` : '';

    paintingModal.classList.add('active');
}

// --- Image Preview ---
imageInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
};

// --- Form Submit ---
paintingForm.onsubmit = async (e) => {
    e.preventDefault();

    const id = document.getElementById('paintingId').value;
    const action = id ? 'update' : 'add';
    const formData = new FormData(paintingForm);

    try {
        const response = await fetch(`${API_URL}?action=${action}`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (result.success) {
            showToast(id ? 'Sikeres módosítás!' : 'Sikeres hozzáadás!');
            closeModal();
            fetchPaintings();
        } else {
            showToast(result.error || 'Hiba történt a mentéskor!', 'error');
        }
    } catch (error) {
        showToast('Szerver hiba történt!', 'error');
    }
};

// --- Toast ---
function showToast(message, type = 'success') {
    toastEl.textContent = message;
    toastEl.className = `toast ${type} visible`;
    setTimeout(() => {
        toastEl.classList.remove('visible');
    }, 3000);
}

// --- Init ---
fetchPaintings();
