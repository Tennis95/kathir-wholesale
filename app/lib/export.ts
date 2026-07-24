/**
 * Export utilities for CSV and other formats
 */

interface ExportOptions {
  filename?: string;
  headers?: string[];
  dateFormat?: string;
}

/**
 * Convert data to CSV format
 */
export function convertToCSV(data: any[], headers?: string[]): string {
  if (!data || data.length === 0) {
    return '';
  }

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);

  // Convert headers to CSV row
  const headerRow = csvHeaders.map(h => `"${h}"`).join(',');

  // Convert data rows to CSV
  const dataRows = data.map(row =>
    csvHeaders
      .map(header => {
        const value = row[header];
        // Handle different data types
        if (value === null || value === undefined) {
          return '';
        }
        if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`;
        }
        if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        return value.toString();
      })
      .join(',')
  );

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Download CSV file to user's computer
 */
export function downloadCSV(data: any[], filename: string = 'export.csv', headers?: string[]) {
  const csv = convertToCSV(data, headers);
  downloadFile(csv, filename, 'text/csv');
}

/**
 * Download JSON file
 */
export function downloadJSON(data: any, filename: string = 'export.json') {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
}

/**
 * Generic file download helper
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Format export data for orders
 */
export function formatOrdersForExport(orders: any[]): any[] {
  return orders.map(order => ({
    'Order ID': order.orderNumber || order._id,
    'Customer Name': order.userId?.name || 'N/A',
    'Customer Email': order.userId?.email || 'N/A',
    'Total Amount': `£${(order.total || 0).toFixed(2)}`,
    'Status': order.status?.charAt(0).toUpperCase() + order.status?.slice(1),
    'Payment Status': order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1),
    'Order Date': new Date(order.createdAt).toLocaleDateString('en-GB'),
    'Items Count': order.items?.length || 0,
    'Shipping Address': `${order.shippingAddress?.street}, ${order.shippingAddress?.city}`,
  }));
}

/**
 * Format export data for users
 */
export function formatUsersForExport(users: any[]): any[] {
  return users.map(user => ({
    'User ID': user._id,
    'Name': user.name,
    'Email': user.email,
    'Phone': user.phone || 'N/A',
    'Role': user.role,
    'Status': user.isActive ? 'Active' : 'Inactive',
    'Joined Date': new Date(user.createdAt).toLocaleDateString('en-GB'),
    'Total Orders': user.orderCount || 0,
  }));
}

/**
 * Format export data for analytics
 */
export function formatAnalyticsForExport(data: any): string {
  const lines = [
    'KATHIR LTD - Analytics Report',
    `Generated: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB')}`,
    '',
    'KEY METRICS',
    `Total Orders: ${data.totalOrders || 0}`,
    `Total Revenue: £${(data.totalRevenue || 0).toFixed(2)}`,
    `Active Customers: ${data.activeCustomers || 0}`,
    `Total Products: ${data.totalProducts || 0}`,
    '',
  ];

  if (data.ordersByStatus) {
    lines.push('ORDERS BY STATUS');
    Object.entries(data.ordersByStatus).forEach(([status, count]) => {
      lines.push(`${status}: ${count}`);
    });
    lines.push('');
  }

  if (data.topProducts) {
    lines.push('TOP SELLING PRODUCTS');
    data.topProducts.slice(0, 10).forEach((product: any, index: number) => {
      lines.push(`${index + 1}. ${product.name} - ${product.count} sold`);
    });
  }

  return lines.join('\n');
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(prefix: string, extension: string = 'csv'): string {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${prefix}_${timestamp}.${extension}`;
}
