import { UserRepository } from '../repositories/UserRepository.js';
import { CookieHelper } from '../helpers/CookieHelper.js';

export class AuthService {
    constructor() {
        this.userRepo = new UserRepository();
    }

    /**
     * 
     * @param {string} username 
     * @param {string} password 
     * @returns {Object} 
     */
    login(username, password) {
        const user = this.userRepo.findByUsername(username);
        if (!user || user.password !== password) {
            throw new Error("Usuario o contraseña incorrectos.");
        }
        
        const sessionData = { username: user.username, role: user.role };
        
        CookieHelper.setCookie('session_user', JSON.stringify(sessionData), 1);
        
        this.updateActiveUsersCount(1);
        
        return sessionData;
    }

    /**
     * 
     * @param {string} username 
     * @param {string} password 
     * @param {string} role 
     * @returns {Object} 
     */
    register(username, password, role = 'Cliente') {
        const existing = this.userRepo.findByUsername(username);
        if (existing) {
            throw new Error("El nombre de usuario ya está registrado.");
        }
        
        const newUser = { username, password, role };
        this.userRepo.saveUser(newUser);
        
        this.updateRegisteredUsersCount();

        return this.login(username, password);
    }

    /**
     * 
     */
    logout() {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            CookieHelper.eraseCookie('session_user');
            this.updateActiveUsersCount(-1);
        }
    }

    /**
     * 
     * @returns {Object|null}
     */
    getCurrentUser() {
        const cookie = CookieHelper.getCookie('session_user');
        if (!cookie) return null;
        try {
            return JSON.parse(cookie);
        } catch (e) {
            return null;
        }
    }

    /**
     * 
     * @returns {boolean}
     */
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    /**
     * 
     * @param {number} change 
     */
    updateActiveUsersCount(change) {
        const usersDb = JSON.parse(localStorage.getItem('users_db')) || { registered: 45, active: 12 };
        usersDb.active = Math.max(0, usersDb.active + change);
        localStorage.setItem('users_db', JSON.stringify(usersDb));
    }

    /**
     * 
     */
    updateRegisteredUsersCount() {
        const usersDb = JSON.parse(localStorage.getItem('users_db')) || { registered: 45, active: 12 };
        usersDb.registered += 1;
        localStorage.setItem('users_db', JSON.stringify(usersDb));
    }
}
