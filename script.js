// ========== MAĞAZA SCRIPTİ – BÜTÜN MƏLUMATLAR API-DƏ ==========
console.log("✅ Script yükləndi");

// ========== API KONFİQURASİYASI ==========
const API_URL = 'https://6a2c76683e2b60ab038fc741.mockapi.io/products';
const ORDERS_API_URL = 'https://6a2c76683e2b60ab038fc741.mockapi.io/orders';  // 🔴 ÖZ ORDERS URL-İN İLƏ DƏYİŞ

let products = [];
let orders = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCategory = 'all';
let currentSort = 'default';
let currentPage = 1;
let adminCurrentPage = 1;
const itemsPerPage = 8;
const adminItemsPerPage = 5;

// ========== TOAST BİLDİRİŞİ ==========
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    if (isError) toast.classList.add('error');
    else toast.classList.remove('error');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ========== LOADING SPINNER ==========
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = show ? 'flex' : 'none';
}

// ========== MƏHSULLAR API FUNKSİYALARI ==========
async function loadProducts() {
    showLoading(true);
    try {
        console.log("Məhsullar API-dən yüklənir...");
        const response = await fetch(API_URL);
        products = await response.json();
        
        if (products.length === 0) {
            await addDefaultProducts();
            const response2 = await fetch(API_URL);
            products = await response2.json();
        }
        
        products = products.map((p, index) => ({
            ...p,
            category: p.category || (index % 3 === 0 ? 'electronics' : (index % 3 === 1 ? 'clothing' : 'accessories')),
            rating: p.rating || (Math.random() * 2 + 3).toFixed(1),
            discount: p.discount || (Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0),
            stock: p.stock || Math.floor(Math.random() * 50) + 1,
            description: p.description || "Keyfiyyətli məhsul, sürətli çatdırılma."
        }));
        
        renderFilteredProducts();
        if (document.getElementById('adminProductList')) renderAdminTable();
        updateAdminStats();
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
        { name: "Pambıq köynək", price: 25, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200", category: "clothing", discount: 10, stock: 15 },
        { name: "Cins şalvar", price: 45, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200", category: "clothing", discount: 0, stock: 8 },
        { name: "İdman ayaqqabısı", price: 60, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200", category: "clothing", discount: 15, stock: 12 },
        { name: "Ağıllı saat", price: 120, image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=200", category: "electronics", discount: 5, stock: 20 },
        { name: "Qulaqlıq", price: 35, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200", category: "electronics", discount: 0, stock: 25 },
        { name: "Powerbank", price: 28, image: "https://images.unsplash.com/photo-1609592426548-909a1ae9a8e8?w=200", category: "electronics", discount: 20, stock: 30 }
    ];
    for (const product of defaults) {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
    }
}

async function addProductToAPI(name, price, image, category, discount, stock, description) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            name, price: parseFloat(price), 
            image: image || 'https://via.placeholder.com/200',
            category: category || 'electronics',
            discount: parseInt(discount) || 0,
            stock: parseInt(stock) || 10,
            description: description || ''
        })
    });
    return response.json();
}

async function updateProductInAPI(id, name, price, image, category, discount, stock, description) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price: parseFloat(price), image, category, discount: parseInt(discount), stock: parseInt(stock), description })
    });
}

async function deleteProductFromAPI(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
}

// ========== SİFARİŞLƏR API FUNKSİYALARI ==========
async function loadOrders() {
    try {
        const response = await fetch(ORDERS_API_URL);
        orders = await response.json();
        localStorage.setItem('orders_backup', JSON.stringify(orders));
        if (document.getElementById('ordersList')) renderOrdersTable();
        if (document.getElementById('adminStats')) updateAdminStats();
    } catch (error) {
        console.error('Orders API xətası:', error);
        const savedOrders = localStorage.getItem('orders_backup');
        if (savedOrders) orders = JSON.parse(savedOrders);
        if (document.getElementById('ordersList')) renderOrdersTable();
    }
}

async function addOrderToAPI(order) {
    const response = await fetch(ORDERS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
    });
    return response.json();
}

