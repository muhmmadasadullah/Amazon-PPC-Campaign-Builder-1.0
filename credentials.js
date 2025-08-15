/**
 * User Credentials Configuration
 * 
 * IMPORTANT: This file contains sensitive authentication data.
 * 
 * TO UPDATE PASSWORDS:
 * 1. Edit the credentials object below
 * 2. Save the file
 * 3. Refresh the application
 * 
 * FORMAT:
 * 'email@domain.com': 'password'
 */

const USER_CREDENTIALS = {
    // Authorized users and their passwords
    'hellomasadullah@gmail.com': 'Amzcampaignbuilder',
    'asadullah@amzonestep.com': 'Amzcampaignbuilder'
};

// Additional user settings
const USER_SETTINGS = {
    'hellomasadullah@gmail.com': {
        name: 'Masadullah',
        role: 'Admin',
        canChangePasswords: true,
        lastLogin: null
    },
    'asadullah@amzonestep.com': {
        name: 'Asadullah',
        role: 'User',
        canChangePasswords: false,
        lastLogin: null
    }
};

// Export for use in other files
if (typeof window !== 'undefined') {
    window.USER_CREDENTIALS = USER_CREDENTIALS;
    window.USER_SETTINGS = USER_SETTINGS;
}

// For Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        USER_CREDENTIALS,
        USER_SETTINGS
    };
}