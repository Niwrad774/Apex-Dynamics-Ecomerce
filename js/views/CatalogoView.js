export class CatalogView {
    constructor(domElements) {
        this.DOM = domElements;
    }

    renderCatalog(products) {
        this.DOM.productsGrid.innerHTML = "";
        
        if (products.length === 0) {
            this.DOM.productsGrid.innerHTML = `<p class="no-results">No se encontraron componentes mecánicos bajo los criterios seleccionados.</p>`;
            return;
        }

        products.forEach(product => {
            const card = document.createElement("article");
            card.className = "product-card";
            card.innerHTML = `
                <div class="product-img">${product.title}</div>
                <div class="product-info">
                    <h4>${product.title}</h4>
                    <p class="price">$${product.price.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                    <div class="rating">⭐ ${product.rating} (${product.reviewsCount} refs)</div>
                    <button class="btn-primary add-to-cart" data-id="${product.id}">Agregar al Carrito</button>
                    <button class="btn-text view-details" data-id="${product.id}">Ver Detalles / Reseñas</button>
                </div>
            `;
            this.DOM.productsGrid.appendChild(card);
        });
    }

    renderCart(items, totals) {
        this.DOM.cartCount.textContent = totals.count;
        this.DOM.cartSubtotal.textContent = `$${totals.subtotal}`;
        this.DOM.cartTotal.textContent = `$${totals.total}`;

        this.DOM.cartItemsContainer.innerHTML = "";

        if (items.length === 0) {
            this.DOM.cartItemsContainer.innerHTML = `<p style="text-align:center; color:#6c757d; margin-top:2rem;">El carrito está vacío.</p>`;
            return;
        }

        items.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.style.cssText = "display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem;";
            itemElement.innerHTML = `
                <div>
                    <h5 style="font-size:0.95rem; font-weight:bold;">${item.title}</h5>
                    <p style="color:var(--primary-color); font-size:0.9rem;">$${item.price} x ${item.quantity}</p>
                </div>
                <div style="display:flex; gap:5px; align-items:center;">
                    <button class="btn-qty minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn-qty plus" data-id="${item.id}">+</button>
                    <button class="btn-remove" data-id="${item.id}">Eliminar</button>
                </div>
            `;
            this.DOM.cartItemsContainer.appendChild(itemElement);
        });
    }

    renderReviews(reviews) {
        this.DOM.reviewsList.innerHTML = "";
        reviews.forEach(rev => {
            const revEl = document.createElement("div");
            revEl.style.cssText = "margin-bottom: 1rem; border-bottom: 1px dashed #ccc; padding-bottom: 0.5rem;";
            revEl.innerHTML = `
                <p style="font-weight:bold; color:orange;">${"⭐".repeat(rev.rating)}</p>
                <p style="font-style:italic;">"${rev.comment}"</p>
                <small style="color:#777;">Fecha: ${rev.date}</small>
            `;
            this.DOM.reviewsList.appendChild(revEl);
        });
    }
}