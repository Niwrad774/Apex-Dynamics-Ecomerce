export class CartService {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    }

    getCartItems() {
        return this.cart;
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1; // PUNTO DE CONEXIÓN: Operación de clonar/incrementar cantidad
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.syncStorage();
    }

    incrementQuantity(productId) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += 1;
            this.syncStorage();
        }
    }

    decrementQuantity(productId) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
                return;
            }
            this.syncStorage();
        }
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.syncStorage();
    }

    clearCart() {
        this.cart = [];
        this.syncStorage();
    }

    // CALCULO MATEMÁTICO: Centraliza el cómputo automático de subtotales y totales requeridos
    getCalculatedTotals() {
        const subtotal = this.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        return {
            subtotal: subtotal.toFixed(2),
            total: subtotal.toFixed(2), // Modificar aquí si se requiere aplicar impuestos o descuentos
            count: this.cart.reduce((acc, item) => acc + item.quantity, 0)
        };
    }

    // CONEXIÓN DE PERSISTENCIA: Sincroniza el estado en memoria con el almacenamiento del navegador
    syncStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
}