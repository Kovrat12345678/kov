/* ============================================
   Kárai Art Gallery — JavaScript
   ============================================ */

// --- Translation System ---
const translations = {
    hu: {
        // Nav
        navHome: "Főoldal",
        navGallery: "Galéria",
        navAbout: "Rólam",
        navOrder: "Rendelés",
        navContact: "Kapcsolat",
        // Hero
        heroSubtitle: "Egyedi festmények",
        heroTitle: 'Művészet, ami<br>otthonná varázsolja<br>a teret',
        heroDesc: "Minden alkotás egyedi, kézzel festett mű — tájképektől portréig. Fedezze fel a galériát és válassza ki az Önhöz illő festményt.",
        heroBtn1: "Galéria megtekintése",
        heroBtn2: "Kapcsolat",
        // Gallery
        galleryLabel: "Alkotások",
        galleryTitle: "Galéria",
        galleryDesc: "Válogatás a legújabb festmények közül. Kattintson egy alkotásra a részletekért.",
        filterAll: "Összes",
        filterLandscape: "Tájkép",
        filterPortrait: "Portré",
        filterAbstract: "Absztrakt",
        filterStillLife: "Csendélet",
        inquiryBtn: "Megrendelés",
        soldLabel: "Eladva",
        roomViewBtn: "Szobában",
        // About
        aboutLabel: "A Művész",
        aboutTitle: "Kárai — Festő",
        aboutP1: "Több évtizedes tapasztalattal rendelkező festőművész, aki az olajfestészet és az impresszionista stílus szerelmese. Alkotásaiban a természet szépségét, az emberek érzelmeit és a mindennapi élet pillanatait örökíti meg.",
        aboutP2: "Minden festmény egyedi darab, amelyet gondos odafigyeléssel és szenvedéllyel készítek. Ha megtetszik egy alkotásom, keressen bátran — szívesen készítek egyedi megrendelésre is.",
        statPaintings: "Elkészült festmény",
        statYears: "Év tapasztalat",
        statClients: "Elégedett vásárló",
        // Newsletter
        newsletterLabel: "Értesítések",
        newsletterTitle: "Iratkozzon fel",
        newsletterDesc: "Legyen elsőként értesülve az új festményekről és egyedi ajánlatokról.",
        newsletterPlaceholder: "Email címe",
        newsletterBtn: "Feliratkozás",
        newsletterSuccess: "✅ Sikeres feliratkozás! Köszönjük az érdeklődését.",
        // Contact
        contactLabel: "Kapcsolat",
        contactTitle: "Írjon nekem",
        contactDesc: "Érdeklődik egy festmény iránt, vagy egyedi megrendelést szeretne? Keressen bátran!",
        contactEmail: "Email",
        contactPhone: "Telefon",
        contactLocation: "Helyszín",
        contactLocationVal: "Magyarország",
        contactAvailable: "Elérhető",
        contactAvailableVal: "Hétfő – Péntek, 9:00 – 18:00",
        formName: "Név",
        formNamePh: "Az Ön neve",
        formEmail: "Email",
        formEmailPh: "pelda@email.com",
        formSubject: "Tárgy",
        formSubjectPh: "Érdeklődés festmény iránt",
        formMessage: "Üzenet",
        formMessagePh: "Írja le, miben segíthetek...",
        formSubmit: "Üzenet küldése",
        formSuccess: "✅ Üzenet sikeresen elküldve! Hamarosan válaszolok.",
        // Footer
        footerDesc: "Egyedi, kézzel festett alkotások közvetlenül a művésztől. Minden festmény történetet mesél.",
        footerNav: "Navigáció",
        footerInfo: "Információ",
        footerCustom: "Egyedi megrendelés",
        footerShipping: "Szállítás",
        footerArtist: "A művészről",
        footerCopy: "© 2026 Kárai Art Gallery. Minden jog fenntartva.",
        // Order
        orderLabel: "Vásárlási folyamat",
        orderTitle: "Egyedi Rendelés",
        orderDesc: "Szeretne egy festményt megvásárolni? Itt minden információt megtalál.",
        step1Title: "Válasszon festményt",
        step1Desc: "Nézze meg a galériát, vagy írja le egyedi elképzelését.",
        step2Title: "Vegye fel a kapcsolatot",
        step2Desc: "Töltse ki az alábbi űrlapot az igényeivel.",
        step3Title: "Egyeztetés és Szállítás",
        step3Desc: "Pontosítjuk a részleteket, és biztonságosan elküldöm az alkotást.",
        shippingTitle: "Szállítás és Fizetés",
        shipping1: "Gondos, ütésálló csomagolás",
        shipping2: "Házhozszállítás futárszolgálattal",
        orderName: "Név",
        orderEmail: "Email",
        orderPhone: "Telefonszám",
        orderPhonePh: "+36 30 123 4567",
        orderAddress: "Lakcím (Szállításhoz)",
        orderAddressPh: "Irányítószám, Város, Utca, Házszám",
        orderPainting: "Kiválasztott festmény vagy elképzelés",
        orderPaintingPh: "Pl: Tavon a naplemente, vagy egyedi portré...",
        orderPayment: "Fizetési mód",
        payCash: "Készpénz (átvételkor)",
        payCard: "Bankkártya (Online)",
        payTransfer: "Banki átutalás",
        orderMsg: "Megjegyzés / Kérdések",
        orderSubmit: "Rendelés elküldése",
        orderSuccess: "✅ Köszönöm! A rendelést rögzítettük, hamarosan keresni foglak a részletekkel!",
        // Room modal
        roomTitle: "Festmény a szobában",
        roomClose: "Bezárás",
        // Order template (for pre-filling form)
        orderSubject: "Megrendelés:",
        orderBody: 'Szia! Szeretném megrendelni a(z) "%TITLE%" című festményt.'
    },
    en: {
        navHome: "Home",
        navGallery: "Gallery",
        navAbout: "About",
        navOrder: "Order",
        navContact: "Contact",
        heroSubtitle: "Unique paintings",
        heroTitle: 'Art that turns<br>a space into<br>a home',
        heroDesc: "Every artwork is a unique, hand-painted piece — from landscapes to portraits. Explore the gallery and find the painting that speaks to you.",
        heroBtn1: "View Gallery",
        heroBtn2: "Contact",
        galleryLabel: "Artworks",
        galleryTitle: "Gallery",
        galleryDesc: "A selection of the latest paintings. Click on an artwork for details.",
        filterAll: "All",
        filterLandscape: "Landscape",
        filterPortrait: "Portrait",
        filterAbstract: "Abstract",
        filterStillLife: "Still Life",
        inquiryBtn: "Order",
        soldLabel: "Sold",
        roomViewBtn: "Room View",
        aboutLabel: "The Artist",
        aboutTitle: "Kárai — Painter",
        aboutP1: "A painter with decades of experience, passionate about oil painting and the impressionist style. His works capture the beauty of nature, human emotions, and everyday moments.",
        aboutP2: "Every painting is a unique piece, created with careful attention and passion. If you like one of my works, feel free to reach out — I also accept custom commissions.",
        statPaintings: "Paintings completed",
        statYears: "Years of experience",
        statClients: "Satisfied clients",
        newsletterLabel: "Updates",
        newsletterTitle: "Subscribe",
        newsletterDesc: "Be the first to know about new paintings and exclusive offers.",
        newsletterPlaceholder: "Your email address",
        newsletterBtn: "Subscribe",
        newsletterSuccess: "✅ Successfully subscribed! Thank you for your interest.",
        contactLabel: "Contact",
        contactTitle: "Get in touch",
        contactDesc: "Interested in a painting or want a custom commission? Feel free to reach out!",
        contactEmail: "Email",
        contactPhone: "Phone",
        contactLocation: "Location",
        contactLocationVal: "Hungary",
        contactAvailable: "Available",
        contactAvailableVal: "Monday – Friday, 9:00 – 18:00",
        formName: "Name",
        formNamePh: "Your name",
        formEmail: "Email",
        formEmailPh: "example@email.com",
        formSubject: "Subject",
        formSubjectPh: "Inquiry about a painting",
        formMessage: "Message",
        formMessagePh: "Let me know how I can help...",
        formSubmit: "Send Message",
        formSuccess: "✅ Message sent successfully! I will reply soon.",
        footerDesc: "Unique, hand-painted artworks directly from the artist. Every painting tells a story.",
        footerNav: "Navigation",
        footerInfo: "Information",
        footerCustom: "Custom Commissions",
        footerShipping: "Shipping",
        footerArtist: "About the Artist",
        footerCopy: "© 2026 Kárai Art Gallery. All rights reserved.",
        // Order
        orderLabel: "Buying Process",
        orderTitle: "Custom Order",
        orderDesc: "Want to buy a painting or order a unique piece? Here is all the info.",
        step1Title: "Choose a painting",
        step1Desc: "Browse the gallery or describe your unique idea.",
        step2Title: "Get in touch",
        step2Desc: "Fill out the form below with your requirements.",
        step3Title: "Agreement & Shipping",
        step3Desc: "We'll finalize details, and I'll ship the artwork safely.",
        shippingTitle: "Shipping & Payment",
        shipping1: "Careful, shock-resistant packaging",
        shipping2: "Home delivery via courier service",
        shipping3: "Custom sizes and framing available",
        orderName: "Name",
        orderEmail: "Email",
        orderPhone: "Phone Number",
        orderPhonePh: "+36 30 123 4567",
        orderAddress: "Address (for Shipping)",
        orderAddressPh: "Zip Code, City, Street, Number",
        orderPainting: "Selected painting or idea",
        orderPaintingPh: "E.g.: Sunset on lake, or custom portrait...",
        orderPayment: "Payment Method",
        payCash: "Cash (on delivery)",
        payCard: "Credit Card (Online)",
        payTransfer: "Bank Transfer",
        orderMsg: "Notes / Questions",
        orderSubmit: "Send Order",
        orderSuccess: "✅ Thank you! Your order has been recorded, I will contact you soon!",
        roomTitle: "Painting in Room",
        roomClose: "Close",
        orderSubject: "Order:",
        orderBody: 'Hi! I would like to order the painting "%TITLE%".'
    }
};

