// ========== MAĞAZA SCRIPTİ – TAM İŞLƏK VERSİYA ==========
console.log("✅ Script yükləndi");

// Default məhsullar
const DEFAULT_PRODUCTS = [
    { id: 1, name: "Pambıq köynək", price: 25, image: "https://via.placeholder.com/200" },
    { id: 2, name: "Cins şalvar", price: 45, image: "https://via.placeholder.com/200" },
    { id: 3, name: "İdman ayaqqabısı", price: 60, image: "https://via.placeholder.com/200" }
];

// Məhsulları yüklə
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let isAdminLoggedIn = false;

// Məhsulları localStorage-dan yüklə
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
    console.log("Məhsullar saxlanıldı");
}

// Səbəti yadda saxla
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Səbət sayını yenilə
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(el => {
        if (el) el.textContent = count;
    });
}

// Məhsulları göstər (ana səhifə və mehsullar səhifəsi üçün)
function renderProducts() {
    const container = document.getElementById('product-list');
    const featuredContainer = document.getElementById('featured-products');
    
    if (!container && !featuredContainer) return;
    
    const html = products.map(product => `
        <div class="product-card">
            <img src="${product.image || 'https://via.placeholder.com/200'}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price} AZN</p>
            <button onclick="addToCart(${product.id})">🛒 Səbətə at</button>
        </div>
    `).join('');
    
    if (container) container.innerHTML = html;
    if (featuredContainer) featuredContainer.innerHTML = products.slice(0, 3).map(product => `
        <div class="product-card">
            <img src="${product.image || 'https://via.placeholder.com/200'}">
            <h3>${product.name}</h3>
            <p class="price">${product.price} AZN</p>
            <button onclick="addToCart(${product.id})">Al</button>
        </div>
    `).join('');
    
    // Admin panelindəki siyahını da yenilə
    renderAdminProducts();
}

// Admin panelində məhsul siyahısını göstər
function renderAdminProducts() {
    const container = document.getElementById('adminProductList');
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<p>Hələ məhsul yoxdur</p>';
        return;
    }
    
    container.innerHTML = products.map(p => `
        <div style="border:1px solid #ddd; padding:10px; margin:10px 0; border-radius:5px;">
            <strong>${p.name}</strong> - ${p.price} AZN
            <button onclick="editProduct(${p.id})" style="margin-left:10px;">✏️ Redaktə et</button>
            <button onclick="deleteProduct(${p.id})" style="background:red; color:white; margin-left:5px;">❌ Sil</button>
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
    const newProduct = {
        id: newId,
        name: name,
        price: parseFloat(price),
        image: image || 'https://via.placeholder.com/200'
    };
    
    products.push(newProduct);
    saveProducts();
    renderProducts();
    console.log("Məhsul əlavə edildi:", newProduct);
    alert(`"${name}" məhsulu əlavə edildi!`);
    return true;
}

// Məhsul redaktə et
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const newName = prompt('Yeni ad:', product.name);
    const newPrice = prompt('Yeni qiymət (AZN):', product.price);
    const newImage = prompt('Şəkil linki (boş buraxa bilərsən):', product.image);
    
    if (newName) product.name = newName;
    if (newPrice) product.price = parseFloat(newPrice);
    if (newImage && newImage.trim()) product.image = newImage;
    
    saveProducts();
    renderProducts();
    alert("Məhsul yeniləndi!");
}

// Məhsul sil
function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    if (confirm(`"${product.name}" məhsulunu silmək istədiyinizdən əminsiniz?`)) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        renderProducts();
        // Səbətdən də sil
        cart = cart.filter(item => item.id !== id);
        saveCart();
        alert("Məhsul silindi!");
    }
}

// Səbətə əlavə et
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
    alert(`${product.name} səbətə əlavə edildi!`);
}

// Admin login (sadə versiya)
function setupAdmin() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginSection = document.getElementById('loginSection');
    const adminPanel = document.getElementById('adminPanel');
    
    if (!loginBtn) return;
    
    // Əvvəlki login statusunu yoxla
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        if (loginSection) loginSection.style.display = 'none';
        if (adminPanel) adminPanel.style.display = 'block';
        isAdminLoggedIn = true;
        renderAdminProducts();
    }
    
    loginBtn.onclick = function() {
        const username = document.getElementById('adminUsername')?.value;
        const password = document.getElementById('adminPassword')?.value;
        const errorEl = document.getElementById('loginError');
        
        if (username === 'admin' && password === 'admin123') {
            isAdminLoggedIn = true;
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
        logoutBtn.onclick = function() {
            isAdminLoggedIn = false;
            localStorage.removeItem('adminLoggedIn');
            if (loginSection) loginSection.style.display = 'block';
            if (adminPanel) adminPanel.style.display = 'none';
            if (document.getElementById('adminUsername')) document.getElementById('adminUsername').value = '';
            if (document.getElementById('adminPassword')) document.getElementById('adminPassword').value = '';
        };
    }
    
    // Məhsul əlavə etmə düyməsi
    const addBtn = document.getElementById('addProductBtn');
    if (addBtn) {
        addBtn.onclick = function() {
            const name = document.getElementById('newName')?.value;
            const price = document.getElementById('newPrice')?.value;
            const image = document.getElementById('newImage')?.value;
            
            if (name && price) {
                addProduct(name, price, image);
                document.getElementById('newName').value = '';
                document.getElementById('newPrice').value = '';
                if (document.getElementById('newImage')) document.getElementById('newImage').value = '';
            } else {
                alert("Məhsul adı və qiymət daxil edin!");
            }
        };
    }
}

// Axtarış funksiyası
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const container = document.getElementById('product-list');
        if (!container) return;
        
        const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm));
        container.innerHTML = filtered.map(product => `
            <div class="product-card">
                <img src="${product.image || 'https://via.placeholder.com/200'}">
                <h3>${product.name}</h3>
                <p class="price">${product.price} AZN</p>
                <button onclick="addToCart(${product.id})">🛒 Səbətə at</button>
            </div>
        `).join('');
    });
}

// Səhifə yüklənəndə
window.onload = function() {
    console.log("window.onload işlədi");
    loadProducts();
    renderProducts();
    updateCartCount();
    setupAdmin();
    setupSearch();
    
    // Səbət modal əgər varsa
    const cartBtn = document.getElementById('cartBtn');
    const modal = document.getElementById('cartModal');
    const closeBtn = document.querySelector('.close');
    
    if (cartBtn && modal) {
        cartBtn.onclick = () => modal.style.display = 'block';
        if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
        window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };
    }
    
    console.log("Bütün funksiyalar işə salındı");
};
