# Password Management Guide

## Overview
Your Amazon PPC Campaign Builder now has multiple ways to manage user passwords and credentials. Here are all available options:

## 🔧 Method 1: Direct File Editing (Simplest)

### Location
Edit the `credentials.js` file directly.

### Steps
1. Open `credentials.js` in any text editor
2. Modify the passwords in the `USER_CREDENTIALS` object:
   ```javascript
   const USER_CREDENTIALS = {
       'hellomasadullah@gmail.com': 'YourNewPassword123',
       'asadullah@amzonestep.com': 'AnotherNewPassword456'
   };
   ```
3. Save the file
4. Refresh the application

### Pros
- Quick and simple
- No additional authentication required
- Direct control over all settings

### Cons
- Requires file system access
- Manual editing required

---

## 🎛️ Method 2: Admin Panel (Recommended)

### Access
Visit: `https://your-domain.com/admin.html`

### Features
- **Change existing passwords**
- **Add new users**
- **Remove users**
- **Generate updated credentials code**
- **Copy-paste ready code**

### Steps
1. Go to `/admin.html`
2. Enter admin password: `AdminPPC2024!`
3. Use the interface to manage users
4. Copy the generated code
5. Replace content in `credentials.js`
6. Save and refresh

### Admin Password
**Current Admin Password:** `AdminPPC2024!`

To change the admin password, edit line 185 in `admin.html`:
```javascript
const ADMIN_PASSWORD = 'YourNewAdminPassword';
```

### Pros
- User-friendly interface
- No direct file editing
- Bulk operations
- Generates proper code format

### Cons
- Requires admin password
- Still need to update credentials.js file

---

## 👤 Method 3: User Self-Service (Coming Soon)

A "Change Password" option will be available in the user dropdown menu for users to change their own passwords.

---

## 🚀 Quick Start

### To Change a Password Right Now:

1. **Open** `credentials.js`
2. **Find** your email in the USER_CREDENTIALS object
3. **Change** the password value
4. **Save** the file
5. **Refresh** the browser

### Example:
```javascript
// BEFORE
'hellomasadullah@gmail.com': 'Amzcampaignbuilder',

// AFTER
'hellomasadullah@gmail.com': 'MyNewSecurePassword123',
```

---

## 🔐 Security Best Practices

### Password Requirements
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers
- Avoid common words
- Use unique passwords

### Admin Security
- Change the default admin password
- Don't share admin credentials
- Regularly review user access

### File Security
- Keep `credentials.js` secure
- Don't commit passwords to public repositories
- Regular password updates

---

## 📋 Current Users

| Email | Role | Can Change Passwords |
|-------|------|---------------------|
| hellomasadullah@gmail.com | Admin | Yes |
| asadullah@amzonestep.com | User | No |

---

## 🆘 Troubleshooting

### Password Not Working
1. Check spelling in `credentials.js`
2. Ensure file is saved
3. Refresh browser completely
4. Check browser console for errors

### Admin Panel Not Loading
1. Verify `credentials.js` is accessible
2. Check admin password spelling
3. Clear browser cache

### Users Not Loading
1. Ensure `credentials.js` syntax is correct
2. Check for JavaScript errors
3. Verify file permissions

---

## 🔄 Future Enhancements

1. **Database Integration** - Move from file-based to database storage
2. **Password Encryption** - Add encryption for stored passwords
3. **Password Reset** - Email-based password reset system
4. **Two-Factor Authentication** - Enhanced security options
5. **User Self-Service** - Allow users to change their own passwords
6. **Password Policies** - Enforce complexity requirements
7. **Activity Logging** - Track login attempts and changes

---

## 📞 Support

If you need help with password management:
1. Check this documentation first
2. Review the current configuration in `credentials.js`
3. Test with the admin panel at `/admin.html`
4. Ensure all files are properly saved and accessible

---

*Last Updated: $(date)*
*Version: 1.0*