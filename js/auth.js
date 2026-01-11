/**
 * Auth Module
 * Handles Login, Logout, and Session Management
 */

const Auth = {
    // Login Function
    login: (email, password) => {
        const users = Storage.get('sms_users') || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Set Session
            const session = {
                id: user.id,
                name: user.name,
                role: user.role,
                loggedInAt: new Date().toISOString()
            };
            Storage.save('sms_session', session);
            return { success: true, user: session };
        } else {
            return { success: false, message: 'Invalid email or password' };
        }
    },

    // Logout Function
    logout: () => {
        localStorage.removeItem('sms_session');
        window.location.href = 'index.html';
    },

    // Check if user is logged in
    checkSession: () => {
        const session = Storage.get('sms_session');
        if (!session) {
            window.location.href = 'index.html';
        }
        return session;
    },

    // Get current user
    getCurrentUser: () => {
        return Storage.get('sms_session');
    }
};

// Check for redirect if already logged in (on index.html)
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    const session = Storage.get('sms_session');
    if (session) {
        window.location.href = 'dashboard.html';
    }
}
