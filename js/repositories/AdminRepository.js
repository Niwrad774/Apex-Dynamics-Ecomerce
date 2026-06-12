export class AdminRepository {
    getProducts() {
        return JSON.parse(localStorage.getItem('products')) || [];
    }

    saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }

    getSalesOrders() {
        return JSON.parse(localStorage.getItem('sales_orders')) || this.getMockOrders();
    }

    saveSalesOrders(orders) {
        localStorage.setItem('sales_orders', JSON.stringify(orders));
    }

    getUsersDatabase() {
        const users = JSON.parse(localStorage.getItem('users_db')) || { registered: 45, active: 12 };
        return users;
    }

    getMockOrders() {
        const mock = [
            { id: "ORD-9912", customer: "Carlos Sainz", total: 1250.00, status: "Pendiente", date: "2026-06-10", items: [{ title: "Kit de Suspensión", qty: 1 }] },
            { id: "ORD-9913", customer: "Charles Leclerc", total: 850.00, status: "Enviado", date: "2026-06-11", items: [{ title: "Discos de Freno", qty: 1 }] }
        ];
        localStorage.setItem('sales_orders', JSON.stringify(mock));
        return mock;
    }
}