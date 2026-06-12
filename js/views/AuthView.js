export class AuthView {
    constructor() {
        this.overlay = null;
        this.loginForm = null;
        this.registerForm = null;
        this.errorMsgContainer = null;
        this.onLoginCallback = null;
        this.onRegisterCallback = null;
        
        this.initModal();
    }

    /**
     * 
     */
    initModal() {
        if (document.getElementById('auth-modal-overlay')) {
            this.overlay = document.getElementById('auth-modal-overlay');
            this.loginForm = document.getElementById('auth-login-form');
            this.registerForm = document.getElementById('auth-register-form');
            this.errorMsgContainer = document.getElementById('auth-error-msg');
            return;
        }

    
        this.overlay = document.createElement('div');
        this.overlay.id = 'auth-modal-overlay';
        this.overlay.className = 'auth-modal-overlay';

        this.overlay.innerHTML = `
            <div class="auth-modal-box">
                <button class="auth-close-btn" id="auth-close-btn">&times;</button>
                <div class="auth-tabs">
                    <button class="auth-tab active" id="tab-login" data-target="login">Iniciar Sesión</button>
                    <button class="auth-tab" id="tab-register" data-target="register">Registrarse</button>
                </div>
                <div class="auth-body">
                    <div id="auth-error-msg" class="auth-error-msg" style="display: none;"></div>
                    
                    <!-- Formulario de Iniciar Sesión -->
                    <form id="auth-login-form" class="auth-form active">
                        <div class="auth-form-group">
                            <label for="login-username">Usuario</label>
                            <input type="text" id="login-username" placeholder="Ingresa tu usuario" required autocomplete="username">
                        </div>
                        <div class="auth-form-group">
                            <label for="login-password">Contraseña</label>
                            <input type="password" id="login-password" placeholder="Ingresa tu contraseña" required autocomplete="current-password">
                        </div>
                        <button type="submit" class="auth-submit-btn">Ingresar</button>
                    </form>

                    <!-- Formulario de Registro -->
                    <form id="auth-register-form" class="auth-form">
                        <div class="auth-form-group">
                            <label for="register-username">Usuario</label>
                            <input type="text" id="register-username" placeholder="Elige un usuario" required autocomplete="username">
                        </div>
                        <div class="auth-form-group">
                            <label for="register-password">Contraseña</label>
                            <input type="password" id="register-password" placeholder="Mínimo 6 caracteres" required autocomplete="new-password">
                        </div>
                        <div class="auth-form-group">
                            <label for="register-role">Rol del Usuario</label>
                            <select id="register-role" required>
                                <option value="Cliente" selected>Cliente</option>
                                <option value="Administrador">Administrador</option>
                            </select>
                        </div>
                        <button type="submit" class="auth-submit-btn">Registrarse</button>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(this.overlay);

        this.loginForm = document.getElementById('auth-login-form');
        this.registerForm = document.getElementById('auth-register-form');
        this.errorMsgContainer = document.getElementById('auth-error-msg');

        const tabLogin = document.getElementById('tab-login');
        const tabRegister = document.getElementById('tab-register');
        const closeBtn = document.getElementById('auth-close-btn');

        tabLogin.addEventListener('click', () => this.switchTab('login'));
        tabRegister.addEventListener('click', () => this.switchTab('register'));
        closeBtn.addEventListener('click', () => this.hide());
        
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.hide();
        });

        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.onLoginCallback) {
                const user = document.getElementById('login-username').value.trim();
                const pass = document.getElementById('login-password').value;
                this.onLoginCallback(user, pass);
            }
        });

        this.registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.onRegisterCallback) {
                const user = document.getElementById('register-username').value.trim();
                const pass = document.getElementById('register-password').value;
                const role = document.getElementById('register-role').value;
                this.onRegisterCallback(user, pass, role);
            }
        });
    }

    /**
     * 
     * @param {string} tab 
     */
    switchTab(tab) {
        const tabLogin = document.getElementById('tab-login');
        const tabRegister = document.getElementById('tab-register');
        this.clearError();

        if (tab === 'login') {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            this.loginForm.classList.add('active');
            this.registerForm.classList.remove('active');
        } else {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            this.registerForm.classList.add('active');
            this.loginForm.classList.remove('active');
        }
    }

    /**
     * 
     * @param {string} [tab='login']
     */
    show(tab = 'login') {
        this.switchTab(tab);
        this.overlay.style.display = 'flex';
        setTimeout(() => {
            this.overlay.classList.add('visible');
        }, 10);
    }

    /**
     * 
     */
    hide() {
        this.overlay.classList.remove('visible');
        setTimeout(() => {
            this.overlay.style.display = 'none';
            this.clearFields();
        }, 300); 
    }

    /**
     * 
     */
    clearFields() {
        this.loginForm.reset();
        this.registerForm.reset();
        this.clearError();
    }

    /**
     * 
     * @param {string} msg 
     */
    showError(msg) {
        this.errorMsgContainer.textContent = msg;
        this.errorMsgContainer.style.display = 'block';
        this.errorMsgContainer.classList.add('shake');
        setTimeout(() => {
            this.errorMsgContainer.classList.remove('shake');
        }, 500);
    }

    /**
     * 
     */
    clearError() {
        this.errorMsgContainer.textContent = '';
        this.errorMsgContainer.style.display = 'none';
    }

    /**
     * 
     * @param {Function} onLogin 
     * @param {Function} onRegister 
     */
    bindEvents(onLogin, onRegister) {
        this.onLoginCallback = onLogin;
        this.onRegisterCallback = onRegister;
    }
}
