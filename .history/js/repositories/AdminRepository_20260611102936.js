export class AdminRepository {
    // CONEXIÓN CON EL ALMACENAMIENTO COMPARTIDO: Lee los mismos productos que ve el cliente
    getProducts() {
        return JSON.parse(localStorage.getItem('products')) || [];
    }

    // CONEXIÓN DE PERSISTENCIA (CRUD - Guardar/Actualizar): Sobrescribe la BD local
    saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }

    // CONEXIÓN DE VENTAS: Recupera el historial de compras ingresadas por la pasarela de pago del cliente
    getSalesOrders() {
        return JSON.parse(localStorage.getItem('sales_orders')) || this.getMockOrders();
    }

    // CONEXIÓN DE ACTUALIZACIÓN DE VENTAS: Guarda el nuevo estado de envío (Pendiente/Enviado/Entregado)
    saveSalesOrders(orders) {
        localStorage.setItem('sales_orders', JSON.stringify(orders));
    }

    // CONEXIÓN DE USUARIOS: Simula la base de datos de usuarios registrados en el sistema
    getUsersDatabase() {
        const users = JSON.parse(localStorage.getItem('users_db')) || { registered: 45, active: 12 };
        return users;
    }

    // Datos ficticios iniciales de órdenes para que el panel de administración no aparezca vacío al arrancar
    getMockOrders() {
        const mock = [
            { id: "ORD-9912", customer: "Carlos Sainz", total: 1250.00, status: "Pendiente", date: "2026-06-10", items: [{ title: "Kit de Suspensión", qty: 1 }] },
            { id: "ORD-9913", customer: "Charles Leclerc", total: 850.00, status: "Enviado", date: "2026-06-11", items: [{ title: "Discos de Freno", qty: 1 }] }
        ];
        localStorage.setItem('sales_orders', JSON.stringify(mock));
        return mock;
    }
}