import puppeteer from 'puppeteer';

export async function generateInvoicePdf(baseUrl: string, orderId: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.emulateMediaType('print');

    const url = `${baseUrl}/invoice?orderId=${encodeURIComponent(orderId)}`;
    const response = await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    if (!response || !response.ok()) {
      throw new Error(`Failed to load invoice page: ${response?.status()}`);
    }

    await page.waitForSelector('[data-invoice-ready="true"]', { timeout: 10000 });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
