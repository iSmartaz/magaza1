// ========== MAĞAZA SCRIPTİ – API İLƏ (BÜTÜN CİHAZLARDA EYNİ) ==========
console.log("✅ Script yükləndi");

// 🔴 ÖZ API URL-İN (MockAPI-dən kopyaladığın link)
const API_URL = 'https://6a2c76683e2b60ab038fc741.mockapi.io/products';

let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ========== API FUNKSİYALARI ==========
async function loadProducts() {
    try {
        console.log("Məhsullar API-dən yüklənir...");
        const response = await fetch(API_URL);
        products = await response.json();
        console.log("Yükləndi:", products.length, "məhsul");
        
        if (products.length === 0) {
            console.log("Məhsul yoxdur, default məhsullar əlavə edilir...");
            await addDefaultProducts();
            await loadProducts();
            return;
        }
        
        renderProducts();
        renderAdminProducts();
        updateCartCount();
    } catch (error) {
        console.error('API xətası:', error);
        alert('Məhsullar yüklənərkən xəta baş verdi! İnternet bağlantınızı yoxlayın.');
    }
}

async function addDefaultProducts() {
    const defaults = [
        { name: "Pambıq köynək", price: 25, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200" },
        { name: "Cins şalvar", price: 45, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200" },
        { name: "İdman ayaqqabısı", price: 60, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200" },
        { name: "Ağıllı saat", price: 120, image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=200" },
        { name: "Qulaqlıq", price: 35, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" },
        { name: "Powerbank", price: 28, image: "https://images.unsplash.com/photo-1609592426548-909a1ae9a8e8?w=200" }
    ];
    
    for (const product of defaults) {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
    }
    console.log("Default məhsullar əlavə edildi");
}

async function addProductToAPI(name, price, image) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            name: name, 
            price: parseFloat(price), 
            image: image || 'https://via.placeholder.com/200' 
        })
    });
    return response.json();
}

async function updateProductInAPI(id, name, price, image) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, image })
    });
}

async function deleteProductFromAPI(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
}

// ========== SƏBƏT FUNKSİYALARI ==========
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartTotal();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('#cartCount').forEach(el => {
        if (el) el.textContent = count;
    });
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = total.toFixed(2);
}

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

function addToCart(productId) {
    const product = products.find(p => p.id == productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id == productId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    renderCartModal();
    alert(`🛒 ${product.name} səbətə əlavə edildi!`);
}

function clearCart() {
    if (confirm("Səbəti təmizləmək istədiyinizdən əminsiniz?")) {
        cart = [];
        saveCart();
        renderCartModal();
        alert("Səbət təmizləndi!");
    }
}

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

// ========== MƏHSULLARI GÖSTƏR ==========
function renderProducts(searchTerm = '') {
    const container = document.getElementById('product-list');
    const featuredContainer = document.getElementById('featured-products');
    
    let filtered = products;
    if (searchTerm) {
        filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    const html = filtered.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200'">
            <h3>${product.name}</h3>
            <p class="price">${product.price.toFixed(2)} AZN</p>
            <button onclick="addToCart(${product.id})"><i class="fas fa-cart-plus"></i> Səbətə at</button>
        </div>
    `).join('');
    
    if (container) container.innerHTML = html;
    if (featuredContainer) {
        featuredContainer.innerHTML = filtered.slice(0, 4).map(product => `
            <div class="product-card">
                <img src="${product.image}" onerror="this.src='https://via.placeholder.com/200'">
                <h3>${product.name}</h3>
                <p class="price">${product.price.toFixed(2)} AZN</p>
                <button onclick="addToCart(${product.id})">Al</button>
            </div>
        `).join('');
    }
}

// ========== ADMIN PANEL FUNKSİYALARI ==========
function renderAdminProducts() {
    const container = document.getElementById('adminProductList');
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<p>Heç bir məhsul yoxdur</p>';
        return;
    }
    
    container.innerHTML = products.map(p => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #ddd;">
            <div>
                <strong>${p.name}</strong> - ${p.price.toFixed(2)} AZN
                <br><small style="font-size: 11px; color: #888;">${p.image?.substring(0, 40) || 'şəkil yoxdur'}...</small>
            </div>
            <div>
                <button onclick="editProduct(${p.id})" style="background: #3498db; color: white; border: none; padding: 5px 12px; border-radius: 5px; cursor: pointer; margin-right: 5px;"><i class="fas fa-edit"></i> Redaktə</button>
                <button onclick="deleteProduct(${p.id})" style="background: #e74c3c; color: white; border: none; padding: 5px 12px; border-radius: 5px; cursor: pointer;"><i class="fas fa-trash"></i> Sil</button>
            </div>
        </div>
    `).join('');
}

async function addProduct(name, price, image) {
    if (!name || !price) {
        alert("Məhsul adı və qiymət daxil edin!");
        return false;
    }
    
    try {
        await addProductToAPI(name, price, image);
        await loadProducts();
        document.getElementById('newName').value = '';
        document.getElementById('newPrice').value = '';
        if (document.getElementById('newImage')) document.getElementById('newImage').value = '';
        alert(`✅ "${name}" məhsulu əlavə edildi!`);
        return true;
    } catch (error) {
        alert('Xəta: Məhsul əlavə edilərkən problem oldu!');
        return false;
    }
}

async function editProduct(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;
    
    const newName = prompt('Yeni ad:', product.name);
    const newPrice = prompt('Yeni qiymət (AZN):', product.price);
    const newImage = prompt('Şəkil linki:', product.image);
    
    if (newName && newPrice) {
        try {
            await updateProductInAPI(id, newName, parseFloat(newPrice), newImage || product.image);
            await loadProducts();
            alert("✅ Məhsul yeniləndi!");
        } catch (error) {
            alert('Xəta: Məhsul yenilənərkən problem oldu!');
        }
    }
}

async function deleteProduct(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;
    
    if (confirm(`"${product.name}" silinsin?`)) {
        try {
            await deleteProductFromAPI(id);
            cart = cart.filter(item => item.id != id);
            saveCart();
            await loadProducts();
            alert("✅ Məhsul silindi!");
        } catch (error) {
            alert('Xəta: Məhsul silinərkən problem oldu!');
        }
    }
}

// ========== AXTARIŞ ==========
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        renderProducts(e.target.value);
    });
}

