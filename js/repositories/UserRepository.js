export class UserRepository {
    /**
     * 
     * @returns {Array}
     */
    getUsers() {
        let users = localStorage.getItem('auth_users_db');
        if (!users) {
            const defaults = [
                { username: 'admin', password: 'admin123', role: 'Administrador' },
                { username: 'cliente', password: 'cliente123', role: 'Cliente' }
            ];
            localStorage.setItem('auth_users_db', JSON.stringify(defaults));
            return defaults;
        }
        return JSON.parse(users);
    }

    /**
     * 
     * @param {Object} user 
     */
    saveUser(user) {
        const users = this.getUsers();
        users.push(user);
        localStorage.setItem('auth_users_db', JSON.stringify(users));
    }

    /**
     * 
     * @param {string} username 
     * @returns {Object|undefined}
     */
    findByUsername(username) {
        const users = this.getUsers();
        return users.find(u => u.username.toLowerCase() === username.toLowerCase());
    }
}
