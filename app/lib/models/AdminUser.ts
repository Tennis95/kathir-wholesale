import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const adminUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    companyName: {
      type: String,
      required: true,
    },
    phone: String,
    role: {
      type: String,
      enum: ['manager', 'admin', 'finance', 'super_admin'],
      default: 'manager',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
    },
    approvedAt: Date,
    lastLogin: Date,
    passwordResetToken: String,
    passwordResetExpiry: Date,
  },
  { timestamps: true }
);

// Hash password before saving
adminUserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

// Compare password method
adminUserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Generate password reset token
adminUserSchema.methods.generatePasswordResetToken = function () {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return resetToken;
};

export default mongoose.models.AdminUser || mongoose.model('AdminUser', adminUserSchema);
