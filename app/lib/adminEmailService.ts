import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password',
  },
});

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  try {
    const resetURL = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kathir-wholesale.vercel.app'}/auth/admin/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'admin@kathir.co.uk',
      to: email,
      subject: '🔐 Password Reset Request - KATHIR Admin Portal',
      html: passwordResetEmailHTML(resetURL, email),
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
    return { success: true, message: 'Password reset link sent to email' };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return { success: false, message: 'Failed to send password reset email' };
  }
}

export async function sendAccessApprovedEmail(email: string, name: string, loginURL: string) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'admin@kathir.co.uk',
      to: email,
      subject: '✅ Admin Access Approved - KATHIR Portal',
      html: accessApprovedEmailHTML(name, loginURL),
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Access approval email sent to ${email}`);
    return { success: true, message: 'Access approval email sent' };
  } catch (error) {
    console.error('❌ Error sending access approval email:', error);
    return { success: false, message: 'Failed to send approval email' };
  }
}

export async function sendAccessRejectedEmail(email: string, name: string, reason: string) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'admin@kathir.co.uk',
      to: email,
      subject: '❌ Admin Access Request - Status Update',
      html: accessRejectedEmailHTML(name, reason),
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Access rejection email sent to ${email}`);
    return { success: true, message: 'Rejection email sent' };
  } catch (error) {
    console.error('❌ Error sending access rejection email:', error);
    return { success: false, message: 'Failed to send rejection email' };
  }
}

export async function sendAdminAccessRequestNotification(adminEmail: string, requesterName: string, requesterEmail: string) {
  try {
    const approvalURL = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kathir-wholesale.vercel.app'}/admin/access-requests`;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'admin@kathir.co.uk',
      to: adminEmail,
      subject: `📋 New Admin Access Request - ${requesterName}`,
      html: adminAccessRequestNotificationHTML(requesterName, requesterEmail, approvalURL),
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Admin notification sent to ${adminEmail}`);
    return { success: true, message: 'Admin notification sent' };
  } catch (error) {
    console.error('❌ Error sending admin notification:', error);
    return { success: false, message: 'Failed to send notification' };
  }
}

function passwordResetEmailHTML(resetURL: string, email: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1E5A7A 0%, #154A66 100%); color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
        .button { display: inline-block; background: linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 3px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
          <p>KATHIR Admin Portal</p>
        </div>

        <div class="content">
          <p>Hello,</p>
          <p>We received a request to reset your admin account password. Click the button below to create a new password:</p>

          <center>
            <a href="${resetURL}" class="button">Reset Your Password</a>
          </center>

          <p>Or copy this link: <br><code>${resetURL}</code></p>

          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <ul>
              <li>This link expires in 24 hours</li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Never share this link with anyone</li>
              <li>Password must be at least 8 characters long</li>
            </ul>
          </div>

          <div class="footer">
            <p><strong>KATHIR LTD</strong></p>
            <p>Admin Portal | Secure Access</p>
            <p>© 2026 KATHIR LTD. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function accessApprovedEmailHTML(name: string, loginURL: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%); color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
        .success { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 3px; color: #155724; }
        .button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .features { background: #e7f3ff; padding: 15px; border-radius: 3px; }
        .features ul { margin: 10px 0; padding-left: 20px; }
        .features li { margin: 8px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Welcome to Admin Portal</h1>
          <p>Your access has been approved!</p>
        </div>

        <div class="content">
          <p>Hello <strong>${name}</strong>,</p>

          <div class="success">
            <strong>Great news!</strong> Your admin access request has been approved. You can now access the KATHIR admin portal.
          </div>

          <center>
            <a href="${loginURL}" class="button">Login to Admin Portal</a>
          </center>

          <h3>Available Features:</h3>
          <div class="features">
            <ul>
              <li>📦 Order Management & Tracking</li>
              <li>📊 Analytics & Reports</li>
              <li>📄 Invoice Generation</li>
              <li>👥 Team Management</li>
              <li>💼 Business Reports</li>
            </ul>
          </div>

          <p><strong>Login URL:</strong> <br><code>${loginURL}</code></p>

          <div class="footer">
            <p>Questions? Contact the admin team at <strong>admin@kathir.co.uk</strong></p>
            <p><strong>KATHIR LTD</strong> | Admin Portal</p>
            <p>© 2026 KATHIR LTD. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function accessRejectedEmailHTML(name: string, reason: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
        .info { background: #f0f0f0; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 3px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Admin Access Request Status</h1>
        </div>

        <div class="content">
          <p>Hello <strong>${name}</strong>,</p>

          <p>Thank you for your interest in joining the KATHIR admin team. Unfortunately, we are unable to approve your access request at this time.</p>

          <div class="info">
            <strong>Reason:</strong><br>
            ${reason || 'No specific reason provided.'}
          </div>

          <p>If you believe this is a mistake or would like more information, please contact the admin team at <strong>admin@kathir.co.uk</strong></p>

          <div class="footer">
            <p><strong>KATHIR LTD</strong></p>
            <p>© 2026 KATHIR LTD. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function adminAccessRequestNotificationHTML(requesterName: string, requesterEmail: string, approvalURL: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%); color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
        .request-info { background: #e7f3ff; border-left: 4px solid #2D7BA8; padding: 15px; margin: 20px 0; border-radius: 3px; }
        .button { display: inline-block; background: #2D7BA8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 New Admin Access Request</h1>
        </div>

        <div class="content">
          <p>A new admin access request has been submitted and is pending your review.</p>

          <div class="request-info">
            <p><strong>Requester Name:</strong> ${requesterName}</p>
            <p><strong>Email:</strong> ${requesterEmail}</p>
            <p><strong>Status:</strong> Pending Review</p>
            <p><strong>Action Required:</strong> Approve or Reject</p>
          </div>

          <p>Click the button below to review and manage this request:</p>

          <center>
            <a href="${approvalURL}" class="button">Review Requests</a>
          </center>

          <p><strong>Direct Link:</strong><br><code>${approvalURL}</code></p>
        </div>
      </div>
    </body>
    </html>
  `;
}
