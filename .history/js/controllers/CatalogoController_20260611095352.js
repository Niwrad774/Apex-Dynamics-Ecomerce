import { ProductRepository } from '/repositories/ProductRepository.js';

import { CartService } from '../services/CartService.js';
import { CatalogView } from '../views/CatalogView.js';

document.addEventListener("DOMContentLoaded", () => {
    // 1. INICIALIZACIÓN Y CONEXIÓN DE CAPAS OBJETOS
    const productRepo = new ProductRepository();
    const cartService = new CartService();
    
    // CACHÉ DE ELEMENTOS DEL DOM (Pasados como el mapa de conexiones a la Vista)
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
        themeToggle: document.getElementById("theme-toggle")
    };

    const view = new CatalogView(DOM);

    let globalProducts = [];
    let selectedProductIdForReview = null;

    // 2. CONEXIÓN DE FILTROS EN TIEMPO REAL (UI -> Lógica -> UI)
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

        // Conecta los datos filtrados con el renderizador de la vista
        view.renderCatalog(filtered);
    }

    // 3. CONEXIÓN DE ACTUALIZACIÓN DEL CARRITO
    function updateCartState() {
        const items = cartService.getCartItems();
        const totals = cartService.getCalculatedTotals();
        // Conecta los datos matemáticos calculados por el servicio con los contenedores visuales
        view.renderCart(items, totals);
    }

    /**
     * --- CONEXIÓN DE LISTENERS (Eventos del DOM mapeados a Servicios) ---
     */
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

    // CONEXIÓN DE EVENTOS DELEGADOS (Intercepta clicks en elementos inyectados dinámicamente)
    DOM.productsGrid.addEventListener("click", (e) => {
        const productId = parseInt(e.target.dataset.id);
        if (!productId) return;

        if (e.target.classList.contains("add-to-cart")) {
            const product = globalProducts.find(p => p.id === productId);
            if (product) {
                cartService.addToCart(product); // Conexión con el servicio de negocio
                updateCartState(); // Actualización de interfaz
            }
        } else if (e.target.classList.contains("view-details")) {
            // Conexión con el Modal de Detalle
            const product = globalProducts.find(p => p.id === productId);
            if (product) {
                selectedProductIdForReview = productId;
                DOM.modalProductTitle.textContent = product.title;
                DOM.modalProductDesc.textContent = product.description;
                DOM.modalProductPrice.textContent = `$${product.price.toFixed(2)}`;
                
                // Conexión con el repositorio para jalar las opiniones de la BD local
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

    // CONEXIÓN CON FORMULARIO DE CHECKOUT (Pasarela simulada)
    DOM.btnCheckout.addEventListener("click", () => {
        if (cartService.getCartItems().length === 0) return alert("Paddock vacío.");
        DOM.checkoutModal.style.display = "flex";
    });
    DOM.closeCheckout.addEventListener("click", () => DOM.checkoutModal.style.display = "none");

    DOM.checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("¡Transacción autorizada localmente!");
        cartService.clearCart();
        updateCartState();
        DOM.checkoutModal.style.display = "none";
        DOM.cartPanel.classList.remove("open");
    });

    // CONEXIÓN CON FORMULARIO DE RECOLECCIÓN DE FEEDBACK (Vista -> Repositorio)
    DOM.closeProductModal.addEventListener("click", () => DOM.productModal.style.display = "none");
    DOM.reviewForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const rating = parseInt(DOM.reviewForm.querySelector('input[name="rating"]:checked').value);
        const comment = DOM.reviewForm.querySelector('textarea').value;

        const reviewDto = { rating, comment, date: new Date().toISOString().split('T')[0] };
        
        // Envía el DTO directamente al repositorio para persistir en LocalStorage
        productRepo.saveReview(selectedProductIdForReview, reviewDto);
        
        // Reconecta y refresca la lista visual de reseñas
        view.renderReviews(productRepo.getReviewsByProductId(selectedProductIdForReview));
        DOM.reviewForm.reset();
    });

    // CONEXIÓN DE CONFIGURACIÓN DE TEMA
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

    // ARRANQUE: Conexión asíncrona inicial para cargar los productos del Repositorio
    async function init() {
        globalProducts = await productRepo.getAllProducts();
        handleFiltering();
        updateCartState();
        if (localStorage.getItem("theme") === "dark") DOM.themeToggle.click();
    }

    init();
});