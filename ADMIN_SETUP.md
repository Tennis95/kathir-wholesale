# 🛡️ Admin Authentication System - Setup Guide

## Overview
This guide covers the complete admin authentication and approval workflow system for KATHIR Wholesale.

---

## 📋 Features Implemented

### 1. **Admin Authentication**
- Separate admin login portal (`/auth/admin/login`)
- Admin signup/access request (`/auth/admin/signup`)
- Email-based password recovery
- Secure password reset with 24-hour token expiry

### 2. **Database Models**
- `AdminUser` - Stores approved admin accounts
- `AdminAccessRequest` - Tracks pending admin access requests

### 3. **Email Service**
- Gmail/Nodemailer configured
- Automated emails for:
  - Password reset links
  - Access approval notifications
  - Access rejection notices
  - Admin notifications for pending requests

### 4. **Admin Approval Workflow**
- New admin requests go to "pending" status
- Super admin reviews and approves/rejects requests
- Automatic email notifications sent to requester

---

## 🔧 Environment Setup

### Step 1: Gmail Configuration

To enable email functionality, you need to set up Gmail App Password:

1. **Enable 2-Factor Authentication** on your Gmail account
2. Go to: https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer" (or relevant device)
4. Generate a 16-character app password
5. Add to your `.env.local`:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
ADMIN_NOTIFICATION_EMAIL=admin@kathir.co.uk
BUSINESS_EMAIL=orders@kathir.co.uk

# Setup Token (for creating test admins)
ADMIN_SETUP_TOKEN=your-secure-random-token
```

### Step 2: Database Configuration

Ensure MongoDB is configured in `.env.local`:

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/kathir-wholesale
```

### Step 3: Base URL Configuration

```env
NEXT_PUBLIC_BASE_URL=https://kathir-wholesale.vercel.app
```

---

## 🚀 Creating Test Admin Accounts

### Option 1: Using API (Recommended)

1. Generate a secure setup token:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. Add to `.env.local`:
```env
ADMIN_SETUP_TOKEN=your-generated-token
```

3. Create test admins using curl:
```bash
curl -X POST https://kathir-wholesale.vercel.app/api/admin/create-test-admin \
  -H "Authorization: Bearer your-generated-token" \
  -H "Content-Type: application/json"
```

4. Check existing admins:
```bash
curl https://kathir-wholesale.vercel.app/api/admin/create-test-admin \
  -H "Authorization: Bearer your-generated-token"
```

### Test Admin Accounts Created

| Email | Password | Role | Access |
|-------|----------|------|--------|
| admin@kathir.co.uk | AdminPassword123! | super_admin | Full access |
| manager@kathir.co.uk | Manager123! | manager | Order management |
| finance@kathir.co.uk | Finance123! | finance | Financial reports |

---

## 📧 Email Templates

### 1. Password Reset Email
- 24-hour expiry reset link
- Security warnings
- Clear instructions

### 2. Access Approval Email
- Welcome message
- Login credentials
- Feature overview
- Direct access link

### 3. Access Rejection Email
- Professional rejection notice
- Contact information for inquiries

### 4. Admin Notification
- New request alert
- Requester details
- Review dashboard link

---

## 🔐 Admin Approval Workflow

### Process Flow

1. **User Submits Request**
   - Visit `/auth/admin/signup`
   - Fill out request form
   - Submit for approval

2. **Email Notifications**
   - Requester sees success message
   - Admin team receives notification email

3. **Admin Review**
   - Go to `/admin/access-requests`
   - Review pending requests
   - Approve or reject with reason

4. **Automated Response**
   - Approved: Email with login link + auto-created account
   - Rejected: Email with rejection reason

---

## 🔑 Admin Roles

### Super Admin
- Full system access
- Approve/reject admin requests
- Manage all orders and reports
- Team management

### Manager
- Order management
- Invoice generation
- Customer support access
- Limited reporting

### Finance
- Financial reports
- Revenue analytics
- Invoice tracking
- Payment reconciliation

---

## 🛠️ API Endpoints

### Authentication
```
POST /api/auth/admin/signup           - Submit admin access request
POST /api/auth/admin/forgot-password  - Request password reset
POST /api/auth/admin/reset-password   - Reset password with token
```

### Admin Management
```
GET  /api/admin/access-requests           - List all requests
POST /api/admin/access-requests           - Approve/reject request
POST /api/admin/create-test-admin         - Create test admins (setup only)
GET  /api/admin/create-test-admin         - List existing admins
```

---

## 📝 Database Schema

### AdminUser
```typescript
{
  name: String (required)
  email: String (required, unique)
  password: String (required, hashed)
  companyName: String (required)
  phone: String
  role: 'manager' | 'admin' | 'finance' | 'super_admin'
  status: 'active' | 'inactive' | 'suspended'
  isApproved: Boolean
  approvedBy: ObjectId (ref: AdminUser)
  approvedAt: Date
  lastLogin: Date
  passwordResetToken: String (hashed)
  passwordResetExpiry: Date
  timestamps: true
}
```

### AdminAccessRequest
```typescript
{
  name: String
  email: String (unique)
  companyName: String
  requestedRole: 'manager' | 'admin' | 'finance'
  status: 'pending' | 'approved' | 'rejected'
  reason: String
  approvedBy: ObjectId (ref: AdminUser)
  rejectionReason: String
  approvedAt: Date
  rejectedAt: Date
  timestamps: true
}
```

---

## 🧪 Testing

### Test Admin Login
1. Go to: `https://kathir-wholesale.vercel.app/auth/admin/login`
2. Use any test admin credentials from above
3. Click "Forgot password" to test password reset flow
4. Submit an access request from `/auth/admin/signup` to test workflow

### Check Admin Dashboard
1. After login, go to: `/admin`
2. View orders, analytics, etc.

### Monitor Email
- Check your inbox for password reset emails
- Confirm all email templates render correctly

---

## ⚙️ Configuration Checklist

- [ ] Gmail app password configured
- [ ] `.env.local` updated with email credentials
- [ ] `ADMIN_SETUP_TOKEN` generated and added
- [ ] MongoDB connection verified
- [ ] `NEXT_PUBLIC_BASE_URL` set correctly
- [ ] Test admin accounts created
- [ ] Test login with admin credentials
- [ ] Test password reset email flow
- [ ] Test access request workflow

---

## 🚨 Security Best Practices

1. **Never commit `.env.local`** - Use environment variables
2. **Email Password** - Use app-specific password, not main password
3. **Setup Token** - Use random token, change after setup
4. **Password Reset** - Tokens expire after 24 hours
5. **Admin Approval** - All new admins require approval
6. **Role-Based Access** - Each role has specific permissions
7. **Audit Logging** - Monitor admin actions and access requests

---

## 📞 Support

For issues with:
- **Email configuration**: Check Gmail app passwords settings
- **Database errors**: Verify MongoDB connection string
- **Password reset**: Ensure email credentials are correct
- **Admin approval**: Check `/admin/access-requests` page

---

**Last Updated:** 2026-07-24  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