async function updateOrderStatusInAPI(orderId, newStatus) {
    await fetch(`${ORDERS_API_URL}/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });
}

async function deleteOrderFromAPI(orderId) {
    await fetch(`${ORDERS_API_URL}/${orderId}`, { method: 'DELETE' });
}

function renderOrdersTable() {
    const container = document.getElementById('ordersList');
    if (!container) return;
    
    if (orders.length === 0) {
        container.innerHTML = '<tr><td colspan="7" style="text-align:center;">Hələ sifariş yoxdur</td></tr>';
        return;
    }
    
    container.innerHTML = orders.slice(0, 20).map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customerName || 'Qonaq'}</td>
            <td>${new Date(order.date).toLocaleDateString('az')}</td>
            <td>${order.total.toFixed(2)} AZN</td>
            <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
            <td>
                <select onchange="updateOrderStatus(${order.id}, this.value)" class="status-select">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Gözləmədə</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Tamamlandı</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Ləğv edildi</option>
                </select>
            </td>
            <td>
                <button class="btn-icon" onclick="viewOrder(${order.id})"><i class="fas fa-eye"></i></button>
                <button class="btn-icon btn-delete" onclick="deleteOrder(${order.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function getStatusText(status) {
    const statuses = { 'pending': 'Gözləmədə', 'completed': 'Tamamlandı', 'cancelled': 'Ləğv edildi' };
    return statuses[status] || status;
}

async function updateOrderStatus(orderId, newStatus) {
    showLoading(true);
    try {
        await updateOrderStatusInAPI(orderId, newStatus);
        await loadOrders();
        showToast(`Sifariş #${orderId} statusu yeniləndi!`);
    } catch (error) {
        showToast('Xəta: Status yenilənərkən problem oldu!', true);
    } finally {
        showLoading(false);
    }
}

async function deleteOrder(orderId) {
    if (confirm('Sifarişi silmək istədiyinizdən əminsiniz?')) {
        showLoading(true);
        try {
            await deleteOrderFromAPI(orderId);
            await loadOrders();
            showToast('Sifariş silindi!');
        } catch (error) {
            showToast('Xəta: Sifariş silinərkən problem oldu!', true);
        } finally {
            showLoading(false);
        }
    }
}

function viewOrder(orderId) {
    const order = orders.find(o => o.id == orderId);
    if (order) {
        let itemsHtml = '';
        try {
            const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
            itemsHtml = items.map(item => `${item.name} x ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} AZN`).join('\n');
        } catch(e) { itemsHtml = order.items; }
        alert(`Sifariş #${orderId}\nMüştəri: ${order.customerName || 'Qonaq'}\nTarix: ${new Date(order.date).toLocaleString('az')}\nMəhsullar:\n${itemsHtml}\nÜmumi: ${order.total.toFixed(2)} AZN\nStatus: ${getStatusText(order.status)}`);
    }
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
            <div><strong>${item.name}</strong><br><small>${item.price} AZN</small></div>
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
    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });
    
    saveCart();
    renderCartModal();
    showToast(`${product.name} səbətə əlavə edildi! 🛒`);
}

