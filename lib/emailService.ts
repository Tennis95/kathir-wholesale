import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password',
  },
});

export async function sendOrderEmail(order: any, pdfBuffer: Buffer) {
  try {
    const businessEmail = process.env.BUSINESS_EMAIL || 'orders@kathir.co.uk';
    const attachments = [
      {
        filename: `Invoice-${order.invoiceNo || order.orderId}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ];

    // Send to customer
    if (order.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER || 'orders@kathir.co.uk',
        to: order.email,
        subject: `Order Confirmation - ${order.orderId}`,
        html: customerEmailHTML(order),
        attachments,
      });
      console.log(`Invoice email sent to customer: ${order.email}`);
    }

    // Send to admin/business
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'orders@kathir.co.uk',
      to: businessEmail,
      subject: `New Order Received - ${order.orderId}`,
      html: adminEmailHTML(order),
      attachments,
    });
    console.log(`Invoice email sent to admin: ${businessEmail}`);

    return { success: true, message: 'Invoice emails sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send invoice email' };
  }
}

function customerEmailHTML(order: any): string {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-GB');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #A0522D; padding-bottom: 20px; }
        .header h1 { color: #A0522D; margin: 0; }
        .box { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>KATHIR LTD</h1>
          <p>Sowing • Reaping • Giving the Best</p>
        </div>

        <p>Dear ${order.fullName || 'Customer'},</p>
        <p>Thank you for your order request. We've received it and it is currently <strong>${order.status}</strong>. Your invoice is attached to this email as a PDF.</p>

        <div class="box">
          <p><strong>Order No.:</strong> ${order.orderId}</p>
          <p><strong>Invoice No.:</strong> ${order.invoiceNo}</p>
          <p><strong>Order Date:</strong> ${orderDate}</p>
          <p><strong>Total Amount:</strong> £${(order.totalAmount || 0).toFixed(2)}</p>
        </div>

        <p>Our team will review your order and be in touch shortly to confirm delivery details.</p>

        <div class="footer">
          <p><strong>KATHIR LTD</strong></p>
          <p>Phone: +44 (0) 1925 XXX XXX | Email: orders@kathir.co.uk</p>
          <p>ISO 9001 Certified | Food Safety Standards | VAT Registered</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function adminEmailHTML(order: any): string {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-GB');
  const addr = order.deliveryAddress || {};
  const items = order.items || [];

  let itemsHTML = '';
  items.forEach((item: any) => {
    const product = item.product || {};
    itemsHTML += `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${product.name || '-'}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">£${(item.price || 0).toFixed(2)}</td>
      </tr>
    `;
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #A0522D; padding-bottom: 20px; }
        .header h1 { color: #A0522D; margin: 0; }
        .box { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background: #B3E5FC; padding: 8px; text-align: left; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Order Received</h1>
        </div>

        <div class="box">
          <p><strong>Order No.:</strong> ${order.orderId}</p>
          <p><strong>Invoice No.:</strong> ${order.invoiceNo}</p>
          <p><strong>Date &amp; Time:</strong> ${orderDate}</p>
          <p><strong>Status:</strong> ${order.status}</p>
        </div>

        <div class="box">
          <p><strong>Customer:</strong> ${order.fullName}</p>
          ${order.companyName ? `<p><strong>Company:</strong> ${order.companyName}</p>` : ''}
          <p><strong>Email:</strong> ${order.email}</p>
          <p><strong>Mobile:</strong> ${order.mobile}</p>
        </div>

        <div class="box">
          <p><strong>Delivery Address:</strong></p>
          <p>${addr.addressLine1 || ''} ${addr.addressLine2 || ''}<br>
          ${addr.city || ''}, ${addr.county || ''}<br>
          ${addr.postcode || ''}, ${addr.country || ''}</p>
        </div>

        <table>
          <thead><tr><th>Product</th><th>Qty</th><th>Price</th></tr></thead>
          <tbody>${itemsHTML}</tbody>
        </table>

        <p><strong>Total Amount: £${(order.totalAmount || 0).toFixed(2)}</strong></p>

        ${order.notes ? `<div class="box"><strong>Notes:</strong><p>${order.notes}</p></div>` : ''}

        <p style="margin-top: 20px; font-size: 0.9em; color: #666;">Full invoice is attached as a PDF.</p>
      </div>
    </body>
    </html>
  `;
}
