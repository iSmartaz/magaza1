// ========== MAĞAZA SCRIPTİ – FULL VERSİYA ==========
console.log("✅ Script yükləndi");

// API Konfiqurasiyası
const API_URL = 'https://6a2c76683e2b60ab038fc741.mockapi.io/products';

let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCategory = 'all';
let currentSort = 'default';
let currentPage = 1;
const itemsPerPage = 8;

// Toast bildirişi
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    if (isError) toast.classList.add('error');
    else toast.classList.remove('error');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Loading göstər/gizlət
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = show ? 'flex' : 'none';
}

// ========== API FUNKSİYALARI ==========
async function loadProducts() {
    showLoading(true);
    try {
        console.log("Məhsullar API-dən yüklənir...");
        const response = await fetch(API_URL);
        products = await response.json();
        console.log("Yükləndi:", products.length, "məhsul");
        
        if (products.length === 0) {
            await addDefaultProducts();
            await loadProducts();
            return;
        }
        
        // Məhsullara kateqoriya əlavə et (nümunə üçün)
        products = products.map((p, index) => ({
            ...p,
            category: index % 3 === 0 ? 'electronics' : (index % 3 === 1 ? 'clothing' : 'accessories'),
            rating: (Math.random() * 2 + 3).toFixed(1),
            discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0
        }));
        
        renderFilteredProducts();
        renderAdminProducts();
        updateCartCount();
    } catch (error) {
        console.error('API xətası:', error);
        showToast('Məhsullar yüklənərkən xəta baş verdi!', true);
    } finally {
        showLoading(false);
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

// ========== FILTRASIYA VƏ SIRALAMA ==========
function filterProducts() {
    let filtered = [...products];
    
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    
    return filtered;
}

function sortProducts(productsToSort) {
    const sorted = [...productsToSort];
    
    switch(currentSort) {
        case 'price-asc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            break;
    }
    
    return sorted;
}

function paginateProducts(productsToPaginate) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return productsToPaginate.slice(start, end);
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationDiv = document.getElementById('pagination');
    if (!paginationDiv) return;
    
    if (totalPages <= 1) {
        paginationDiv.innerHTML = '';
        return;
    }
    
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    paginationDiv.innerHTML = html;
    
    document.querySelectorAll('#pagination button').forEach(btn => {
        btn.onclick = () => {
            currentPage = parseInt(btn.dataset.page);
            renderFilteredProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    });
}

function renderFilteredProducts(searchTerm = '') {
    let filtered = filterProducts();
    
    if (searchTerm) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    const totalItems = filtered.length;
    filtered = sortProducts(filtered);
    const paginated = paginateProducts(filtered);
    
    renderProducts(paginated);
    renderPagination(totalItems);
    renderFeaturedProducts(filtered.slice(0, 4));
}

function renderProducts(productsToRender) {
    const container = document.getElementById('product-list');
    if (!container) return;
    
    const html = productsToRender.map(product => {
        const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
        return `
        <div class="product-card" data-id="${product.id}">
            ${product.discount > 0 ? `<div class="discount-badge">-${product.discount}%</div>` : ''}
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200'">
            <div class="rating">
                ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                <span style="font-size:12px; color:#999;">(${product.rating})</span>
            </div>
            <h3>${product.name}</h3>
            <p class="price">
                ${discountedPrice.toFixed(2)} AZN
                ${product.discount > 0 ? `<span class="old-price">${product.price.toFixed(2)} AZN</span>` : ''}
            </p>
            <button onclick="addToCart(${product.id})"><i class="fas fa-cart-plus"></i> Səbətə at</button>
        </div>
    `}).join('');
    
    container.innerHTML = html;
}

function renderFeaturedProducts(productsToRender) {
    const container = document.getElementById('featured-products');
    if (!container) return;
    
    const html = productsToRender.map(product => `
        <div class="product-card">
            <img src="${product.image}" onerror="this.src='https://via.placeholder.com/200'">
            <h3>${product.name}</h3>
            <p class="price">${product.price.toFixed(2)} AZN</p>
            <button onclick="addToCart(${product.id})">Al</button>
        </div>
    `).join('');
    
    container.innerHTML = html;
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
        };
    });
    
    document.querySelectorAll('.cart-qty-up').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.index);
            cart[idx].quantity++;
            saveCart();
            renderCartModal();
        };
    });
    
    document.querySelectorAll('.cart-remove').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.index);
            cart.splice(idx, 1);
            saveCart();
            renderCartModal();
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
    showToast(`${product.name} səbətə əlavə edildi! 🛒`);
    
    // Səbətə əlavə animasiyası
    const btn = event?.target?.closest('button');
    if (btn) {
        btn.style.transform = 'scale(1.1)';
        setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);
    }
}

