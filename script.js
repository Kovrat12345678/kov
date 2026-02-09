// =================================
// Phone Data
// =================================
const phoneData = {
    samsung: {
        name: 'Samsung',
        models: [
            'Galaxy S25 Ultra',
            'Galaxy S25',
            'Galaxy S24',
            'Galaxy S23',
            'Galaxy A54',
            'Galaxy A34'
        ]
    },
    iphone: {
        name: 'iPhone',
        models: [
            'iPhone 17 Pro Max',
            'iPhone 17 Pro',
            'iPhone 17 Plus',
            'iPhone 17',
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
            'iPhone 13 Pro Max',
            'iPhone 13 Pro',
            'iPhone 13',
            'iPhone 13 Mini',
            'iPhone 12 Pro Max',
            'iPhone 12 Pro',
            'iPhone 12',
            'iPhone 12 Mini',
            'iPhone 11 Pro Max',
            'iPhone 11 Pro',
            'iPhone 11'
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
        icon: '🛡️',
        category: 'glass',
        image: 'assets/standard-glass.jpg',
        modelImages: {
            'iPhone 15': 'assets/iphone15-premium-glass.png'
        }
    },
    {
        id: 2,
        name: 'Privacy Screen Protector',
        description: 'Betekintésvédő technológia',
        price: 4490,
        badge: 'Új',
        icon: '👁️',
        category: 'glass',
        image: 'assets/standard-glass.jpg'
    },
    {
        id: 3,
        name: 'Anti-Blue Light Glass',
        description: 'Kékfény szűrő, szemvédelem',
        price: 3990,
        badge: null,
        icon: '💙',
        category: 'glass',
        image: 'assets/standard-glass.jpg'
    },
    {
        id: 4,
        name: 'Matte Screen Protector',
        description: 'Matt felület, tükröződésmentes',
        price: 3490,
        badge: null,
        icon: '✨',
        category: 'glass',
        image: 'assets/standard-glass.jpg'
    },
    {
        id: 6,
        name: 'Camera Lens Protector',
        description: 'Kameravédő üveg készlet (3 db)',
        price: 1990,
        badge: null,
        icon: '📸',
        category: 'glass',
        image: 'assets/standard-glass.jpg'
    },
    {
        id: 101,
        name: 'Vékony Szilikon Tok',
        description: 'Ultra vékony, víztiszta védelem',
        price: 3990,
        badge: 'Népszerű',
        icon: '📱',
        category: 'case',
        image: 'assets/standard-case.jpg'
    },
    {
        id: 102,
        name: 'Mágneses Ütésálló Tok',
        description: 'MagSafe kompatibilis, extra védelem',
        price: 7990,
        badge: 'Prémium',
        icon: '🧲',
        category: 'case',
        image: 'assets/standard-case.jpg'
    },
    {
        id: 103,
        name: 'Bőr Hatású Elegáns Tok',
        description: 'Prémium megjelenés, puha belső',
        price: 6490,
        badge: null,
        icon: '💼',
        category: 'case',
        image: 'assets/standard-case.jpg'
    },
    {
        id: 104,
        name: 'Carbon Fiber Tok',
        description: 'Strapabíró, modern design',
        price: 5490,
        badge: 'Új',
        icon: '🖤',
        category: 'case',
        image: 'assets/standard-case.jpg'
    }
];

// =================================
// State
// =================================
let selectedBrand = null;
let selectedModel = null;
let selectedCategory = 'glass';
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

// Sidebar Checkout Elements
const startCheckoutBtn = document.getElementById('startCheckoutBtn');
const backToCartBtn = document.getElementById('backToCartBtn');
const sidebarCheckoutForm = document.getElementById('sidebarCheckoutForm');
const cartActions = document.getElementById('cartActions');

// =================================
// Initialize
// =================================
document.addEventListener('DOMContentLoaded', () => {
    // Ensure the page starts at the top
    window.scrollTo(0, 0);

    initScrollAnimations();
    initHeaderScroll();
    initMobileMenu();
    initBrandSelector();
    initCategorySelector();
    initCart();
    initCheckout();
    initContactForm();
    renderProducts();
});

// =================================
// Checkout Initialization
// =================================
function initCheckout() {
    if (startCheckoutBtn) {
        startCheckoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('A kosarad üres!');
                return;
            }
            toggleCheckoutView(true);
        });
    }

    if (backToCartBtn) {
        backToCartBtn.addEventListener('click', () => {
            toggleCheckoutView(false);
        });
    }

    if (sidebarCheckoutForm) {
        sidebarCheckoutForm.addEventListener('submit', handleOrderSubmit);
    }
}