async function checkout() {
    if (cart.length === 0) {
        showToast("Səbətiniz boşdur!", true);
        return;
    }
    
    showLoading(true);
    try {
        const newOrder = {
            id: Date.now(),
            customerName: localStorage.getItem('customerName') || 'Qonaq',
            items: JSON.stringify(cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity }))),
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        await addOrderToAPI(newOrder);
        await loadOrders();
        
        cart = [];
        saveCart();
        renderCartModal();
        showToast("🎉 Sifarişiniz qəbul edildi! Təşəkkür edirik!");
    } catch (error) {
        showToast('Xəta: Sifariş göndərilərkən problem oldu!', true);
    } finally {
        showLoading(false);
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

// ========== FİLTRASİYA VƏ SIRALAMA ==========
function filterProducts() {
    let filtered = [...products];
    if (currentCategory !== 'all') filtered = filtered.filter(p => p.category === currentCategory);
    return filtered;
}

function sortProducts(productsToSort) {
    const sorted = [...productsToSort];
    switch(currentSort) {
        case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
        case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
        case 'name-asc': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
        default: break;
    }
    return sorted;
}

function paginateProducts(productsToPaginate) {
    const start = (currentPage - 1) * itemsPerPage;
    return productsToPaginate.slice(start, start + itemsPerPage);
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationDiv = document.getElementById('pagination');
    if (!paginationDiv) return;
    if (totalPages <= 1) { paginationDiv.innerHTML = ''; return; }
    
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
    if (searchTerm) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
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
            <div class="rating">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}<span style="font-size:12px; color:#999;">(${product.rating})</span></div>
            <h3>${product.name}</h3>
            <p class="price">${discountedPrice.toFixed(2)} AZN${product.discount > 0 ? `<span class="old-price">${product.price.toFixed(2)} AZN</span>` : ''}</p>
            <button onclick="addToCart(${product.id})"><i class="fas fa-cart-plus"></i> Səbətə at</button>
        </div>`;
    }).join('');
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

// ========== AXTARIŞ ==========
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    searchInput.addEventListener('input', function(e) {
        currentPage = 1;
        renderFilteredProducts(e.target.value);
    });
}

// ========== FİLTRƏLƏR ==========
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
        menuToggle.onclick = () => navLinks.classList.toggle('show');
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
        cartBtn.onclick = () => { renderCartModal(); modal.style.display = 'block'; };
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

// ========== ADMIN PANEL ==========
function updateAdminStats() {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);
    const avgPrice = totalProducts > 0 ? (totalValue / totalProducts).toFixed(2) : 0;
    const discountedCount = products.filter(p => p.discount > 0).length;
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    
    const elements = {
        totalProducts, statTotalProducts: totalProducts, statAvgPrice: avgPrice + ' AZN',
        statTotalValue: totalValue.toFixed(2) + ' AZN', statDiscounted: discountedCount,
        totalOrders, totalSales: totalSales.toFixed(2) + ' AZN'
    };
    
    for (const [id, value] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }
}

function getCategoryName(cat) {
    const categories = { 'electronics': 'Elektronika', 'clothing': 'Geyim', 'accessories': 'Aksessuarlar' };
    return categories[cat] || 'Digər';
}

function renderAdminTable() {
    const container = document.getElementById('adminProductList');
    if (!container) return;
    const searchTerm = document.getElementById('adminSearch')?.value.toLowerCase() || '';
    let filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm));
    const totalPages = Math.ceil(filtered.length / adminItemsPerPage);
    const start = (adminCurrentPage - 1) * adminItemsPerPage;
    const paginated = filtered.slice(start, start + adminItemsPerPage);
    
    if (filtered.length === 0) {
        container.innerHTML = '<tr><td colspan="6" style="text-align:center;">Heç bir məhsul yoxdur</td></tr>';
        return;
    }
    
    container.innerHTML = paginated.map(p => `
        <tr>
            <td>${p.id}</td>
            <td><img src="${p.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" onerror="this.src='https://via.placeholder.com/50'"></td>
            <td><strong>${p.name}</strong>${p.discount > 0 ? `<br><span class="badge-discount">-${p.discount}%</span>` : ''}</td>
            <td>${p.price.toFixed(2)} AZN</td>
            <td><span class="badge-category">${getCategoryName(p.category)}</span></td>
            <td>
                <button class="btn-icon btn-edit" onclick="editProduct(${p.id})" title="Redaktə et"><i class="fas fa-edit"></i></button>
                <button class="btn-icon btn-delete" onclick="deleteProduct(${p.id})" title="Sil"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
    
    const paginationDiv = document.getElementById('adminPagination');
    if (paginationDiv && totalPages > 1) {
        let paginationHtml = '';
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `<button class="page-btn ${i === adminCurrentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        paginationDiv.innerHTML = paginationHtml;
        document.querySelectorAll('#adminPagination .page-btn').forEach(btn => {
            btn.onclick = () => { adminCurrentPage = parseInt(btn.dataset.page); renderAdminTable(); };
        });
    } else if (paginationDiv) { paginationDiv.innerHTML = ''; }
}

function setupAdminSearch() {
    const searchInput = document.getElementById('adminSearch');
    if (searchInput) searchInput.addEventListener('input', () => { adminCurrentPage = 1; renderAdminTable(); });
}

function setupAdminTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.onclick = () => {
            const tabId = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const activeTab = document.getElementById(`${tabId}Tab`);
            if (activeTab) activeTab.classList.add('active');
            if (tabId === 'orders') loadOrders();
            if (tabId === 'stats') initSalesChart();
        };
    });
}

function initSalesChart() {
    const canvas = document.getElementById('salesChart');
    if (!canvas || typeof Chart === 'undefined') return;
    
    const last6Months = [];
    const salesData = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        last6Months.push(date.toLocaleString('az', { month: 'short' }));
        const monthSales = orders.filter(o => new Date(o.date).getMonth() === date.getMonth()).reduce((sum, o) => sum + o.total, 0);
        salesData.push(monthSales);
    }
    
    new Chart(canvas, {
        type: 'line',
        data: { labels: last6Months, datasets: [{ label: 'Satış (AZN)', data: salesData, borderColor: '#e67e22', backgroundColor: 'rgba(230, 126, 34, 0.1)', fill: true, tension: 0.4 }] },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top' } } }
    });
}

function setupSettingsForm() {
    const form = document.getElementById('settingsForm');
    if (!form) return;
    const savedUsername = localStorage.getItem('adminUsername') || 'admin';
    const savedEmail = localStorage.getItem('adminEmail') || 'admin@magazam.az';
    if (document.getElementById('settingUsername')) document.getElementById('settingUsername').value = savedUsername;
    if (document.getElementById('settingEmail')) document.getElementById('settingEmail').value = savedEmail;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newUsername = document.getElementById('settingUsername')?.value;
        const newPassword = document.getElementById('settingPassword')?.value;
        const newPasswordConfirm = document.getElementById('settingPasswordConfirm')?.value;
        const newEmail = document.getElementById('settingEmail')?.value;
        
        if (newPassword && newPassword !== newPasswordConfirm) {
            showToast('Şifrələr uyğun gəlmir!', true);
            return;
        }
        if (newUsername) localStorage.setItem('adminUsername', newUsername);
        if (newPassword) localStorage.setItem('adminPassword', newPassword);
        if (newEmail) localStorage.setItem('adminEmail', newEmail);
        if (document.getElementById('settingPassword')) document.getElementById('settingPassword').value = '';
        if (document.getElementById('settingPasswordConfirm')) document.getElementById('settingPasswordConfirm').value = '';
        showToast('Ayarlar yadda saxlanıldı!');
    });
}

// ========== MƏHSUL ƏMƏLİYYATLARI ==========
async function addProduct(name, price, image, category, discount, stock, description) {
    if (!name || !price) { showToast("Məhsul adı və qiymət daxil edin!", true); return false; }
    showLoading(true);
    try {
        await addProductToAPI(name, price, image, category, discount, stock, description);
        await loadProducts();
        const inputs = ['newName', 'newPrice', 'newImage', 'newDiscount', 'newStock', 'newDescription'];
        inputs.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        if (document.getElementById('newCategory')) document.getElementById('newCategory').value = 'electronics';
        showToast(`✅ "${name}" məhsulu əlavə edildi!`);
        renderAdminTable();
        updateAdminStats();
        return true;
    } catch (error) { showToast('Xəta: Məhsul əlavə edilərkən problem oldu!', true); return false; }
    finally { showLoading(false); }
}

async function editProduct(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;
    const newName = prompt('Yeni ad:', product.name);
    const newPrice = prompt('Yeni qiymət (AZN):', product.price);
    const newImage = prompt('Şəkil linki:', product.image);
    const newCategory = prompt('Kateqoriya (electronics/clothing/accessories):', product.category || 'electronics');
    const newDiscount = prompt('Endirim faizi (%):', product.discount || 0);
    const newStock = prompt('Stok sayı:', product.stock || 10);
    if (newName && newPrice) {
        showLoading(true);
        try {
            await updateProductInAPI(id, newName, parseFloat(newPrice), newImage || product.image, newCategory, parseInt(newDiscount) || 0, parseInt(newStock) || 10, product.description);
            await loadProducts();
            showToast("✅ Məhsul yeniləndi!");
            renderAdminTable();
            updateAdminStats();
        } catch (error) { showToast('Xəta: Məhsul yenilənərkən problem oldu!', true); }
        finally { showLoading(false); }
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
            renderAdminTable();
            updateAdminStats();
        } catch (error) { showToast('Xəta: Məhsul silinərkən problem oldu!', true); }
        finally { showLoading(false); }
    }
}

// ========== ADMIN LOGIN ==========
function setupAdmin() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginSection = document.getElementById('loginSection');
    const adminPanel = document.getElementById('adminPanel');
    if (!loginBtn) return;
    
    const savedUsername = localStorage.getItem('adminUsername') || (window.CONFIG?.ADMIN_USERNAME || 'admin');
    const savedPassword = localStorage.getItem('adminPassword') || (window.CONFIG?.ADMIN_PASSWORD || 'admin123');
    
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        if (loginSection) loginSection.style.display = 'none';
        if (adminPanel) adminPanel.style.display = 'block';
        renderAdminTable();
        updateAdminStats();
        loadOrders();
        initSalesChart();
        setupAdminTabs();
        setupAdminSearch();
        setupSettingsForm();
    }
    
    loginBtn.onclick = () => {
        const username = document.getElementById('adminUsername')?.value;
        const password = document.getElementById('adminPassword')?.value;
        const errorEl = document.getElementById('loginError');
        if (username === savedUsername && password === savedPassword) {
            localStorage.setItem('adminLoggedIn', 'true');
            if (loginSection) loginSection.style.display = 'none';
            if (adminPanel) adminPanel.style.display = 'block';
            if (errorEl) errorEl.textContent = '';
            renderAdminTable();
            updateAdminStats();
            loadOrders();
            initSalesChart();
            setupAdminTabs();
            setupAdminSearch();
            setupSettingsForm();
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
    
    const addForm = document.getElementById('addProductForm');
    if (addForm) {
        addForm.onsubmit = async (e) => {
            e.preventDefault();
            const name = document.getElementById('newName')?.value;
            const price = document.getElementById('newPrice')?.value;
            const image = document.getElementById('newImage')?.value;
            const category = document.getElementById('newCategory')?.value;
            const discount = document.getElementById('newDiscount')?.value;
            const stock = document.getElementById('newStock')?.value;
            const description = document.getElementById('newDescription')?.value;
            if (name && price) await addProduct(name, price, image, category, discount, stock, description);
            else showToast("Məhsul adı və qiymət daxil edin!", true);
        };
    }
}

// ========== SƏHİFƏ YÜKLƏNMƏ ==========
window.onload = async () => {
    console.log("Səhifə yükləndi");
    await loadProducts();
    await loadOrders();
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