// ========== ADMIN LOGIN ==========
function setupAdmin() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginSection = document.getElementById('loginSection');
    const adminPanel = document.getElementById('adminPanel');
    
    if (!loginBtn) return;
    
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
            } else {
                alert("Məhsul adı və qiymət daxil edin!");
            }
        };
    }
}

// ========== MOBİL MENYU ==========
function setupMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.onclick = () => {
            navLinks.classList.toggle('show');
        };
    }
}

// ========== SƏBƏT MODAL ==========
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

// ========== NEWSLETTER ==========
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

// ========== EMAILJS İLƏ ƏLAQƏ ==========
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    if (window.CONFIG && window.CONFIG.EMAILJS_PUBLIC_KEY && window.CONFIG.EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY_HERE") {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(window.CONFIG.EMAILJS_PUBLIC_KEY);
        }
    }
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const status = document.getElementById('formStatus');
        status.textContent = 'Göndərilir...';
        status.style.color = 'orange';
        
        if (window.CONFIG && window.CONFIG.EMAILJS_SERVICE_ID && window.CONFIG.EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID_HERE" && typeof emailjs !== 'undefined') {
            const templateParams = {
                from_name: document.getElementById('userName')?.value,
                from_email: document.getElementById('userEmail')?.value,
                message: document.getElementById('message')?.value
            };
            
            emailjs.send(window.CONFIG.EMAILJS_SERVICE_ID, window.CONFIG.EMAILJS_TEMPLATE_ID, templateParams)
                .then(() => {
                    status.innerHTML = '✅ Mesajınız göndərildi!';
                    status.style.color = 'green';
                    form.reset();
                })
                .catch(() => {
                    status.innerHTML = '✅ Mesajınız qeydə alındı!';
                    status.style.color = 'green';
                    form.reset();
                });
        } else {
            setTimeout(() => {
                status.innerHTML = '✅ Mesajınız qəbul edildi! Tezliklə cavab verəcəyik.';
                status.style.color = 'green';
                form.reset();
            }, 1000);
        }
    });
}

// ========== SƏHİFƏ YÜKLƏNƏNDƏ ==========
window.onload = async () => {
    console.log("Səhifə yükləndi");
    await loadProducts();
    updateCartCount();
    setupAdmin();
    setupSearch();
    setupCartModal();
    setupMobileMenu();
    setupNewsletter();
    setupContactForm();
};
