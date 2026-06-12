// ========== MAĞAZA SCRIPTİ – API İLƏ (BÜTÜN CİHAZLARDA EYNİ) ==========
console.log("✅ Script yükləndi");

// 🔴 BURANı ÖZ API URL-İN İLƏ DƏYİŞ! 🔴
// Məsələn: https://652f913a123456.mockapi.io/api/v1/products
const API_URL = '[{"createdAt":"2026-06-12T13:41:58.863Z","name":"name 1","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/74.jpg","price":10,"image":"image 1","id":"1"},{"createdAt":"2026-06-12T20:41:54.365Z","name":"name 2","avatar":"https://avatars.githubusercontent.com/u/20630468","price":54,"image":"image 2","id":"2"},{"createdAt":"2026-06-12T20:03:47.323Z","name":"name 3","avatar":"https://avatars.githubusercontent.com/u/25008885","price":52,"image":"image 3","id":"3"},{"createdAt":"2026-06-12T12:39:37.849Z","name":"name 4","avatar":"https://avatars.githubusercontent.com/u/3394706","price":15,"image":"image 4","id":"4"},{"createdAt":"2026-06-12T08:38:28.571Z","name":"name 5","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/30.jpg","price":28,"image":"image 5","id":"5"},{"createdAt":"2026-06-12T09:15:06.972Z","name":"name 6","avatar":"https://avatars.githubusercontent.com/u/23955673","price":6,"image":"image 6","id":"6"},{"createdAt":"2026-06-12T17:45:53.063Z","name":"name 7","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/18.jpg","price":49,"image":"image 7","id":"7"},{"createdAt":"2026-06-11T22:41:05.124Z","name":"name 8","avatar":"https://avatars.githubusercontent.com/u/84863524","price":14,"image":"image 8","id":"8"},{"createdAt":"2026-06-12T19:52:55.538Z","name":"name 9","avatar":"https://avatars.githubusercontent.com/u/7532513","price":13,"image":"image 9","id":"9"},{"createdAt":"2026-06-12T03:51:22.528Z","name":"name 10","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/63.jpg","price":9,"image":"image 10","id":"10"},{"createdAt":"2026-06-12T01:27:01.571Z","name":"name 11","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/17.jpg","price":62,"image":"image 11","id":"11"},{"createdAt":"2026-06-11T21:27:24.190Z","name":"name 12","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/65.jpg","price":100,"image":"image 12","id":"12"},{"createdAt":"2026-06-12T11:09:47.206Z","name":"name 13","avatar":"https://avatars.githubusercontent.com/u/42572942","price":37,"image":"image 13","id":"13"},{"createdAt":"2026-06-12T02:51:58.833Z","name":"name 14","avatar":"https://avatars.githubusercontent.com/u/86312113","price":15,"image":"image 14","id":"14"},{"createdAt":"2026-06-12T01:42:39.162Z","name":"name 15","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/84.jpg","price":44,"image":"image 15","id":"15"},{"createdAt":"2026-06-12T15:38:59.898Z","name":"name 16","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/7.jpg","price":40,"image":"image 16","id":"16"},{"createdAt":"2026-06-12T16:34:02.878Z","name":"name 17","avatar":"https://avatars.githubusercontent.com/u/20249374","price":17,"image":"image 17","id":"17"},{"createdAt":"2026-06-12T00:05:28.378Z","name":"name 18","avatar":"https://avatars.githubusercontent.com/u/71621242","price":66,"image":"image 18","id":"18"},{"createdAt":"2026-06-12T12:56:43.055Z","name":"name 19","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/10.jpg","price":50,"image":"image 19","id":"19"},{"createdAt":"2026-06-12T17:42:21.440Z","name":"name 20","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/34.jpg","price":24,"image":"image 20","id":"20"},{"createdAt":"2026-06-12T14:03:17.408Z","name":"name 21","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/35.jpg","price":95,"image":"image 21","id":"21"},{"createdAt":"2026-06-12T03:49:59.348Z","name":"name 22","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/36.jpg","price":4,"image":"image 22","id":"22"},{"createdAt":"2026-06-11T23:58:38.258Z","name":"name 23","avatar":"https://avatars.githubusercontent.com/u/69860253","price":66,"image":"image 23","id":"23"},{"createdAt":"2026-06-12T20:27:08.223Z","name":"name 24","avatar":"https://avatars.githubusercontent.com/u/77691100","price":33,"image":"image 24","id":"24"},{"createdAt":"2026-06-12T14:10:28.886Z","name":"name 25","avatar":"https://avatars.githubusercontent.com/u/21425308","price":89,"image":"image 25","id":"25"},{"createdAt":"2026-06-12T08:06:09.159Z","name":"name 26","avatar":"https://avatars.githubusercontent.com/u/49706847","price":72,"image":"image 26","id":"26"},{"createdAt":"2026-06-11T22:02:13.614Z","name":"name 27","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/88.jpg","price":1,"image":"image 27","id":"27"},{"createdAt":"2026-06-12T00:15:23.803Z","name":"name 28","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/78.jpg","price":1,"image":"image 28","id":"28"},{"createdAt":"2026-06-12T21:09:46.397Z","name":"name 29","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/32.jpg","price":35,"image":"image 29","id":"29"},{"createdAt":"2026-06-12T08:16:48.915Z","name":"name 30","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/83.jpg","price":23,"image":"image 30","id":"30"},{"createdAt":"2026-06-12T04:30:41.999Z","name":"name 31","avatar":"https://avatars.githubusercontent.com/u/38512025","price":56,"image":"image 31","id":"31"},{"createdAt":"2026-06-12T20:20:14.805Z","name":"name 32","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/41.jpg","price":8,"image":"image 32","id":"32"},{"createdAt":"2026-06-12T09:56:14.121Z","name":"name 33","avatar":"https://avatars.githubusercontent.com/u/99741102","price":39,"image":"image 33","id":"33"},{"createdAt":"2026-06-11T21:53:22.878Z","name":"name 34","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/79.jpg","price":74,"image":"image 34","id":"34"},{"createdAt":"2026-06-12T12:32:59.097Z","name":"name 35","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/23.jpg","price":28,"image":"image 35","id":"35"},{"createdAt":"2026-06-12T03:31:48.592Z","name":"name 36","avatar":"https://avatars.githubusercontent.com/u/58395782","price":31,"image":"image 36","id":"36"},{"createdAt":"2026-06-11T22:01:08.173Z","name":"name 37","avatar":"https://avatars.githubusercontent.com/u/84242534","price":56,"image":"image 37","id":"37"},{"createdAt":"2026-06-12T06:32:42.671Z","name":"name 38","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/52.jpg","price":78,"image":"image 38","id":"38"},{"createdAt":"2026-06-12T17:55:55.586Z","name":"name 39","avatar":"https://avatars.githubusercontent.com/u/91068542","price":37,"image":"image 39","id":"39"},{"createdAt":"2026-06-12T06:19:54.324Z","name":"name 40","avatar":"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/31.jpg","price":83,"image":"image 40","id":"40"}]';

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
    
    // EmailJS-i config-dən başlat
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
        
        // EmailJS aktivdirsə göndər
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
            // EmailJS yoxdursa sadəcə xəbərdarlıq
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
