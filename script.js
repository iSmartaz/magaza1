// ========== MAĞAZA SCRIPTİ – PROFESSIONAL VERSİYA ==========
console.log("✅ Script yükləndi");

// Default məhsullar
const DEFAULT_PRODUCTS = [
    { id: 1, name: "Pambıq köynək", price: 25, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200" },
    { id: 2, name: "Cins şalvar", price: 45, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200" },
    { id: 3, name: "İdman ayaqqabısı", price: 60, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200" }
];

let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Məhsulları yüklə
function loadProducts() {
    const stored = localStorage.getItem('products');
    if (stored) {
        products = JSON.parse(stored);
    } else {
        products = [...DEFAULT_PRODUCTS];
        localStorage.setItem('products', JSON.stringify(products));
    }
    console.log("Məhsullar yükləndi:", products.length);
}

// Məhsulları yadda saxla
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Səbəti yadda saxla
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartTotal();
}

// Səbət sayını yenilə
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('#cartCount').forEach(el => {
        if (el) el.textContent = count;
    });
}

// Səbət cəmini yenilə
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = total.toFixed(2);
}

// Səbət modalını render et
function renderCartModal() {
    const container = document.getElementById('cart-items');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center;">Səbətiniz boşdur 😢</p>';
        updateCartTotal();
        return;
    }
    
    container.innerHTML = '';
    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                <small>${item.price} AZN</small>
            </div>
            <div>
                <button class="cart-qty-down" data-index="${index}">-</button>
                <span style="margin:0 10px;">${item.quantity}</span>
                <button class="cart-qty-up" data-index="${index}">+</button>
                <button class="cart-remove" data-index="${index}" style="background:#e74c3c; color:white; margin-left:10px;">🗑️</button>
            </div>
        `;
        container.appendChild(div);
    });
    
    updateCartTotal();
    
    // Event listeners
    document.querySelectorAll('.cart-qty-down').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.index);
            if (cart[idx].quantity > 1) cart[idx].quantity--;
            else cart.splice(idx, 1);
            saveCart();
            renderCartModal();
            renderProducts();
        };
    });
    
    document.querySelectorAll('.cart-qty-up').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.index);
            cart[idx].quantity++;
            saveCart();
            renderCartModal();
            renderProducts();
        };
    });
    
    document.querySelectorAll('.cart-remove').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.index);
            cart.splice(idx, 1);
            saveCart();
            renderCartModal();
            renderProducts();
        };
    });
}

// Məhsulları göstər
function renderProducts() {
    const container = document.getElementById('product-list');
    const featuredContainer = document.getElementById('featured-products');
    
    if (!container && !featuredContainer) return;
    
    const html = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200'">
            <h3>${product.name}</h3>
            <p class="price">${product.price.toFixed(2)} AZN</p>
            <button onclick="addToCart(${product.id})"><i class="fas fa-cart-plus"></i> Səbətə at</button>
        </div>
    `).join('');
    
    if (container) container.innerHTML = html;
    if (featuredContainer) featuredContainer.innerHTML = products.slice(0, 4).map(product => `
        <div class="product-card">
            <img src="${product.image}" onerror="this.src='https://via.placeholder.com/200'">
            <h3>${product.name}</h3>
            <p class="price">${product.price.toFixed(2)} AZN</p>
            <button onclick="addToCart(${product.id})">Al</button>
        </div>
    `).join('');
    
    renderAdminProducts();
}

// Admin məhsul siyahısı
function renderAdminProducts() {
    const container = document.getElementById('adminProductList');
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<p>Heç bir məhsul yoxdur</p>';
        return;
    }
    
    container.innerHTML = products.map(p => `
        <div class="admin-product-item">
            <div>
                <strong>${p.name}</strong> - ${p.price.toFixed(2)} AZN
                <br><small>${p.image}</small>
            </div>
            <div>
                <button onclick="editProduct(${p.id})" class="btn-edit"><i class="fas fa-edit"></i> Redaktə</button>
                <button onclick="deleteProduct(${p.id})" class="btn-delete"><i class="fas fa-trash"></i> Sil</button>
            </div>
        </div>
    `).join('');
}

// Məhsul əlavə et
function addProduct(name, price, image) {
    if (!name || !price) {
        alert("Məhsul adı və qiymət daxil edin!");
        return false;
    }
    
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    products.push({
        id: newId,
        name: name,
        price: parseFloat(price),
        image: image || 'https://via.placeholder.com/200'
    });
    
    saveProducts();
    renderProducts();
    alert(`✅ "${name}" məhsulu əlavə edildi!`);
    return true;
}

// Məhsul redaktə et
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const newName = prompt('Yeni ad:', product.name);
    const newPrice = prompt('Yeni qiymət (AZN):', product.price);
    const newImage = prompt('Şəkil linki:', product.image);
    
    if (newName) product.name = newName;
    if (newPrice) product.price = parseFloat(newPrice);
    if (newImage) product.image = newImage;
    
    saveProducts();
    renderProducts();
    alert("✅ Məhsul yeniləndi!");
}

