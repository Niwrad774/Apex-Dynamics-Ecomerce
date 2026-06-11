export class AdminService {
    constructor(adminRepo) {
        // CONEXIÓN ENTRE CAPAS: El servicio se inyecta con el repositorio para solicitar datos
        this.repo = adminRepo;
    }

    // ==========================================
    // SECCIÓN OPERACIONES CRUD (Inventario)
    // ==========================================
    addProduct(productDto) {
        const products = this.repo.getProducts();
        productDto.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 101;
        products.push(productDto);
        this.repo.saveProducts(products); // PUNTO DE CONEXIÓN: Envía el nuevo listado al almacenamiento
        return productDto;
    }

    updateProduct(updatedProduct) {
        let products = this.repo.getProducts();
        products = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
        this.repo.saveProducts(products); // PUNTO DE CONEXIÓN: Sincroniza la edición en la BD local
    }

    deleteProduct(productId) {
        let products = this.repo.getProducts();
        products = products.filter(p => p.id !== productId);
        this.repo.saveProducts(products); // PUNTO DE CONEXIÓN: Elimina físicamente el elemento
    }

    updateOrderStatus(orderId, newStatus) {
        let orders = this.repo.getSalesOrders();
        orders = orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order);
        this.repo.saveSalesOrders(orders); // PUNTO DE CONEXIÓN: Actualiza el estado de envío (Pendiente/Enviado/Entregado)
    }

    // ==========================================
    // SECCIÓN CÓMPUTO DE MÉTRICAS (Dashboard)
    // ==========================================
    getDashboardMetrics() {
        const orders = this.repo.getSalesOrders();
        const users = this.repo.getUsersDatabase();
        const products = this.repo.getProducts();

        const totalRevenue = orders.reduce((acc, order) => acc + parseFloat(order.total), 0);

        const topProducts = [...products]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3)
            .map(p => ({ title: p.title, rating: p.rating }));

        return {
            totalRevenue: totalRevenue.toFixed(2),
            topProducts,
            usersRegistered: users.registered,
            usersActive: users.active
        };
    }
}