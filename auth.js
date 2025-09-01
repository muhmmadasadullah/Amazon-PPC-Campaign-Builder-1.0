/**
 * Authentication Module for Amazon PPC Campaign Builder
 * Handles user authentication, session management, and access control
 */

// Universal Authentication Credentials - Work across ALL tools
const UNIVERSAL_CREDENTIALS = {
    'master@amzontools.com': 'UniversalAccess2024!',
    'hellomasadullah@gmail.com': 'MasterTools2024',
    'asadullah@amzonestep.com': 'MasterTools2024'
};

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
            // Check for auto-login from Central Admin Dashboard first
            const autoLoginKeys = ['autoLogin_v1', 'autoLogin_v2'];
            for (const key of autoLoginKeys) {
                const autoLoginData = sessionStorage.getItem(key);
                if (autoLoginData) {
                    const loginData = JSON.parse(autoLoginData);
                    // Check if auto-login data is recent (within 5 minutes)
                    if (Date.now() - loginData.timestamp < 5 * 60 * 1000) {
                        this.performAutoLogin(loginData);
                        sessionStorage.removeItem(key); // Clean up after use
                        return true;
                    }
                    sessionStorage.removeItem(key); // Clean up expired data
                }
            }

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
        // Always return true to bypass authentication
        return true;
    }

    // Get current user information
    getCurrentUser() {
        // Return default user for public access
        return this.currentUser || {
            email: 'public@user.com',
            name: 'Public User',
            role: 'User',
            loginTime: new Date().toISOString(),
            rememberMe: false
        };
    }

    // Perform auto-login with universal credentials
    performAutoLogin(loginData) {
        const userSettings = window.USER_SETTINGS || {};
        const userInfo = userSettings[loginData.email] || { 
            name: loginData.email.split('@')[0].charAt(0).toUpperCase() + loginData.email.split('@')[0].slice(1),
            role: 'User'
        };
        
        const userData = {
            email: loginData.email,
            name: userInfo.name,
            role: userInfo.role,
            loginTime: new Date().toISOString(),
            autoLogin: true
        };
        
        // Store in sessionStorage for this session
        sessionStorage.setItem('ppcBuilder_user', JSON.stringify(userData));
        this.currentUser = userData;
        
        console.log('Auto-login successful for:', userData.name);
    }

    // Check if universal credentials are valid
    validateUniversalCredentials(email, password) {
        return UNIVERSAL_CREDENTIALS[email] === password;
    }

    // Redirect to sign-in page if not authenticated
    requireAuth() {
        // Authentication disabled - always return true to allow public access
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
            const user = this.getCurrentUser();
            if (userNameDisplay) {
                userNameDisplay.textContent = user.name || 'User';
            }
            if (userEmailDisplay) {
                userEmailDisplay.textContent = user.email || '';
            }
        }

        if (signOutBtn) {
            signOutBtn.addEventListener('click', () => this.signOut());
        }
    }

    // Create user info UI component
    createUserInfoComponent() {
        // Always show user info for public access
        const user = this.getCurrentUser();
        
        // Get first name only for compact display
        const firstName = user.name.split(' ')[0];

        return `
            <div class="relative">
                <div id="userInfo" class="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-4 py-2 backdrop-blur-sm cursor-pointer transition-all duration-200" onclick="toggleUserDropdown()">
                    <div class="w-7 h-7 bg-white bg-opacity-25 rounded-full flex items-center justify-center">
                        <i class="fas fa-user text-white text-xs"></i>
                    </div>
                    <div class="text-white hidden sm:block">
                        <div id="userNameDisplay" class="text-sm font-medium">${firstName}</div>
                    </div>
                    <i class="fas fa-chevron-down text-white text-xs opacity-75"></i>
                </div>
                
                <!-- Dropdown Menu -->
                <div id="userDropdown" class="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 opacity-0 invisible transform scale-95 transition-all duration-200">
                    <div class="p-4 border-b border-gray-100">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                <i class="fas fa-user text-white"></i>
                            </div>
                            <div>
                                <div class="font-medium text-gray-800">${user.name}</div>
                                <div class="text-sm text-gray-500">${user.email}</div>
                            </div>
                        </div>
                    </div>
                    <div class="p-2 space-y-1">
                        <button onclick="openChangePasswordModal()" class="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200">
                            <i class="fas fa-key"></i>
                            <span>Change Password</span>
                        </button>
                        <button id="signOutBtn" class="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors duration-200">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Initialize authentication for the main application
    initMainApp() {
        // Authentication disabled - always return true for public access
        return true;
    }
}

// Create global authentication manager instance
window.authManager = new AuthManager();

// Global function for dropdown toggle
window.toggleUserDropdown = function() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        const isVisible = dropdown.classList.contains('opacity-100');
        
        if (isVisible) {
            // Hide dropdown
            dropdown.classList.remove('opacity-100', 'visible', 'scale-100');
            dropdown.classList.add('opacity-0', 'invisible', 'scale-95');
        } else {
            // Show dropdown
            dropdown.classList.remove('opacity-0', 'invisible', 'scale-95');
            dropdown.classList.add('opacity-100', 'visible', 'scale-100');
        }
    }
};

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const userInfo = document.getElementById('userInfo');
    const dropdown = document.getElementById('userDropdown');
    
    if (userInfo && dropdown && !userInfo.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('opacity-100', 'visible', 'scale-100');
        dropdown.classList.add('opacity-0', 'invisible', 'scale-95');
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}