// Məhsul sil
function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    if (confirm(`"${product.name}" silinsin?`)) {
        products = products.filter(p => p.id !== id);
        cart = cart.filter(item => item.id !== id);
        saveProducts();
        saveCart();
        renderProducts();
        alert("✅ Məhsul silindi!");
    }
}

// Səbətə əlavə et
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    renderCartModal();
    alert(`🛒 ${product.name} səbətə əlavə edildi!`);
}

// Səbəti təmizlə
function clearCart() {
    if (confirm("Səbəti təmizləmək istədiyinizdən əminsiniz?")) {
        cart = [];
        saveCart();
        renderCartModal();
        alert("Səbət təmizləndi!");
    }
}

// Sifarişi tamamla
function checkout() {
    if (cart.length === 0) {
        alert("Səbətiniz boşdur!");
        return;
    }
    alert("🎉 Sifarişiniz qəbul edildi! Təşəkkür edirik!");
    cart = [];
    saveCart();
    renderCartModal();
}

// Axtarış
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        const term = e.target.value.toLowerCase();
        const container = document.getElementById('product-list');
        if (!container) return;
        
        const filtered = products.filter(p => p.name.toLowerCase().includes(term));
        container.innerHTML = filtered.map(product => `
            <div class="product-card">
                <img src="${product.image}" onerror="this.src='https://via.placeholder.com/200'">
                <h3>${product.name}</h3>
                <p class="price">${product.price.toFixed(2)} AZN</p>
                <button onclick="addToCart(${product.id})">🛒 Səbətə at</button>
            </div>
        `).join('');
    });
}

// Admin login
function setupAdmin() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginSection = document.getElementById('loginSection');
    const adminPanel = document.getElementById('adminPanel');
    
    if (!loginBtn) return;
    
    // Əvvəlki login statusu
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        if (loginSection) loginSection.style.display = 'none';
        if (adminPanel) adminPanel.style.display = 'block';
        renderAdminProducts();
    }
    
    loginBtn.onclick = () => {
        const username = document.getElementById('adminUsername')?.value;
        const password = document.getElementById('adminPassword')?.value;
        const errorEl = document.getElementById('loginError');
        
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('adminLoggedIn', 'true');
            if (loginSection) loginSection.style.display = 'none';
            if (adminPanel) adminPanel.style.display = 'block';
            if (errorEl) errorEl.textContent = '';
            renderAdminProducts();
        } else {
            if (errorEl) errorEl.textContent = '❌ İstifadəçi adı və ya parol yanlış!';
        }
    };
    
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem('adminLoggedIn');
            if (loginSection) loginSection.style.display = 'block';
            if (adminPanel) adminPanel.style.display = 'none';
        };
    }
    
    const addBtn = document.getElementById('addProductBtn');
    if (addBtn) {
        addBtn.onclick = () => {
            const name = document.getElementById('newName')?.value;
            const price = document.getElementById('newPrice')?.value;
            const image = document.getElementById('newImage')?.value;
            if (name && price) {
                addProduct(name, price, image);
                document.getElementById('newName').value = '';
                document.getElementById('newPrice').value = '';
                if (document.getElementById('newImage')) document.getElementById('newImage').value = '';
            }
        };
    }
}

// Mobil menyu
function setupMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.onclick = () => {
            navLinks.classList.toggle('show');
        };
    }
}

// Səbət modal
function setupCartModal() {
    const cartBtn = document.getElementById('cartBtn');
    const modal = document.getElementById('cartModal');
    const closeBtn = document.querySelector('.close');
    const clearBtn = document.getElementById('clearCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cartBtn && modal) {
        cartBtn.onclick = () => {
            renderCartModal();
            modal.style.display = 'block';
        };
        if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
        window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
    }
    
    if (clearBtn) clearBtn.onclick = clearCart;
    if (checkoutBtn) checkoutBtn.onclick = checkout;
}

// Newsletter
function setupNewsletter() {
    const newsletterBtn = document.getElementById('newsletterBtn');
    if (newsletterBtn) {
        newsletterBtn.onclick = () => {
            const email = document.getElementById('newsletterEmail')?.value;
            if (email) {
                alert(`✅ ${email} ünvanı abunə edildi!`);
                document.getElementById('newsletterEmail').value = '';
            } else {
                alert("Zəhmət olmasa e-poçt daxil edin!");
            }
        };
    }
}

// EmailJS ilə əlaqə (opsional)
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const status = document.getElementById('formStatus');
        status.textContent = 'Göndərilir...';
        status.style.color = 'orange';
        
        // EmailJS konfiqurasiya edilməyibsə, sadəcə xəbərdarlıq
        setTimeout(() => {
            status.innerHTML = '✅ Mesajınız qəbul edildi! Tezliklə cavab verəcəyik.';
            status.style.color = 'green';
            form.reset();
        }, 1000);
    });
}

// ========== SƏHİFƏ YÜKLƏNƏNDƏ ==========
window.onload = () => {
    console.log("Səhifə yükləndi");
    loadProducts();
    renderProducts();
    updateCartCount();
    setupAdmin();
    setupSearch();
    setupCartModal();
    setupMobileMenu();
    setupNewsletter();
    setupContactForm();
};