// Current language
let currentLang = localStorage.getItem("karai-lang") || "hu";

function t(key) {
    return translations[currentLang][key] || translations["hu"][key] || key;
}

// --- Painting Data (now empty, loaded from API) ---
let paintings = [];

async function fetchPaintings() {
    try {
        const response = await fetch('api.php?action=list');
        paintings = await response.json();
        applyLanguage(); // Re-render gallery with new data
    } catch (error) {
        console.error('Error loading paintings:', error);
    }
}

function pt(painting, field) {
    if (!painting) return "";

    // Handle new flat structure (title_hu, details_hu, etc.)
    const key = `${field}_${currentLang}`;
    if (painting[key] !== undefined) return painting[key];

    // Fallback to hu if currentLang version is missing
    const fallbackKey = `${field}_hu`;
    if (painting[fallbackKey] !== undefined) return painting[fallbackKey];

    // Handle old nested structure if any (backward compatibility)
    if (typeof painting[field] === "object") {
        return painting[field][currentLang] || painting[field]["hu"];
    }

    return painting[field] || "";
}

// --- DOM Elements ---
const galleryGrid = document.getElementById("galleryGrid");
const filterBtns = document.querySelectorAll(".filter-btn");
const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDesc = document.getElementById("lightboxDesc");
const lightboxClose = document.getElementById("lightboxClose");
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

