import mongoose from 'mongoose';

const adminAccessRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    requestedRole: {
      type: String,
      enum: ['manager', 'admin', 'finance'],
      default: 'manager',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reason: String,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
    },
    rejectionReason: String,
    approvedAt: Date,
    rejectedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.AdminAccessRequest || mongoose.model('AdminAccessRequest', adminAccessRequestSchema);
