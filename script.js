// ========== MƏLUMATLAR ==========
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
let reviews = JSON.parse(localStorage.getItem('reviews')) || {};

// ========== ADMIN LOGIN SİSTEMİ (CONFIG-dən oxuyur) ==========
let failedAttempts = parseInt(localStorage.getItem('failedAttempts')) || 0;
let blockUntil = parseInt(localStorage.getItem('blockUntil')) || 0;
let countdownInterval = null;

// Konfiqurasiyadan dəyərləri oxu
const ADMIN_USERNAME = window.CONFIG.ADMIN_USERNAME;
const ADMIN_PASSWORD = window.CONFIG.ADMIN_PASSWORD;
const MAX_ATTEMPTS_LEVEL1 = window.CONFIG.MAX_ATTEMPTS_LEVEL1;
const BLOCK_TIME_LEVEL1 = window.CONFIG.BLOCK_TIME_LEVEL1;
const MAX_ATTEMPTS_LEVEL2 = window.CONFIG.MAX_ATTEMPTS_LEVEL2;
const BLOCK_TIME_LEVEL2 = window.CONFIG.BLOCK_TIME_LEVEL2;
const BLOCK_TIME_LEVEL3 = window.CONFIG.BLOCK_TIME_LEVEL3;

function saveBlockData() {
    localStorage.setItem('failedAttempts', failedAttempts);
    localStorage.setItem('blockUntil', blockUntil);
}

function getBlockTime() {
    if (failedAttempts < MAX_ATTEMPTS_LEVEL1) return 0;
    if (failedAttempts < MAX_ATTEMPTS_LEVEL2) return BLOCK_TIME_LEVEL1;
    if (failedAttempts < MAX_ATTEMPTS_LEVEL2 + 5) return BLOCK_TIME_LEVEL2;
    return BLOCK_TIME_LEVEL3;
}

function isBlocked() {
    if (blockUntil === 0) return false;
    const now = Date.now();
    if (now >= blockUntil) {
        blockUntil = 0;
        saveBlockData();
        return false;
    }
    return true;
}

function startBlock(blockSeconds) {
    blockUntil = Date.now() + (blockSeconds * 1000);
    saveBlockData();
    updateCountdownDisplay();
}

function updateCountdownDisplay() {
    const display = document.getElementById('countdownDisplay');
    if (!display) return;
    
    if (countdownInterval) clearInterval(countdownInterval);
    
    if (isBlocked()) {
        countdownInterval = setInterval(() => {
            const now = Date.now();
            const remaining = Math.max(0, Math.ceil((blockUntil - now) / 1000));
            
            if (remaining <= 0) {
                clearInterval(countdownInterval);
                display.innerHTML = '';
                enableLoginForm(true);
                return;
            }
            
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            display.innerHTML = `⏰ Bloklanmışsınız! ${minutes}:${seconds.toString().padStart(2,'0')} saniyə gözləyin.`;
        }, 1000);
        enableLoginForm(false);
    } else {
        display.innerHTML = '';
        enableLoginForm(true);
    }
}

function enableLoginForm(enable) {
    const usernameInput = document.getElementById('adminUsername');
    const passwordInput = document.getElementById('adminPassword');
    const loginBtn = document.getElementById('loginBtn');
    
    if (usernameInput) usernameInput.disabled = !enable;
    if (passwordInput) passwordInput.disabled = !enable;
    if (loginBtn) loginBtn.disabled = !enable;
}

function checkLogin() {
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    const errorEl = document.getElementById('loginError');
    
    if (isBlocked()) {
        errorEl.textContent = 'Hesab bloklanıb. Zəhmət olmasa gözləyin.';
        updateCountdownDisplay();
        return false;
    }
    
    let errorMessage = '';
    
    if (username !== ADMIN_USERNAME) {
        errorMessage = '❌ İstifadəçi adı yanlış!';
        failedAttempts++;
        saveBlockData();
        
        const blockTime = getBlockTime();
        if (blockTime > 0) {
            startBlock(blockTime);
            errorMessage += ` ${blockTime} saniyə bloklandınız.`;
        }
        
        errorEl.textContent = errorMessage;
        updateCountdownDisplay();
        return false;
    }
    
    if (password !== ADMIN_PASSWORD) {
        errorMessage = '❌ Parol yanlış!';
        failedAttempts++;
        saveBlockData();
        
        const blockTime = getBlockTime();
        if (blockTime > 0) {
            startBlock(blockTime);
            errorMessage += ` ${blockTime} saniyə bloklandınız.`;
        }
        
        errorEl.textContent = errorMessage;
        updateCountdownDisplay();
        return false;
    }
    
    // UĞURLU GİRİŞ
    failedAttempts = 0;
    blockUntil = 0;
    saveBlockData();
    errorEl.textContent = '';
    updateCountdownDisplay();
    return true;
}

// ========== KÖMƏKÇİ FONKSİYALAR ==========
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(el => el.textContent = count);
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartTotalSpan = document.getElementById('cartTotal');
    if (cartTotalSpan) cartTotalSpan.textContent = total;
}

