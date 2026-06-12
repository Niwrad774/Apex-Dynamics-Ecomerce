import { ProductRepository } from '../repositories/ProductoRepository.js';
import { CartService } from '../services/CartService.js';
import { CatalogView } from '../views/CatalogoView.js';
import { AuthService } from '../services/AuthService.js';
import { AuthView } from '../views/AuthView.js';

document.addEventListener("DOMContentLoaded", () => {
    const productRepo = new ProductRepository();
    const cartService = new CartService();
    
    const DOM = {
        productsGrid: document.getElementById("products-grid"),
        searchInput: document.getElementById("search-input"),
        categorySelect: document.getElementById("category-select"),
        priceRange: document.getElementById("price-range"),
        priceValue: document.getElementById("price-value"),
        clearFilters: document.getElementById("clear-filters"),
        cartToggle: document.getElementById("cart-toggle"),
        cartPanel: document.getElementById("cart-panel"),
        closeCart: document.getElementById("close-cart"),
        cartItemsContainer: document.getElementById("cart-items"),
        cartCount: document.getElementById("cart-count"),
        cartSubtotal: document.getElementById("cart-subtotal"),
        cartTotal: document.getElementById("cart-total"),
        btnCheckout: document.getElementById("btn-checkout"),
        checkoutModal: document.getElementById("checkout-modal"),
        closeCheckout: document.getElementById("close-checkout"),
        checkoutForm: document.getElementById("checkout-form"),
        productModal: document.getElementById("product-modal"),
        closeProductModal: document.getElementById("close-product"),
        modalProductTitle: document.getElementById("modal-product-title"),
        modalProductDesc: document.getElementById("modal-product-desc"),
        modalProductPrice: document.getElementById("modal-product-price"),
        reviewsList: document.getElementById("reviews-list"),
        reviewForm: document.getElementById("review-form"),
        themeToggle: document.getElementById("theme-toggle"),
        authNavBtn: document.getElementById("auth-nav-btn"),
        logoutBtn: document.getElementById("logout-btn"),
        adminLink: document.querySelector(".admin-link"),
        userDisplay: document.getElementById("user-display")
    };

    const view = new CatalogView(DOM);
    const authService = new AuthService();
    const authView = new AuthView();

    function renderAuthState() {
        const user = authService.getCurrentUser();
        if (user) {
            if (DOM.userDisplay) {
                DOM.userDisplay.textContent = `Hola, ${user.username}`;
                DOM.userDisplay.style.display = "inline";
            }
            if (DOM.authNavBtn) DOM.authNavBtn.style.display = "none";
            if (DOM.logoutBtn) DOM.logoutBtn.style.display = "inline";
            if (DOM.adminLink) {
                if (user.role === 'Administrador') {
                    DOM.adminLink.style.display = "inline-block";
                } else {
                    DOM.adminLink.style.display = "none";
                }
            }
        } else {
            if (DOM.userDisplay) DOM.userDisplay.style.display = "none";
            if (DOM.authNavBtn) DOM.authNavBtn.style.display = "inline";
            if (DOM.logoutBtn) DOM.logoutBtn.style.display = "none";
            if (DOM.adminLink) DOM.adminLink.style.display = "none";
        }
    }

    authView.bindEvents(
        (username, password) => {
            try {
                authService.login(username, password);
                alert(`¡Bienvenido de nuevo, ${username}!`);
                authView.hide();
                renderAuthState();
            } catch (err) {
                authView.showError(err.message);
            }
        },
        (username, password, role) => {
            try {
                authService.register(username, password, role);
                alert(`Registro exitoso. ¡Bienvenido, ${username}!`);
                authView.hide();
                renderAuthState();
            } catch (err) {
                authView.showError(err.message);
            }
        }
    );

    if (DOM.authNavBtn) {
        DOM.authNavBtn.addEventListener("click", (e) => {
            e.preventDefault();
            authView.show('login');
        });
    }

    if (DOM.logoutBtn) {
        DOM.logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            authService.logout();
            alert("Sesión finalizada. Redirigiendo...");
            window.location.reload();
        });
    }

    let globalProducts = [];
    let selectedProductIdForReview = null;

    function handleFiltering() {
        const query = DOM.searchInput.value.toLowerCase().trim();
        const category = DOM.categorySelect.value;
        const maxPrice = parseFloat(DOM.priceRange.value);

        const filtered = globalProducts.filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
            const matchesCategory = category === "all" || product.category === category;
            const matchesPrice = product.price <= maxPrice;
            return matchesSearch && matchesCategory && matchesPrice;
        });

        view.renderCatalog(filtered);
    }

    function updateCartState() {
        const items = cartService.getCartItems();
        const totals = cartService.getCalculatedTotals();
        view.renderCart(items, totals);
    }

    DOM.searchInput.addEventListener("input", handleFiltering);
    DOM.categorySelect.addEventListener("change", handleFiltering);
    DOM.priceRange.addEventListener("input", (e) => {
        DOM.priceValue.textContent = e.target.value;
        handleFiltering();
    });

    DOM.clearFilters.addEventListener("click", () => {
        DOM.searchInput.value = "";
        DOM.categorySelect.value = "all";
        DOM.priceRange.value = DOM.priceRange.max;
        DOM.priceValue.textContent = DOM.priceRange.max;
        handleFiltering();
    });

    DOM.cartToggle.addEventListener("click", () => DOM.cartPanel.classList.add("open"));
    DOM.closeCart.addEventListener("click", () => DOM.cartPanel.classList.remove("open"));

    DOM.productsGrid.addEventListener("click", (e) => {
        const productId = parseInt(e.target.dataset.id);
        if (!productId) return;

        if (e.target.classList.contains("add-to-cart")) {
            const product = globalProducts.find(p => p.id === productId);
            if (product) {
                cartService.addToCart(product); 
                updateCartState(); 
            }
        } else if (e.target.classList.contains("view-details")) {
            const product = globalProducts.find(p => p.id === productId);
            if (product) {
                selectedProductIdForReview = productId;
                DOM.modalProductTitle.textContent = product.title;
                DOM.modalProductDesc.textContent = product.description;
                DOM.modalProductPrice.textContent = `$${product.price.toFixed(2)}`;
                
                const reviews = productRepo.getReviewsByProductId(productId);
                view.renderReviews(reviews);
                DOM.productModal.style.display = "flex";
            }
        }
    });

    DOM.cartPanel.addEventListener("click", (e) => {
        const productId = parseInt(e.target.dataset.id);
        if (!productId) return;

        if (e.target.classList.contains("plus")) cartService.incrementQuantity(productId);
        else if (e.target.classList.contains("minus")) cartService.decrementQuantity(productId);
        else if (e.target.classList.contains("btn-remove")) cartService.removeFromCart(productId);
        
        updateCartState();
    });

    DOM.btnCheckout.addEventListener("click", () => {
        if (cartService.getCartItems().length === 0) return alert("Paddock vacío.");
        if (!authService.isLoggedIn()) {
            alert("Debes iniciar sesión para proceder al pago.");
            authView.show('login');
            return;
        }
        DOM.checkoutModal.style.display = "flex";
    });
    DOM.closeCheckout.addEventListener("click", () => DOM.checkoutModal.style.display = "none");

    DOM.checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!authService.isLoggedIn()) {
            DOM.checkoutModal.style.display = "none";
            alert("Debes iniciar sesión para completar la transacción.");
            authView.show('login');
            return;
        }
        alert("¡Transacción autorizada localmente!");
        cartService.clearCart();
        updateCartState();
        DOM.checkoutModal.style.display = "none";
        DOM.cartPanel.classList.remove("open");
    });

    DOM.closeProductModal.addEventListener("click", () => DOM.productModal.style.display = "none");
    DOM.reviewForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const rating = parseInt(DOM.reviewForm.querySelector('input[name="rating"]:checked').value);
        const comment = DOM.reviewForm.querySelector('textarea').value;

        const reviewDto = { rating, comment, date: new Date().toISOString().split('T')[0] };
        
        productRepo.saveReview(selectedProductIdForReview, reviewDto);
        
        view.renderReviews(productRepo.getReviewsByProductId(selectedProductIdForReview));
        DOM.reviewForm.reset();
    });

    DOM.themeToggle.addEventListener("click", () => {
        const isDark = document.documentElement.style.getPropertyValue('--bg-color').trim() === "#121212";
        if (!isDark) {
            document.documentElement.style.setProperty('--bg-color', '#121212');
            document.documentElement.style.setProperty('--text-color', '#e0e0e0');
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.style.setProperty('--bg-color', '#ffffff');
            document.documentElement.style.setProperty('--text-color', '#333333');
            localStorage.setItem("theme", "light");
        }
    });

    async function init() {
        globalProducts = await productRepo.getAllProducts();
        handleFiltering();
        updateCartState();
        renderAuthState();
        if (localStorage.getItem("theme") === "dark") DOM.themeToggle.click();
    }

    init();
});