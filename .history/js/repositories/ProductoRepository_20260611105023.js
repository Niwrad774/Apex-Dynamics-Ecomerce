export class ProductRepository {
    constructor() {
        this.apiURL = 'https://fakestoreapi.com/products';
    }

    async getAllProducts() {
        
        let products = JSON.parse(localStorage.getItem('products'));
        
        
        if (!products || products.length === 0) {
            try {
                
                const response = await fetch(this.apiURL);
                const data = await response.json();
                
                
                products = data.map(item => ({
                    id: item.id,
                    title: this.translateToMotorsport(item.title, item.id),
                    description: item.description,
                    price: parseFloat((item.price * 10).toFixed(2)),
                    category: this.mapCategory(item.category),
                    rating: item.rating ? item.rating.rate : 5,
                    reviewsCount: item.rating ? item.rating.count : 0
                }));

                
                localStorage.setItem('products', JSON.stringify(products));
            } catch (error) {
                console.error("Error en la conexión con la API, usando fallback local:", error);
                products = this.getFallbackProducts();
                localStorage.setItem('products', JSON.stringify(products));
            }
        }
        return products; 
    }

    getReviewsByProductId(productId) {
        
        const allReviews = JSON.parse(localStorage.getItem('product_reviews')) || {};
        return allReviews[productId] || this.getDefaultReviews();
    }

    saveReview(productId, reviewDto) {// CONEXIÓN LOCAL: Modifica el estado del LocalStorage inyectando una nueva reseña
        const allReviews = JSON.parse(localStorage.getItem('product_reviews')) || {};
        if (!allReviews[productId]) allReviews[productId] = this.getDefaultReviews();
        
        allReviews[productId].push(reviewDto);
        localStorage.setItem('product_reviews', JSON.stringify(allReviews));
    }

    mapCategory(apiCategory) {
        if (apiCategory.includes("electronics")) return "telemetria";
        if (apiCategory.includes("jewelery")) return "suspension";
        if (apiCategory.includes("men's clothing")) return "motor";
        return "frenos";
    }

    translateToMotorsport(title, id) {
        const names = [
            "Kit de Suspensión Coilovers Pro", "Discos de Freno Cerámicos", 
            "Módulo de Telemetría GPS v2", "Turbocompresor de Geometría Variable",
            "Inyectores de Alta Presión", "Volante de Alcantara Competición",
            "Pastillas de Freno Compuesto Blando", "Sensor de Presión de Neumáticos TPMS"
        ];
        return names[id % names.length] || `Componente Racing HP-${id}`;
    }

    getDefaultReviews() {
        return [
            { rating: 5, comment: "Excelente respuesta en pista, altamente recomendado.", date: "2026-05-10" },
            { rating: 4, comment: "Buen material, requiere ajuste profesional.", date: "2026-06-01" }
        ];
    }

    getFallbackProducts() {
        return [{ id: 101, title: "Kit de Suspensión Ajustable", description: "Ideal para circuitos", price: 1200.00, category: "suspension", rating: 4.8, reviewsCount: 14 }];
    }
}