// --- Render Gallery ---
function renderGallery(filter = "all") {
    const filtered = filter === "all"
        ? paintings
        : paintings.filter(p => p.category === filter);

    galleryGrid.innerHTML = "";

    filtered.forEach((painting, index) => {
        const card = document.createElement("div");
        card.className = "painting-card fade-in";
        card.style.transitionDelay = `${index * 0.1}s`;
        card.setAttribute("data-category", painting.category);

        const soldBadge = painting.sold
            ? `<div class="sold-badge">${t("soldLabel")}</div>`
            : "";

        const inquiryOrSold = painting.sold
            ? `<span class="painting-sold-text">${t("soldLabel")}</span>`
            : `<button class="btn-inquiry" data-title="${pt(painting, 'title')}">${t("inquiryBtn")}</button>`;

        card.innerHTML = `
      <div class="painting-img-wrapper" data-id="${painting.id}">
        ${soldBadge}
        <img src="${painting.image}" alt="${pt(painting, 'title')}" loading="lazy">
        <div class="painting-overlay">
          <div class="view-icon">🔍</div>
        </div>
      </div>
      <div class="painting-info">
        <h3 class="painting-title">${pt(painting, 'title')}</h3>
        <p class="painting-details">${pt(painting, 'details')}</p>
        <div class="painting-footer">
          <span class="painting-price">${painting.price}</span>
          ${inquiryOrSold}
        </div>
      </div>
    `;

        galleryGrid.appendChild(card);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                card.classList.add("visible");
            });
        });
    });

    attachCardListeners();
}

