// Email service - logs emails for now, can be integrated with real SMTP later
const logEmail = (to: string, subject: string, html: string) => {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 EMAIL SENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: ${to}
Subject: ${subject}
Body: ${html.substring(0, 200)}...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
};

interface InvoiceData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ name: string; quantity: number }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
}

export async function sendInvoiceEmail(invoiceData: InvoiceData, adminEmail: string) {
  const itemsHtml = invoiceData.items
    .map(item => `<tr><td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td><td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">Qty: ${item.quantity}</td></tr>`)
    .join('');

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0;">KATHIR LTD</h1>
        <p style="margin: 5px 0 0 0;">Premium Wholesale Groceries</p>
      </div>

      <div style="background: white; padding: 20px; border: 1px solid #ddd; border-top: none;">
        <h2 style="color: #2D7BA8; margin-top: 0;">Order Invoice</h2>

        <p><strong>Order Number:</strong> ${invoiceData.orderNumber}</p>
        <p><strong>Order Date:</strong> ${new Date(invoiceData.createdAt).toLocaleDateString()}</p>
        <p><strong>Customer Name:</strong> ${invoiceData.customerName}</p>

        <h3 style="color: #2D7BA8; margin-top: 20px;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #E8F4FB;">
              <th style="padding: 8px; text-align: left; font-weight: bold;">Product</th>
              <th style="padding: 8px; text-align: center; font-weight: bold;">Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <h3 style="color: #2D7BA8; margin-top: 20px;">Shipping Address</h3>
        <p style="margin: 5px 0;">
          ${invoiceData.shippingAddress.street}<br>
          ${invoiceData.shippingAddress.city}, ${invoiceData.shippingAddress.state}<br>
          ${invoiceData.shippingAddress.zipCode}<br>
          ${invoiceData.shippingAddress.country}
        </p>

        <div style="background: #F0F9FE; padding: 15px; border-radius: 5px; margin-top: 20px; text-align: center;">
          <p style="color: #2D7BA8; font-size: 14px; margin: 0;">Thank you for your order!</p>
          <p style="color: #666; font-size: 12px; margin: 5px 0 0 0;">We will process your order shortly and send you a tracking number.</p>
        </div>
      </div>

      <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0;">© 2026 KATHIR LTD. All rights reserved.</p>
        <p style="margin: 5px 0 0 0;">For support, contact: sales@kathirltd.co.uk</p>
      </div>
    </div>
  `;

  try {
    // Log customer invoice
    logEmail(
      invoiceData.customerEmail,
      `Order Confirmation - ${invoiceData.orderNumber}`,
      htmlTemplate
    );

    // Log admin notification
    if (adminEmail) {
      logEmail(
        adminEmail,
        `New Order Received - ${invoiceData.orderNumber}`,
        `<p>New order from ${invoiceData.customerName}</p>${htmlTemplate}`
      );
    }

    return { success: true };
  } catch (error) {
    console.error('Email logging failed:', error);
    return { success: false, error };
  }
}
