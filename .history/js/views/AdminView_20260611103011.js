export class AdminView {
    constructor(domElements) {
        // CONEXIÓN CON EL DOM: Almacena las referencias de los contenedores de la UI del administrador
        this.DOM = domElements;
    }

    // PUNTO DE CONEXIÓN (Datos -> UI): Renderiza el panel numérico del Dashboard
    renderDashboard(metrics) {
        this.DOM.totalRevenue.textContent = `$${metrics.totalRevenue}`;
        this.DOM.usersComparison.textContent = `${metrics.usersRegistered} Registrados / ${metrics.usersActive} Activos`;
        
        // Dibuja la lista visual de los 3 componentes mecánicos más solicitados
        this.DOM.topProductsList.innerHTML = metrics.topProducts
            .map((p, index) => `<li><strong>#${index + 1}</strong> ${p.title} (Score: ${p.rating}⭐)</li>`)
            .join('');
    }

    // PUNTO DE CONEXIÓN (CRUD -> UI): Llena la tabla de gestión de inventario
    renderInventoryTable(products) {
        this.DOM.inventoryTableBody.innerHTML = "";
        products.forEach(product => {
            const row = document.createElement("tr");
            // CONEXIÓN DE IDENTIFICADORES: Seteamos el data-id en los botones para recuperarlo en el Controlador
            row.innerHTML = `
                <td>#${product.id}</td>
                <td><strong>${product.title}</strong></td>
                <td>${product.category.toUpperCase()}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>
                    <button class="btn-edit-prod" data-id="${product.id}">⚙️ Editar</button>
                    <button class="btn-delete-prod btn-danger" data-id="${product.id}">🗑️ Eliminar</button>
                </td>
            `;
            this.DOM.inventoryTableBody.appendChild(row);
        });
    }

    // PUNTO DE CONEXIÓN (Ventas -> UI): Llena la tabla de envíos y logística
    renderSalesTable(orders) {
        this.DOM.salesTableBody.innerHTML = "";
        orders.forEach(order => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><strong>${order.id}</strong></td>
                <td>${order.customer}</td>
                <td>$${parseFloat(order.total).toFixed(2)}</td>
                <td>${order.date}</td>
                <td>
                    <select class="order-status-select" data-id="${order.id}">
                        <option value="Pendiente" ${order.status === 'Pendiente' ? 'selected' : ''}>🔴 Pendiente</option>
                        <option value="Enviado" ${order.status === 'Enviado' ? 'selected' : ''}>🟡 Enviado</option>
                        <option value="Entregado" ${order.status === 'Entregado' ? 'selected' : ''}>🟢 Entregado</option>
                    </select>
                </td>
            `;
            this.DOM.salesTableBody.appendChild(row);
        });
    }
}