function clearCart() {
    if (confirm("Səbəti təmizləmək istədiyinizdən əminsiniz?")) {
        cart = [];
        saveCart();
        renderCartModal();
        showToast("Səbət təmizləndi!");
    }
}

function checkout() {
    if (cart.length === 0) {
        showToast("Səbətiniz boşdur!", true);
        return;
    }
    showToast("🎉 Sifarişiniz qəbul edildi! Təşəkkür edirik!");
    cart = [];
    saveCart();
    renderCartModal();
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
        showToast("Məhsul adı və qiymət daxil edin!", true);
        return false;
    }
    
    showLoading(true);
    try {
        await addProductToAPI(name, price, image);
        await loadProducts();
        document.getElementById('newName').value = '';
        document.getElementById('newPrice').value = '';
        if (document.getElementById('newImage')) document.getElementById('newImage').value = '';
        showToast(`✅ "${name}" məhsulu əlavə edildi!`);
        return true;
    } catch (error) {
        showToast('Xəta: Məhsul əlavə edilərkən problem oldu!', true);
        return false;
    } finally {
        showLoading(false);
    }
}

async function editProduct(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;
    
    const newName = prompt('Yeni ad:', product.name);
    const newPrice = prompt('Yeni qiymət (AZN):', product.price);
    const newImage = prompt('Şəkil linki:', product.image);
    
    if (newName && newPrice) {
        showLoading(true);
        try {
            await updateProductInAPI(id, newName, parseFloat(newPrice), newImage || product.image);
            await loadProducts();
            showToast("✅ Məhsul yeniləndi!");
        } catch (error) {
            showToast('Xəta: Məhsul yenilənərkən problem oldu!', true);
        } finally {
            showLoading(false);
        }
    }
}

async function deleteProduct(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;
    
    if (confirm(`"${product.name}" silinsin?`)) {
        showLoading(true);
        try {
            await deleteProductFromAPI(id);
            cart = cart.filter(item => item.id != id);
            saveCart();
            await loadProducts();
            showToast("✅ Məhsul silindi!");
        } catch (error) {
            showToast('Xəta: Məhsul silinərkən problem oldu!', true);
        } finally {
            showLoading(false);
        }
    }
}

// ========== AXTARIŞ ==========
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        currentPage = 1;
        renderFilteredProducts(e.target.value);
    });
}

// ========== FILTER EVENTLƏRİ ==========
function setupFilters() {
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.onclick = () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentCategory = chip.dataset.cat;
            currentPage = 1;
            renderFilteredProducts();
        };
    });
    
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.onchange = () => {
            currentSort = sortSelect.value;
            currentPage = 1;
            renderFilteredProducts();
        };
    }
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
            showToast("Admin panelə daxil oldunuz!");
        } else {
            if (errorEl) errorEl.textContent = '❌ İstifadəçi adı və ya parol yanlış!';
            showToast("İstifadəçi adı və ya parol yanlış!", true);
        }
    };
    
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem('adminLoggedIn');
            if (loginSection) loginSection.style.display = 'block';
            if (adminPanel) adminPanel.style.display = 'none';
            showToast("Admin panelindən çıxdınız!");
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
                showToast("Məhsul adı və qiymət daxil edin!", true);
            }
        };
    }
}

// ========== DARK MODE ==========
function setupDarkMode() {
    const darkModeBtn = document.getElementById('darkModeBtn');
    if (!darkModeBtn) return;
    
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    darkModeBtn.onclick = () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
        darkModeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    };
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
            if (email && email.includes('@')) {
                showToast(`✅ ${email} ünvanı abunə edildi!`);
                document.getElementById('newsletterEmail').value = '';
            } else {
                showToast("Zəhmət olmasa düzgün e-poçt daxil edin!", true);
            }
        };
    }
}

// ========== ƏLAQƏ FORMU ==========
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast("✅ Mesajınız qəbul edildi! Tezliklə cavab verəcəyik.");
        form.reset();
    });
}

// ========== SƏHİFƏ YÜKLƏNMƏ ==========
window.onload = async () => {
    console.log("Səhifə yükləndi");
    await loadProducts();
    updateCartCount();
    setupAdmin();
    setupSearch();
    setupFilters();
    setupCartModal();
    setupMobileMenu();
    setupNewsletter();
    setupContactForm();
    setupDarkMode();
};
