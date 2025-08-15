/**
 * Authentication Module for Amazon PPC Campaign Builder
 * Handles user authentication, session management, and access control
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    // Initialize authentication system
    init() {
        this.loadUserSession();
        this.setupEventListeners();
    }

    // Load user session from storage
    loadUserSession() {
        try {
            // Check localStorage first (persistent login)
            let userData = localStorage.getItem('ppcBuilder_user');
            let isRemembered = localStorage.getItem('ppcBuilder_rememberMe') === 'true';
            
            if (!userData) {
                // Check sessionStorage (session login)
                userData = sessionStorage.getItem('ppcBuilder_user');
                isRemembered = false;
            }

            if (userData) {
                const user = JSON.parse(userData);
                
                // Validate session expiry
                if (this.validateSession(user, isRemembered)) {
                    this.currentUser = user;
                    return true;
                } else {
                    this.clearSession();
                    return false;
                }
            }
        } catch (error) {
            console.error('Error loading user session:', error);
            this.clearSession();
        }
        return false;
    }

    // Validate if session is still valid
    validateSession(user, isRemembered) {
        if (!user.loginTime) return false;

        const loginTime = new Date(user.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

        // Persistent sessions valid for 24 hours, session storage until browser closes
        if (isRemembered) {
            return hoursDiff < 24;
        } else {
            return sessionStorage.getItem('ppcBuilder_user') !== null;
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get current user information
    getCurrentUser() {
        return this.currentUser;
    }

    // Redirect to sign-in page if not authenticated
    requireAuth() {
        if (!this.isAuthenticated()) {
            // Save current page for redirect after login
            const currentPath = window.location.pathname;
            if (currentPath !== '/signin.html') {
                sessionStorage.setItem('ppcBuilder_redirectAfterLogin', currentPath);
            }
            window.location.href = 'signin.html';
            return false;
        }
        return true;
    }

    // Sign out user
    signOut() {
        this.clearSession();
        window.location.href = 'signin.html';
    }

    // Clear user session
    clearSession() {
        this.currentUser = null;
        localStorage.removeItem('ppcBuilder_user');
        localStorage.removeItem('ppcBuilder_rememberMe');
        sessionStorage.removeItem('ppcBuilder_user');
        sessionStorage.removeItem('ppcBuilder_redirectAfterLogin');
    }

    // Setup event listeners
    setupEventListeners() {
        // Listen for storage changes (multi-tab support)
        window.addEventListener('storage', (e) => {
            if (e.key === 'ppcBuilder_user' || e.key === 'ppcBuilder_rememberMe') {
                if (e.newValue === null) {
                    // User signed out in another tab
                    this.signOut();
                } else {
                    // User signed in another tab
                    this.loadUserSession();
                    this.updateUI();
                }
            }
        });

        // Periodically check session validity
        setInterval(() => {
            if (this.currentUser && !this.loadUserSession()) {
                alert('Your session has expired. Please sign in again.');
                this.signOut();
            }
        }, 60000); // Check every minute
    }

    // Update UI elements based on authentication state
    updateUI() {
        const userInfo = document.getElementById('userInfo');
        const signOutBtn = document.getElementById('signOutBtn');
        const userNameDisplay = document.getElementById('userNameDisplay');
        const userEmailDisplay = document.getElementById('userEmailDisplay');

        if (this.isAuthenticated() && userInfo) {
            userInfo.style.display = 'flex';
            if (userNameDisplay) {
                userNameDisplay.textContent = this.currentUser.name || 'User';
            }
            if (userEmailDisplay) {
                userEmailDisplay.textContent = this.currentUser.email || '';
            }
        }

        if (signOutBtn) {
            signOutBtn.addEventListener('click', () => this.signOut());
        }
    }

    // Create user info UI component
    createUserInfoComponent() {
        if (!this.isAuthenticated()) return '';

        return `
            <div id="userInfo" class="flex items-center space-x-3 bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                        <i class="fas fa-user text-white"></i>
                    </div>
                    <div class="text-white">
                        <div id="userNameDisplay" class="text-sm font-medium">${this.currentUser.name}</div>
                        <div id="userEmailDisplay" class="text-xs opacity-75">${this.currentUser.email}</div>
                    </div>
                </div>
                <div class="border-l border-white border-opacity-30 pl-3">
                    <button id="signOutBtn" class="text-white hover:text-red-200 transition-colors flex items-center space-x-1 text-sm" title="Sign Out">
                        <i class="fas fa-sign-out-alt"></i>
                        <span class="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </div>
        `;
    }

    // Initialize authentication for the main application
    initMainApp() {
        // Require authentication
        if (!this.requireAuth()) {
            return false;
        }

        return true;
    }
}

// Create global authentication manager instance
window.authManager = new AuthManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}