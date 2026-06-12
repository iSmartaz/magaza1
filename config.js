// ========== KONFİQURASİYA FAYLI ==========
// BÜTÜN məxfi məlumatlar BURADA saxlanılır

const CONFIG = {
    // Admin giriş məlumatları
    ADMIN_USERNAME: "admin",
    ADMIN_PASSWORD: "admin123",
    
    // EmailJS məlumatları (öz məlumatlarınla dəyiş)
    EMAILJS_PUBLIC_KEY: "bgl4iFT7ir80qhcvX",      // EmailJS-dən al
    EMAILJS_SERVICE_ID: "service_a4viccd",      // EmailJS-dən al
    EMAILJS_TEMPLATE_ID: "template_1ihjpdq",    // EmailJS-dən al
    
    // Cəhd limitləri (isteğe bağlı dəyişə bilərsən)
    MAX_ATTEMPTS_LEVEL1: 5,      // ilk 5 cəhd
    BLOCK_TIME_LEVEL1: 60,       // 60 saniyə
    MAX_ATTEMPTS_LEVEL2: 10,     // 10 cəhd (5 + 5)
    BLOCK_TIME_LEVEL2: 300,      // 5 dəqiqə (300 saniyə)
    BLOCK_TIME_LEVEL3: 600       // 10 dəqiqə (600 saniyə)
};

// Konfiqurasiyanı qlobal olaraq əlçatan et
window.CONFIG = CONFIG;