function toggleCheckoutView(show) {
    if (show) {
        sidebarCheckoutForm.style.display = 'flex';
        cartActions.style.display = 'none';
        cartSidebar.classList.add('checkout-mode');
    } else {
        sidebarCheckoutForm.style.display = 'none';
        cartActions.style.display = 'flex';
        cartSidebar.classList.remove('checkout-mode');
    }
}

async function handleOrderSubmit(e) {
    e.preventDefault();

    const submitBtn = sidebarCheckoutForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<span>Küldés...</span>';
    submitBtn.disabled = true;

    const email = document.getElementById('sideOrderEmail').value.trim();
    const emailConfirm = document.getElementById('sideOrderEmailConfirm').value.trim();

    if (email !== emailConfirm) {
        showToast('✗ A két email cím nem egyezik!');
        document.getElementById('sideOrderEmailConfirm').style.borderColor = '#ef4444';
        document.getElementById('sideOrderEmailConfirm').focus();
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        return;
    }

    // Reset border color if they match now
    document.getElementById('sideOrderEmailConfirm').style.borderColor = '';

    const orderData = {
        type: 'order',
        name: document.getElementById('sideOrderName').value.trim(),
        email: email,
        phone: document.getElementById('sideOrderPhone').value.trim(),
        address: document.getElementById('sideOrderAddress').value.trim(),
        cart: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0)
    };

    try {
        const isLocal = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname.startsWith('192.168.') ||
            window.location.hostname.startsWith('10.') ||
            window.location.hostname.startsWith('172.');

        if (!isLocal) {
            // Production: EmailJS
            const templateParams = {
                from_name: orderData.name,
                from_email: orderData.email,
                phone: orderData.phone,
                address: orderData.address,
                // Use <br> for EmailJS HTML templates
                order_details: cart.map(item => `${item.brand} ${item.model}: ${item.name} (${formatPrice(item.price)})`).join('<br>'),
                total_price: formatPrice(orderData.total),
                to_name: "ScreenShield Pro Admin",
                to_email: orderData.email // For auto-reply
            };

            console.log('Sending order via EmailJS...', templateParams);

            // Send to Admin
            const adminRes = await emailjs.send('service_dqwa6g8', 'template_8a420h7', templateParams);
            console.log('Admin EmailJS Response:', adminRes);

            // Send to Customer (Auto-reply)
            const customerRes = await emailjs.send('service_dqwa6g8', 'template_x59rxin', templateParams);
            console.log('Customer EmailJS Response:', customerRes);

            showToast('✓ Rendelés és visszaigazolás elküldve!');
        } else {
            // Local: PHP
            const response = await fetch('send_email.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            if (result.success) {
                showToast('✓ ' + result.message);
            } else {
                throw new Error(result.debug || result.message);
            }
        }

        // Success: Clear cart, reset form, close sidebar, reset view
        cart = [];
        saveCart();
        updateCartUI();
        sidebarCheckoutForm.reset();
        toggleCheckoutView(false);
        closeCart();

    } catch (error) {
        console.error('ORDER SUBMISSION ERROR:', error);
        let errorMsg = 'Hiba történt a küldéskor!';

        if (error.text) errorMsg += ' (EmailJS: ' + error.text + ')';
        else if (error.message) errorMsg += ' (' + error.message + ')';

        showToast('✗ ' + errorMsg);
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
}

// =================================
// Category Selector
// =================================
function initCategorySelector() {
    // Add event listeners for the header links
    document.querySelectorAll('a[href="#products"], .mobile-nav-link[href="#products"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const isCase = link.textContent.toLowerCase().includes('tok');
            if (isCase) {
                selectedCategory = 'case';
            } else if (link.textContent.toLowerCase().includes('üveg')) {
                selectedCategory = 'glass';
            }
            updateCategoryUI();
            updateProductsTitle();
            renderProducts();
        });
    });

    // Add event listeners for the category switcher buttons
    const catBtns = document.querySelectorAll('.category-btn');
    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedCategory = btn.dataset.category;
            updateCategoryUI();
            updateProductsTitle();
            renderProducts();
        });
    });
}


