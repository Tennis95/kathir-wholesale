import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize user input to prevent XSS attacks
 * @param dirty The user input to sanitize
 * @returns Clean HTML safe for display
 */
export function sanitizeInput(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // No HTML tags allowed for text input
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
}

/**
 * Sanitize HTML content (more permissive, for rich text)
 * @param dirty The HTML content to sanitize
 * @returns Clean HTML safe for display
 */
export function sanitizeHTML(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize email input
 * @param email The email to sanitize
 * @returns Clean email
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }

  // Remove any HTML/script content
  const clean = DOMPurify.sanitize(email, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });

  // Trim whitespace
  return clean.trim().toLowerCase();
}

/**
 * Sanitize phone number
 * @param phone The phone number to sanitize
 * @returns Clean phone number
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  // Remove anything that's not digits, +, -, (), or space
  return phone.replace(/[^\d+\-() ]/g, '').trim();
}

/**
 * Sanitize URL
 * @param url The URL to sanitize
 * @returns Clean URL
 */
export function sanitizeURL(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  try {
    // Ensure the URL is valid
    const parsed = new URL(url);

    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }

    return parsed.toString();
  } catch {
    return '';
  }
}
