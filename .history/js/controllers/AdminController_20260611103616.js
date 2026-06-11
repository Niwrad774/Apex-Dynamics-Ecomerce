import { AdminRepository } from '../repositories/AdminRepository.js';
import { AdminService } from '../services/AdminService.js';
import { AdminView } from '../views/AdminView.js';

document.addEventListener("DOMContentLoaded", () => {
    // 1. ENLAZAMIENTO E INICIALIZACIÓN DE LA ARQUITECTURA
    const adminRepo = new AdminRepository();
    const adminService = new AdminService(adminRepo);

    // MAPA DE CONEXIONES CON EL DOM DE LA PÁGINA ADMIN
    const DOM = {
        totalRevenue: document.getElementById("db-total-revenue"),
        topProductsList: document.getElementById("db-top-products"),
        usersComparison: document.getElementById("db-users-count"),
        inventoryTableBody: document.getElementById("inventory-table-body"),
        salesTableBody: document.getElementById("sales-table-body"),
        productForm: document.getElementById("admin-product-form"),
        formTitle: document.getElementById("form-title"),
        prodIdInput: document.getElementById("prod-id"),
        prodTitleInput: document.getElementById("prod-title"),
        prodDescInput: document.getElementById("prod-desc"),
        prodPriceInput: document.getElementById("prod-price"),
        prodCategorySelect: document.getElementById("prod-category"),
        btnCancelEdit: document.getElementById("btn-cancel-edit")
    };

    const view = new AdminView(DOM);

    // 2. CIRCUITO DE RENDERIZACIÓN GLOBAL (Refresca todo el panel sincrónicamente)
    function refreshAdminPanel() {
        const products = adminRepo.getProducts();
        const orders = adminRepo.getSalesOrders();
        const metrics = adminService.getDashboardMetrics();

        // Conecta los datos actualizados de la lógica con los componentes visuales del DOM
        view.renderInventoryTable(products);
        view.renderSalesTable(orders);
        view.renderDashboard(metrics);
    }

    // 3. CONEXIÓN DEL FORMULARIO (CREATE / UPDATE del CRUD)
    DOM.productForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const productDto = {
            id: DOM.prodIdInput.value ? parseInt(DOM.prodIdInput.value) : null,
            title: DOM.prodTitleInput.value.trim(),
            description: DOM.prodDescInput.value.trim(),
            price: parseFloat(DOM.prodPriceInput.value),
            category: DOM.prodCategorySelect.value,
            rating: DOM.prodIdInput.value ? parseFloat(adminRepo.getProducts().find(p=>p.id===parseInt(DOM.prodIdInput.value)).rating) : 5.0,
            reviewsCount: DOM.prodIdInput.value ? parseInt(adminRepo.getProducts().find(p=>p.id===parseInt(DOM.prodIdInput.value)).reviewsCount) : 0
        };

        if (productDto.id) {
            // PUNTO DE CONEXIÓN: Flujo de Modificación
            adminService.updateProduct(productDto);
            alert("Componente actualizado en el inventario.");
        } else {
            adminService.addProduct(productDto);
            alert("Nuevo componente registrado con éxito.");
        }

        resetForm();
        refreshAdminPanel();
    });

    DOM.inventoryTableBody.addEventListener("click", (e) => {
        const productId = parseInt(e.target.dataset.id);
        if (!productId) return;

        if (e.target.classList.contains("btn-delete-prod")) {
            if (confirm(`¿Seguro que deseas dar de baja el componente #${productId}?`)) {
                adminService.deleteProduct(productId);
                refreshAdminPanel();
            }
        } else if (e.target.classList.contains("btn-edit-prod")) {
            const product = adminRepo.getProducts().find(p => p.id === productId);
            if (product) {
                DOM.formTitle.textContent = "Modificar Componente";
                DOM.prodIdInput.value = product.id;
                DOM.prodTitleInput.value = product.title;
                DOM.prodDescInput.value = product.description;
                DOM.prodPriceInput.value = product.price;
                DOM.prodCategorySelect.value = product.category;
                DOM.btnCancelEdit.style.display = "inline-block";
            }
        }
    });

    DOM.salesTableBody.addEventListener("change", (e) => {
        if (e.target.classList.contains("order-status-select")) {
            const orderId = e.target.dataset.id;
            const newStatus = e.target.value;
            
            adminService.updateOrderStatus(orderId, newStatus);
            refreshAdminPanel();
        }
    });

    DOM.btnCancelEdit.addEventListener("click", resetForm);

    function resetForm() {
        DOM.productForm.reset();
        DOM.prodIdInput.value = "";
        DOM.formTitle.textContent = "Registrar Nuevo Componente";
        DOM.btnCancelEdit.style.display = "none";
    }

    refreshAdminPanel();
});