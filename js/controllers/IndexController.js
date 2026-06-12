import { AuthService } from '../services/AuthService.js';
import { AuthView } from '../views/AuthView.js';

document.addEventListener("DOMContentLoaded", () => {
    const authService = new AuthService();
    const authView = new AuthView();

    const navElement = document.querySelector(".navbar nav");

    function renderNav() {
        if (!navElement) return;
        const user = authService.getCurrentUser();
        
        if (user) {
            let html = `<a href="cliente.html">Catálogo</a>`;
            if (user.role === 'Administrador') {
                html += `<a href="admin.html">Administración</a>`;
            }
            html += `<a href="#" id="logout-link" style="color: #e63946; font-weight: bold;">Cerrar Sesión (${user.username})</a>`;
            navElement.innerHTML = html;

            const logoutLink = document.getElementById("logout-link");
            if (logoutLink) {
                logoutLink.addEventListener("click", (e) => {
                    e.preventDefault();
                    authService.logout();
                    alert("Sesión finalizada con éxito.");
                    window.location.reload();
                });
            }
        } else {
            navElement.innerHTML = `
                <a href="cliente.html">Catálogo</a>
                <a href="#" id="login-link">Iniciar Sesión</a>
                <a href="#" id="admin-link">Administración</a>
            `;

            const loginLink = document.getElementById("login-link");
            if (loginLink) {
                loginLink.addEventListener("click", (e) => {
                    e.preventDefault();
                    authView.show('login');
                });
            }

            const adminLink = document.getElementById("admin-link");
            if (adminLink) {
                adminLink.addEventListener("click", (e) => {
                    e.preventDefault();
                    authView.show('login');
                });
            }
        }
    }

    authView.bindEvents(
        (username, password) => {
            try {
                const session = authService.login(username, password);
                alert(`Acceso concedido. ¡Hola, ${username}!`);
                authView.hide();
                
                if (session.role === 'Administrador') {
                    window.location.href = 'admin.html';
                } else {
                    renderNav();
                }
            } catch (err) {
                authView.showError(err.message);
            }
        },
        (username, password, role) => {
            try {
                const session = authService.register(username, password, role);
                alert(`Piloto registrado con éxito. Sesión iniciada como ${username}.`);
                authView.hide();

                if (session.role === 'Administrador') {
                    window.location.href = 'admin.html';
                } else {
                    renderNav();
                }
            } catch (err) {
                authView.showError(err.message);
            }
        }
    );

    renderNav();
});