function renderCartModal() {
    const container = document.getElementById('cart-items');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p>Səbət boşdur</p>';
        updateCartTotal();
        return;
    }
    
    container.innerHTML = '';
    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span><strong>${item.name}</strong><br>${item.price} AZN</span>
            <div>
                <button class="cart-qty-down" data-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button class="cart-qty-up" data-index="${index}">+</button>
                <button class="cart-remove" data-index="${index}" style="background:red;color:white;">🗑️</button>
            </div>
        `;
        container.appendChild(div);
    });
    
    updateCartTotal();
    
    document.querySelectorAll('.cart-qty-down').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index);
            if (cart[idx].quantity > 1) cart[idx].quantity--;
            else cart.splice(idx, 1);
            saveCart();
            renderCartModal();
            renderProducts();
        });
    });
    
    document.querySelectorAll('.cart-qty-up').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index);
            cart[idx].quantity++;
            saveCart();
            renderCartModal();
            renderProducts();
        });
    });
    
    document.querySelectorAll('.cart-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index);
            cart.splice(idx, 1);
            saveCart();
            renderCartModal();
            renderProducts();
        });
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id == productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id == productId);
    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });
    
    saveCart();
    renderCartModal();
    renderProducts();
    alert(`${product.name} səbətə əlavə edildi!`);
}

function renderProducts(searchTerm = '') {
    const container = document.getElementById('product-list');
    const featuredContainer = document.getElementById('featured-products');
    
    let filtered = products;
    if (searchTerm) {
        filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    const html = filtered.map(product => `
        <div class="product-card">
            <img src="${product.image || 'https://via.placeholder.com/200'}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price} AZN</p>
            <button onclick="addToCart(${product.id})">🛒 Səbətə at</button>
            <div class="rating">
                <div class="stars" data-product="${product.id}">
                    ${[1,2,3,4,5].map(star => `
                        <span class="star ${getRating(product.id) >= star ? 'selected' : ''}" data-star="${star}">★</span>
                    `).join('')}
                </div>
                <div class="reviews-list" id="reviews-${product.id}"></div>
                <textarea class="review-text" placeholder="Rəy yaz..." rows="2"></textarea>
                <button class="add-review" data-product="${product.id}">Rəy əlavə et</button>
            </div>
        </div>
    `).join('');
    
    if (container) container.innerHTML = html;
    if (featuredContainer) featuredContainer.innerHTML = filtered.slice(0, 3).map(product => `
        <div class="product-card">
            <img src="${product.image || 'https://via.placeholder.com/200'}">
            <h3>${product.name}</h3>
            <p class="price">${product.price} AZN</p>
            <button onclick="addToCart(${product.id})">Al</button>
        </div>
    `).join('');
    
    attachReviewEvents();
    attachStarEvents();
    loadReviews();
}

function getRating(productId) {
    if (!reviews[productId]) return 0;
    const total = reviews[productId].reduce((sum, r) => sum + r.rating, 0);
    return Math.round(total / reviews[productId].length);
}

function attachStarEvents() {
    document.querySelectorAll('.stars').forEach(starsDiv => {
        const productId = parseInt(starsDiv.dataset.product);
        starsDiv.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', (e) => {
                e.stopPropagation();
                const rating = parseInt(star.dataset.star);
                if (!reviews[productId]) reviews[productId] = [];
                reviews[productId].push({ rating, text: '', date: new Date().toLocaleDateString() });
                localStorage.setItem('reviews', JSON.stringify(reviews));
                renderProducts();
            });
        });
    });
}

function attachReviewEvents() {
    document.querySelectorAll('.add-review').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.dataset.product);
            const textarea = btn.parentElement.querySelector('.review-text');
            const text = textarea.value.trim();
            if (!text) return;
            if (!reviews[productId]) reviews[productId] = [];
            if (reviews[productId].length === 0) reviews[productId].push({ rating: 0, text, date: new Date().toLocaleDateString() });
            else reviews[productId][reviews[productId].length - 1].text = text;
            localStorage.setItem('reviews', JSON.stringify(reviews));
            textarea.value = '';
            loadReviews();
        });
    });
}

function loadReviews() {
    for (let productId in reviews) {
        const container = document.getElementById(`reviews-${productId}`);
        if (container) {
            container.innerHTML = reviews[productId].map(r => `
                <div class="review">
                    <strong>★${r.rating || '?'}</strong> - ${r.text} <small>(${r.date})</small>
                </div>
            `).join('');
        }
    }
}

// ========== ADMIN FUNKSİYALARI ==========
function renderAdminProducts() {
    const container = document.getElementById('adminProductList');
    if (!container) return;
    
    container.innerHTML = products.map((p, idx) => `
        <div style="border:1px solid #ddd; padding:10px; margin:10px 0;">
            <strong>${p.name}</strong> - ${p.price} AZN
            <button onclick="editProduct(${p.id})">✏️ Redaktə et</button>
            <button onclick="deleteProduct(${p.id})" style="background:red;">❌ Sil</button>
        </div>
    `).join('');
}

function addProduct(name, price, image) {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    products.push({ id: newId, name, price: parseFloat(price), image });
    localStorage.setItem('products', JSON.stringify(products));
    renderAdminProducts();
    renderProducts();
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    const newName = prompt('Yeni ad:', product.name);
    const newPrice = prompt('Yeni qiymət:', product.price);
    if (newName) product.name = newName;
    if (newPrice) product.price = parseFloat(newPrice);
    localStorage.setItem('products', JSON.stringify(products));
    renderAdminProducts();
    renderProducts();
}

function deleteProduct(id) {
    if (confirm('Əminsən?')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        renderAdminProducts();
        renderProducts();
        cart = cart.filter(item => item.id !== id);
        saveCart();
    }
}

// ========== EMAILJS İLƏ ƏLAQƏ FORMU (CONFIG-dən oxuyur) ==========
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // EmailJS-i konfiqurasiya faylından oxuyaraq başlat
    if (window.CONFIG && window.CONFIG.EMAILJS_PUBLIC_KEY && window.CONFIG.EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY_HERE") {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(window.CONFIG.EMAILJS_PUBLIC_KEY);
        }
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const status = document.getElementById('formStatus');
        
        // EmailJS aktiv deyilsə və ya konfiqurasiya edilməyibsə
        if (typeof emailjs === 'undefined' || !window.CONFIG || window.CONFIG.EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID_HERE") {
            status.textContent = '⚠️ EmailJS qoşulmayıb. Mesajınız göndərilmədi.';
            status.style.color = 'orange';
            return;
        }
        
        status.textContent = 'Göndərilir...';
        
        const templateParams = {
            from_name: document.getElementById('userName').value,
            from_email: document.getElementById('userEmail').value,
            message: document.getElementById('message').value
        };
        
        emailjs.send(window.CONFIG.EMAILJS_SERVICE_ID, window.CONFIG.EMAILJS_TEMPLATE_ID, templateParams)
            .then(() => {
                status.textContent = '✅ Mesajınız göndərildi!';
                status.style.color = 'green';
                form.reset();
            })
            .catch(() => {
                status.textContent = '❌ Xəta baş verdi.';
                status.style.color = 'red';
            });
    });
}

// ========== SƏBƏT MODAL ==========
function setupCartModal() {
    const modal = document.getElementById('cartModal');
    const btn = document.getElementById('cartBtn');
    const span = document.getElementsByClassName('close')[0];
    const clearBtn = document.getElementById('clearCartBtn');
    
    if (btn) btn.onclick = () => modal.style.display = 'block';
    if (span) span.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };
    if (clearBtn) clearBtn.onclick = () => { cart = []; saveCart(); renderCartModal(); renderProducts(); };
}

// ========== AXTARIŞ ==========
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => renderProducts(e.target.value));
    }
}

// ========== ADMIN GİRİŞİ ==========
function setupAdmin() {
    const loginSection = document.getElementById('loginSection');
    const adminPanel = document.getElementById('adminPanel');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginSection && adminPanel) {
        updateCountdownDisplay();
        
        if (isAdminLoggedIn && !isBlocked()) {
            loginSection.style.display = 'none';
            adminPanel.style.display = 'block';
            renderAdminProducts();
        } else {
            loginSection.style.display = 'block';
            adminPanel.style.display = 'none';
        }
        
        if (loginBtn) {
            loginBtn.onclick = () => {
                if (checkLogin()) {
                    isAdminLoggedIn = true;
                    localStorage.setItem('adminLoggedIn', 'true');
                    loginSection.style.display = 'none';
                    adminPanel.style.display = 'block';
                    renderAdminProducts();
                }
            };
        }
        
        if (logoutBtn) {
            logoutBtn.onclick = () => {
                isAdminLoggedIn = false;
                localStorage.removeItem('adminLoggedIn');
                loginSection.style.display = 'block';
                adminPanel.style.display = 'none';
                document.getElementById('adminUsername').value = '';
                document.getElementById('adminPassword').value = '';
            };
        }
        
        const addBtn = document.getElementById('addProductBtn');
        if (addBtn) {
            addBtn.onclick = () => {
                const name = document.getElementById('newName').value;
                const price = document.getElementById('newPrice').value;
                const image = document.getElementById('newImage').value;
                if (name && price) {
                    addProduct(name, price, image);
                    document.getElementById('newName').value = '';
                    document.getElementById('newPrice').value = '';
                    document.getElementById('newImage').value = '';
                }
            };
        }
    }
}

// ========== YÜKLƏMƏ ==========
window.onload = () => {
    const stored = localStorage.getItem('products');
    if (stored) {
        products = JSON.parse(stored);
    } else {
        products = [
            { id: 1, name: "Pambıq köynək", price: 25, image: "https://via.placeholder.com/200" },
            { id: 2, name: "Cins şalvar", price: 45, image: "https://via.placeholder.com/200" },
            { id: 3, name: "İdman ayaqqabısı", price: 60, image: "https://via.placeholder.com/200" }
        ];
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    renderProducts();
    updateCartCount();
    renderCartModal();
    setupCartModal();
    setupSearch();
    setupAdmin();
    setupContactForm();
};