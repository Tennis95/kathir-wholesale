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
    .map((item, idx) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${idx + 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">-</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">-</td>
      </tr>
    `)
    .join('');

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; background: white;">
      <!-- Header -->
      <div style="border-bottom: 2px solid #2D7BA8; padding-bottom: 15px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h1 style="margin: 0; color: #2D7BA8; font-size: 24px;">KATHIR LTD</h1>
            <p style="margin: 5px 0; color: #666; font-size: 13px;">Premium Wholesale Groceries</p>
            <p style="margin: 5px 0; color: #666; font-size: 12px;">
              31, Retail Park, London<br>
              Phone: +44 20 XXXX XXXX<br>
              Email: sales@kathirltd.co.uk
            </p>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; color: #2D7BA8; font-size: 20px;">TAX INVOICE</h2>
          </div>
        </div>
      </div>

      <!-- Bill To & Invoice Details -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div style="flex: 1;">
          <p style="margin: 0; font-weight: bold; color: #333;">BILL TO</p>
          <p style="margin: 5px 0 0 0; color: #666; font-size: 13px;">
            <strong>${invoiceData.customerName}</strong><br>
            ${invoiceData.shippingAddress.street}<br>
            ${invoiceData.shippingAddress.city}, ${invoiceData.shippingAddress.state}<br>
            ${invoiceData.shippingAddress.zipCode}<br>
            ${invoiceData.shippingAddress.country}
          </p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; font-size: 12px; color: #666;">
            <strong>Invoice No.:</strong> ${invoiceData.orderNumber}<br>
            <strong>Date:</strong> ${new Date(invoiceData.createdAt).toLocaleDateString('en-GB')}
          </p>
        </div>
      </div>

      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background: #2D7BA8; color: white;">
            <th style="padding: 10px; text-align: left; font-weight: bold;">#</th>
            <th style="padding: 10px; text-align: left; font-weight: bold;">Item Name</th>
            <th style="padding: 10px; text-align: center; font-weight: bold;">Quantity</th>
            <th style="padding: 10px; text-align: right; font-weight: bold;">Price/Unit</th>
            <th style="padding: 10px; text-align: right; font-weight: bold;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr style="background: #E8F4FB; font-weight: bold;">
            <td colspan="2" style="padding: 10px; text-align: right;"><strong>TOTAL</strong></td>
            <td style="padding: 10px; text-align: center; border-top: 2px solid #2D7BA8;">${invoiceData.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
            <td style="padding: 10px; text-align: right; border-top: 2px solid #2D7BA8;">-</td>
            <td style="padding: 10px; text-align: right; border-top: 2px solid #2D7BA8;">-</td>
          </tr>
        </tbody>
      </table>

      <!-- Summary -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div style="flex: 1;">
          <p style="margin: 0; font-weight: bold; color: #333;">Terms And Conditions</p>
          <p style="margin: 5px 0; color: #666; font-size: 12px;">Thank you for your order. We will process and ship your order shortly.</p>
        </div>
        <div style="width: 300px;">
          <div style="border: 1px solid #ddd; padding: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
              <span>Sub Total:</span>
              <span style="font-weight: bold;">-</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
              <span>Discount:</span>
              <span style="font-weight: bold;">-</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 2px solid #2D7BA8; border-bottom: 2px solid #2D7BA8; font-size: 14px; font-weight: bold; color: #2D7BA8;">
              <span>TOTAL:</span>
              <span>-</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; color: #666;">
              <span>Received:</span>
              <span>£ 0.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 12px; color: #666;">
              <span>Current Balance:</span>
              <span style="font-weight: bold;">-</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 2px solid #2D7BA8; padding-top: 15px; font-size: 11px; color: #666;">
        <p style="margin: 0;">VAT Number: [Your VAT]</p>
        <p style="margin: 5px 0; text-align: center;">© 2026 KATHIR LTD. All rights reserved. | For support contact: sales@kathirltd.co.uk</p>
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