function attachCardListeners() {
    // Lightbox
    document.querySelectorAll(".painting-img-wrapper").forEach(wrapper => {
        wrapper.addEventListener("click", () => {
            const id = parseInt(wrapper.dataset.id);
            const painting = paintings.find(p => p.id === id);
            if (painting) {
                openLightbox(painting);
            }
        });
    });

    // Order buttons (formerly inquiry)
    document.querySelectorAll(".btn-inquiry").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const title = btn.dataset.title;
            const paintingField = document.getElementById("orderPainting");
            const messageField = document.getElementById("orderMsg");

            paintingField.value = title;
            messageField.value = t("orderBody").replace("%TITLE%", title);

            document.getElementById("order").scrollIntoView({ behavior: "smooth" });
        });
    });
}

// --- Lightbox ---
function openLightbox(painting) {
    lightboxImg.src = painting.image;
    lightboxImg.alt = pt(painting, "title");
    lightboxTitle.textContent = pt(painting, "title");

    const soldText = painting.sold ? ` — ${t("soldLabel")}` : "";
    lightboxDesc.textContent = `${pt(painting, "details")} — ${painting.price}${soldText}`;

    // Configure room view button in lightbox
    const roomBtn = document.getElementById("lightboxRoomBtn");
    roomBtn.textContent = `🏠 ${t("roomViewBtn")}`;
    roomBtn.onclick = () => {
        closeLightbox();
        openRoomPreview(painting);
    };

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeLightbox();
        closeRoomPreview();
    }
});

// --- Room Preview ---
const roomModal = document.getElementById("roomPreview");
const roomClose = document.getElementById("roomPreviewClose");
const roomPaintingImg = document.getElementById("roomPaintingImg");

function openRoomPreview(painting) {
    roomPaintingImg.src = painting.image;
    roomPaintingImg.alt = pt(painting, "title");
    document.getElementById("roomPreviewTitle").textContent = `${pt(painting, "title")} — ${pt(painting, "details")}`;
    roomModal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeRoomPreview() {
    roomModal.classList.remove("active");
    document.body.style.overflow = "";
}

roomClose.addEventListener("click", closeRoomPreview);
roomModal.addEventListener("click", (e) => {
    if (e.target === roomModal) closeRoomPreview();
});

// --- Filter Buttons ---
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderGallery(btn.dataset.filter);
    });
});

