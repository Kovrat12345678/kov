// =================================
// Phone Data
// =================================
const phoneData = {
    samsung: {
        name: 'Samsung',
        models: [
            'Galaxy S24 Ultra',
            'Galaxy S24+',
            'Galaxy S24',
            'Galaxy S23 Ultra',
            'Galaxy S23+',
            'Galaxy S23',
            'Galaxy Z Fold 5',
            'Galaxy Z Flip 5',
            'Galaxy A54',
            'Galaxy A34',
            'Galaxy A24',
            'Galaxy A14'
        ]
    },
    iphone: {
        name: 'iPhone',
        models: [
            'iPhone 16 Pro Max',
            'iPhone 16 Pro',
            'iPhone 16 Plus',
            'iPhone 16',
            'iPhone 15 Pro Max',
            'iPhone 15 Pro',
            'iPhone 15 Plus',
            'iPhone 15',
            'iPhone 14 Pro Max',
            'iPhone 14 Pro',
            'iPhone 14 Plus',
            'iPhone 14',
            'iPhone SE (2022)'
        ]
    }
};

// =================================
// Products Data
// =================================
const products = [
    {
        id: 1,
        name: 'Premium Tempered Glass',
        description: '9H keménység, buborékmentes felhelyezés',
        price: 2990,
        badge: 'Népszerű',
        icon: '🛡️'
    },
    {
        id: 2,
        name: 'Privacy Screen Protector',
        description: 'Betekintésvédő technológia',
        price: 4490,
        badge: 'Új',
        icon: '👁️'
    },
    {
        id: 3,
        name: 'Anti-Blue Light Glass',
        description: 'Kékfény szűrő, szemvédelem',
        price: 3990,
        badge: null,
        icon: '💙'
    },
    {
        id: 4,
        name: 'Matte Screen Protector',
        description: 'Matt felület, tükröződésmentes',
        price: 3490,
        badge: null,
        icon: '✨'
    },
    {
        id: 5,
        name: 'Full Cover 3D Glass',
        description: 'Teljes kijelző lefedés, ívelt szélek',
        price: 4990,
        badge: 'Prémium',
        icon: '💎'
    },
    {
        id: 6,
        name: 'Camera Lens Protector',
        description: 'Kameravédő üveg készlet (3 db)',
        price: 1990,
        badge: null,
        icon: '📸'
    }
];

// =================================
// State
// =================================
let selectedBrand = null;
let selectedModel = null;
let cart = [];

// =================================
// DOM Elements
// =================================
const header = document.querySelector('.header');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const brandBtns = document.querySelectorAll('.brand-btn');
const modelSelector = document.getElementById('modelSelector');
const modelGrid = document.getElementById('modelGrid');
const productsGrid = document.getElementById('productsGrid');
const productsTitle = document.getElementById('productsTitle');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const contactForm = document.getElementById('contactForm');

// =================================
// Initialize
// =================================
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initHeaderScroll();
    initMobileMenu();
    initBrandSelector();
    initCart();
    initContactForm();
    renderProducts();
});

// =================================
// Scroll Animations
// =================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// =================================
// Header Scroll Effect
// =================================
function initHeaderScroll() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// =================================
// Mobile Menu
// =================================
function initMobileMenu() {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// =================================
// Brand & Model Selector
// =================================
function initBrandSelector() {
    brandBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const brand = btn.dataset.brand;

            // Update active state
            brandBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Set selected brand
            selectedBrand = brand;
            selectedModel = null;

            // Show model selector
            renderModels(brand);
            modelSelector.classList.add('active');

            // Scroll to model selector
            setTimeout(() => {
                modelSelector.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        });
    });
}

function renderModels(brand) {
    const models = phoneData[brand].models;

    modelGrid.innerHTML = models.map(model => `
        <button class="model-btn" data-model="${model}">
            ${model}
        </button>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.model-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const model = btn.dataset.model;

            // Update active state
            document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Set selected model
            selectedModel = model;

            // Update products section
            updateProductsTitle();
            renderProducts();

            // Scroll to products
            setTimeout(() => {
                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            }, 200);
        });
    });
}

function updateProductsTitle() {
    if (selectedModel) {
        productsTitle.textContent = `Üvegfóliák: ${selectedModel}`;
    } else {
        productsTitle.textContent = 'Válassz egy telefont a termékekhez';
    }
}

// =================================
// Products
// =================================
function renderProducts() {
    if (!selectedModel) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📱</div>
                <p class="empty-state-text">Válassz fentebb egy telefont, hogy megtekinthesd az elérhető üvegfóliákat!</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card animate-on-scroll visible">
            <div class="product-image">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                ${product.icon}
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">
                        🛒
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add click handlers for add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.dataset.productId);
            addToCart(productId);
        });
    });
}

// =================================
// Cart Functions
// =================================
function initCart() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }

    // Cart button click
    cartBtn.addEventListener('click', () => {
        openCart();
    });

    // Close cart
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
}

function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !selectedModel) return;

    const cartItem = {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price,
        icon: product.icon,
        model: selectedModel,
        brand: phoneData[selectedBrand].name
    };

    cart.push(cartItem);
    saveCart();
    updateCartUI();
    showToast(`${product.name} hozzáadva a kosárhoz!`);
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Update count
    cartCount.textContent = cart.length;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <p>A kosarad üres</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">${item.icon}</div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-model">${item.brand} ${item.model}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                </div>
                <button class="cart-item-remove" data-item-id="${item.id}">✕</button>
            </div>
        `).join('');

        // Add remove handlers
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = parseInt(btn.dataset.itemId);
                removeFromCart(itemId);
            });
        });
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = formatPrice(total);
}

// =================================
// Toast Notification
// =================================
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// =================================
// Contact Form
// =================================
function initContactForm() {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        // Get form data
        const formData = {
            name: contactForm.querySelector('input[type="text"]').value,
            email: contactForm.querySelector('input[type="email"]').value,
            message: contactForm.querySelector('textarea').value
        };

        // Show loading state
        submitBtn.innerHTML = '<span>Küldés...</span>';
        submitBtn.disabled = true;

        try {
            const response = await fetch('send_email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                showToast('✓ ' + result.message);
                contactForm.reset();
            } else {
                console.error('SERVER ERROR:', result.debug || result.message);
                showToast('✗ ' + result.message);
            }
        } catch (error) {
            console.error('NETWORK ERROR:', error);
            showToast('✗ Hálózati hiba! Részletek a konzolban.');
        } finally {
            // Restore button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}


// =================================
// Utilities
// =================================
function formatPrice(price) {
    return new Intl.NumberFormat('hu-HU').format(price) + ' Ft';
}