function updateCategoryUI() {
    const glassBtn = document.getElementById('catGlass');
    const caseBtn = document.getElementById('catCase');
    if (!glassBtn || !caseBtn) return;

    if (selectedCategory === 'glass') {
        glassBtn.classList.add('active');
        caseBtn.classList.remove('active');
    } else {
        glassBtn.classList.remove('active');
        caseBtn.classList.add('active');
    }
}


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

            // If clicking the already selected brand, toggle it off
            if (selectedBrand === brand) {
                btn.classList.remove('active');
                selectedBrand = null;
                selectedModel = null;
                modelSelector.classList.remove('active');
                updateProductsTitle();
                renderProducts();
                return;
            }

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
        const categoryName = selectedCategory === 'glass' ? 'Üvegfóliák' : 'Tokok';
        productsTitle.textContent = `${categoryName}: ${selectedModel}`;
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

    const filteredProducts = products.filter(p => p.category === selectedCategory);

    productsGrid.innerHTML = filteredProducts.map(product => {
        const productImg = (product.modelImages && product.modelImages[selectedModel])
            ? `<img src="${product.modelImages[selectedModel]}" alt="${product.name}">`
            : product.image
                ? `<img src="${product.image}" alt="${product.name}">`
                : product.icon;

        return `
            <div class="product-card animate-on-scroll visible">
                <div class="product-image">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    ${productImg}
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
        `;
    }).join('');


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
    // Load cart from localStorage and validate
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        const rawCart = JSON.parse(savedCart);
        // Filter out items that are no longer in the products list (e.g. old 3D figures)
        cart = rawCart.filter(item => products.some(p => p.id === item.productId));

        if (cart.length !== rawCart.length) {
            saveCart(); // Update storage if items were removed
        }
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

    // If cart becomes empty, ensure we're back in cart view
    if (cart.length === 0) {
        toggleCheckoutView(false);
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
// Contact Form (Hybrid: EmailJS + PHP)
// =================================
function initContactForm() {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<span>Küldés...</span>';
        submitBtn.disabled = true;

        try {
            // Check environment: default to EmailJS on everything except local PHP environments
            const isLocal = window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1' ||
                window.location.hostname.startsWith('192.168.') ||
                window.location.hostname.startsWith('10.') ||
                window.location.hostname.startsWith('172.');

            console.log('Environment detected:', isLocal ? 'Local (PHP)' : 'Production (EmailJS)');

            if (!isLocal) {
                // ===========================================
                // GitHub Pages: Use EmailJS
                // ===========================================
                const templateParams = {
                    from_name: contactForm.querySelector('input[type="text"]').value.trim(),
                    from_email: contactForm.querySelector('input[type="email"]').value.trim(),
                    message: contactForm.querySelector('textarea').value.trim(),
                    to_name: "ScreenShield Pro Admin"
                };

                console.log('Sending message via EmailJS...', templateParams);

                // Send notification to owner
                await emailjs.send('service_dqwa6g8', 'template_8a420h7', templateParams);

                // Send auto-reply to visitor
                await emailjs.send('service_dqwa6g8', 'template_x59rxin', templateParams);

                showToast('✓ Üzenet és visszaigazolás elküldve!');
                contactForm.reset();
            } else {
                // ===========================================
                // Local/XAMPP: Use PHP
                // ===========================================
                const formData = {
                    name: contactForm.querySelector('input[type="text"]').value.trim(),
                    email: contactForm.querySelector('input[type="email"]').value.trim(),
                    message: contactForm.querySelector('textarea').value.trim()
                };

                const response = await fetch('send_email.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    showToast('✓ ' + result.message);
                    contactForm.reset();
                } else {
                    console.error('SERVER ERROR:', result.debug || result.message);
                    throw new Error(result.message);
                }
            }
        } catch (error) {
            console.error('CONTACT FORM ERROR:', error);
            let errorMsg = 'Hiba történt a küldéskor!';

            if (error.text) errorMsg += ' (EmailJS: ' + error.text + ')';
            else if (error.message) errorMsg += ' (' + error.message + ')';

            showToast('✗ ' + errorMsg);
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