// --- Navbar Scroll Effect ---
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

    // Active link
    const sections = document.querySelectorAll("section[id]");
    let current = "";
    sections.forEach(section => {
        const top = section.offsetTop - 100;
        if (window.scrollY >= top) {
            current = section.getAttribute("id");
        }
    });
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
});

// --- Mobile Menu ---
menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    menuToggle.classList.toggle("active");
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
    });
});

// --- Contact Form ---
contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) return;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Küldés...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('send_contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, message })
        });

        const result = await response.json();

        if (result.success) {
            formSuccess.textContent = t("formSuccess");
            formSuccess.classList.add("visible");
            contactForm.reset();
        } else {
            throw new Error(result.message || "Hiba történt.");
        }
    } catch (error) {
        console.error("Contact form error:", error);
        formSuccess.textContent = error.message || "Hiba történt az üzenet küldésekor.";
        formSuccess.classList.add("visible");
        formSuccess.style.color = "#ef4444";
        formSuccess.style.background = "rgba(239, 68, 68, 0.1)";
        formSuccess.style.borderColor = "#ef4444";
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        setTimeout(() => {
            formSuccess.classList.remove("visible");
            setTimeout(() => { formSuccess.style = ""; }, 300);
        }, 5000);
    }
});

// --- Order Form ---
const orderForm = document.getElementById("orderForm");
const orderSuccess = document.getElementById("orderSuccess");

orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("orderName").value.trim();
    const email = document.getElementById("orderEmail").value.trim();
    const phone = document.getElementById("orderPhone").value.trim();
    const address = document.getElementById("orderAddress").value.trim();
    const painting = document.getElementById("orderPainting").value.trim();
    const payment = document.getElementById("orderPayment").value;
    const message = document.getElementById("orderMsg").value.trim();

    if (!name || !email) return;

    const submitBtn = orderForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Küldés...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('send_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone, address, painting, payment, message })
        });

        const result = await response.json();

        if (result.success) {
            orderSuccess.textContent = t("orderSuccess") || result.message;
            orderSuccess.classList.add("visible");
            orderForm.reset();
        } else {
            throw new Error(result.message || "Hiba történt.");
        }
    } catch (error) {
        console.error("Order form error:", error);
        orderSuccess.textContent = error.message || "Hiba történt a rendelés elküldésekor.";
        orderSuccess.classList.add("visible");
        orderSuccess.style.color = "#ef4444";
        orderSuccess.style.background = "rgba(239, 68, 68, 0.1)";
        orderSuccess.style.borderColor = "#ef4444";
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        setTimeout(() => {
            orderSuccess.classList.remove("visible");
            setTimeout(() => { orderSuccess.style = ""; }, 300);
        }, 5000);
    }
});

// --- Newsletter ---
const newsletterForm = document.getElementById("newsletterForm");
const newsletterSuccess = document.getElementById("newsletterSuccess");

newsletterForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("newsletterEmail");
    const email = emailInput.value.trim();
    if (!email) return;

    const submitBtn = newsletterForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Küldés...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('send_newsletter.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (result.success) {
            newsletterSuccess.textContent = t("newsletterSuccess");
            newsletterSuccess.className = "form-success visible";
            newsletterForm.reset();
        } else {
            throw new Error(result.message || "Hiba történt.");
        }
    } catch (error) {
        console.error("Newsletter error:", error);
        newsletterSuccess.textContent = error.message || "Hiba történt a feliratkozáskor.";
        newsletterSuccess.className = "form-success visible";
        newsletterSuccess.style.color = "#ef4444";
        newsletterSuccess.style.background = "rgba(239, 68, 68, 0.1)";
        newsletterSuccess.style.borderColor = "#ef4444";
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        setTimeout(() => {
            newsletterSuccess.classList.remove("visible");
            setTimeout(() => { newsletterSuccess.style = ""; }, 300);
        }, 5000);
    }
});

// --- Scroll Animations ---
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll(".fade-in").forEach(el => {
    observer.observe(el);
});

// --- Theme Toggle ---
const themeToggle = document.getElementById("themeToggle");

function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("karai-theme", theme);
}

const savedTheme = localStorage.getItem("karai-theme") || "light";
if (savedTheme === "dark") {
    setTheme("dark");
}

themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
});

// --- Language Toggle ---
const langToggle = document.getElementById("langToggle");
const langLabel = document.getElementById("langLabel");

function applyLanguage() {
    document.documentElement.setAttribute("lang", currentLang);
    langLabel.textContent = currentLang === "hu" ? "EN" : "HU";

    // Nav
    document.querySelector('[href="#hero"]').textContent = t("navHome");
    document.querySelector('[href="#gallery"]').textContent = t("navGallery");
    document.querySelector('[href="#about"]').textContent = t("navAbout");
    document.querySelector('[href="#order"]').textContent = t("navOrder");
    document.querySelector('[href="#contact"]').textContent = t("navContact");

    // Hero
    document.querySelector(".hero-subtitle").textContent = t("heroSubtitle");
    document.querySelector(".hero h1").innerHTML = t("heroTitle");
    document.querySelector(".hero-description").textContent = t("heroDesc");
    document.querySelectorAll(".hero-buttons a")[0].textContent = t("heroBtn1");
    document.querySelectorAll(".hero-buttons a")[1].textContent = t("heroBtn2");

    // Gallery
    document.querySelector("#gallery .section-label").textContent = t("galleryLabel");
    document.querySelector("#gallery .section-title").textContent = t("galleryTitle");
    document.querySelector("#gallery .section-desc").textContent = t("galleryDesc");

    // Filters
    const filters = document.querySelectorAll(".filter-btn");
    const filterKeys = ["filterAll", "filterLandscape", "filterPortrait", "filterAbstract", "filterStillLife"];
    filters.forEach((btn, i) => {
        if (filterKeys[i]) btn.textContent = t(filterKeys[i]);
    });

    // About
    document.querySelector("#about .section-label").textContent = t("aboutLabel");
    document.querySelector(".about-text h3").textContent = t("aboutTitle");
    const aboutPs = document.querySelectorAll(".about-text > p");
    aboutPs[0].textContent = t("aboutP1");
    aboutPs[1].textContent = t("aboutP2");
    const statLabels = document.querySelectorAll(".stat-label");
    statLabels[0].textContent = t("statPaintings");
    statLabels[1].textContent = t("statYears");
    statLabels[2].textContent = t("statClients");

    // Newsletter
    document.querySelector("#newsletter .section-label").textContent = t("newsletterLabel");
    document.querySelector("#newsletter .section-title").textContent = t("newsletterTitle");
    document.querySelector("#newsletter .section-desc").textContent = t("newsletterDesc");
    document.getElementById("newsletterEmail").placeholder = t("newsletterPlaceholder");
    document.querySelector("#newsletterForm .btn-primary").textContent = t("newsletterBtn");

    // Contact
    document.querySelector("#contact .section-label").textContent = t("contactLabel");
    document.querySelector("#contact .section-title").textContent = t("contactTitle");
    document.querySelector("#contact .section-desc").textContent = t("contactDesc");
    const contactH4s = document.querySelectorAll(".contact-item h4");
    contactH4s[0].textContent = t("contactEmail");
    contactH4s[1].textContent = t("contactPhone");
    contactH4s[2].textContent = t("contactLocation");
    contactH4s[3].textContent = t("contactAvailable");
    const contactPs = document.querySelectorAll(".contact-item p");
    contactPs[2].textContent = t("contactLocationVal");
    contactPs[3].textContent = t("contactAvailableVal");

    // Order Section
    document.querySelector("#order .section-label").textContent = t("orderLabel");
    document.querySelector("#order .section-title").textContent = t("orderTitle");
    document.querySelector("#order .section-desc").textContent = t("orderDesc");
    document.getElementById("step1Title").textContent = t("step1Title");
    document.getElementById("step1Desc").textContent = t("step1Desc");
    document.getElementById("step2Title").textContent = t("step2Title");
    document.getElementById("step2Desc").textContent = t("step2Desc");
    document.getElementById("step3Title").textContent = t("step3Title");
    document.getElementById("step3Desc").textContent = t("step3Desc");
    document.getElementById("shippingTitle").textContent = t("shippingTitle");
    document.getElementById("shipping1").textContent = t("shipping1");
    document.getElementById("shipping2").textContent = t("shipping2");
    document.getElementById("shipping3").textContent = t("shipping3");
    document.getElementById("orderPhoneLabel").textContent = t("orderPhone");
    document.getElementById("orderPhone").placeholder = t("orderPhonePh");
    document.getElementById("orderAddressLabel").textContent = t("orderAddress");
    document.getElementById("orderAddress").placeholder = t("orderAddressPh");
    document.getElementById("orderPaintingLabel").textContent = t("orderPainting");
    document.getElementById("orderPainting").placeholder = t("orderPaintingPh");
    document.getElementById("orderPaymentLabel").textContent = t("orderPayment");
    document.getElementById("payCash").textContent = t("payCash");
    document.getElementById("payCard").textContent = t("payCard");
    document.getElementById("payTransfer").textContent = t("payTransfer");
    document.getElementById("orderMsgLabel").textContent = t("orderMsg");
    document.getElementById("orderSubmitBtn").textContent = t("orderSubmit");

    // Form
    document.querySelector('label[for="name"]').textContent = t("formName");
    document.getElementById("name").placeholder = t("formNamePh");
    document.querySelector('label[for="email"]').textContent = t("formEmail");
    document.getElementById("email").placeholder = t("formEmailPh");
    document.querySelector('label[for="subject"]').textContent = t("formSubject");
    document.getElementById("subject").placeholder = t("formSubjectPh");
    document.querySelector('label[for="message"]').textContent = t("formMessage");
    document.getElementById("message").placeholder = t("formMessagePh");
    document.getElementById("submitBtn").textContent = t("formSubmit");

    // Footer
    document.querySelector(".footer-brand p").textContent = t("footerDesc");
    const footerH4s = document.querySelectorAll(".footer-links h4");
    footerH4s[0].textContent = t("footerNav");
    footerH4s[1].textContent = t("footerInfo");
    // Footer nav links
    const footerNavLinks = document.querySelectorAll(".footer-links")[0].querySelectorAll("a");
    footerNavLinks[0].textContent = t("navHome");
    footerNavLinks[1].textContent = t("navGallery");
    footerNavLinks[2].textContent = t("navAbout");
    footerNavLinks[3].textContent = t("navOrder");
    footerNavLinks[4].textContent = t("navContact");
    // Footer info links
    const footerInfoLinks = document.querySelectorAll(".footer-links")[1].querySelectorAll("a");
    footerInfoLinks[0].textContent = t("footerCustom");
    footerInfoLinks[1].textContent = t("footerShipping");
    footerInfoLinks[2].textContent = t("footerArtist");
    // Copyright
    document.querySelector(".footer-bottom p").textContent = t("footerCopy");

    // Room modal
    document.querySelector("#roomPreview .room-modal-title").textContent = t("roomTitle");

    // Re-render gallery with new language
    const activeFilter = document.querySelector(".filter-btn.active");
    renderGallery(activeFilter ? activeFilter.dataset.filter : "all");
}

langToggle.addEventListener("click", () => {
    currentLang = currentLang === "hu" ? "en" : "hu";
    localStorage.setItem("karai-lang", currentLang);
    applyLanguage();
});

// --- Init ---
fetchPaintings(); // Initialize by loading data from server
applyLanguage();
