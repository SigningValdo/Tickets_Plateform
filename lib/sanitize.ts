/**
 * Input Sanitization Utilities
 * Protects against XSS, SQL injection, and other input-based attacks
 */

/**
 * Sanitize a string by escaping HTML entities
 * Prevents XSS attacks when the string is rendered in HTML
 */
export function escapeHtml(str: string): string {
  if (typeof str !== "string") return "";

  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
  };

  return str.replace(/[&<>"'`=/]/g, (char) => htmlEscapes[char] || char);
}

/**
 * Strip HTML tags from a string
 * More aggressive than escaping - removes all HTML
 */
export function stripHtml(str: string): string {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim();
}

/**
 * Sanitize a string for safe storage and display
 * - Trims whitespace
 * - Removes null bytes
 * - Limits length
 */
export function sanitizeString(str: string, maxLength = 1000): string {
  if (typeof str !== "string") return "";

  return str
    .replace(/\0/g, "") // Remove null bytes
    .trim()
    .slice(0, maxLength);
}

/**
 * Sanitize user input that will be displayed as plain text
 * Use this for names, addresses, etc.
 */
export function sanitizeText(str: string, maxLength = 500): string {
  if (typeof str !== "string") return "";

  return sanitizeString(str, maxLength)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Remove control characters
    .trim();
}

/**
 * Sanitize email address
 * - Validates format
 * - Lowercases
 * - Trims
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== "string") return "";

  const sanitized = email.toLowerCase().trim();

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return "";
  }

  return sanitized;
}

/**
 * Sanitize phone number
 * - Removes non-numeric characters except + and spaces
 * - Validates basic format
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== "string") return "";

  // Keep only digits, +, spaces, and hyphens
  const sanitized = phone.replace(/[^\d+\s-]/g, "").trim();

  // Basic validation: at least 8 digits
  const digitsOnly = sanitized.replace(/\D/g, "");
  if (digitsOnly.length < 8 || digitsOnly.length > 15) {
    return "";
  }

  return sanitized;
}

/**
 * Sanitize HTML content that allows some safe tags
 * For rich text content like event descriptions
 * Uses allowlist approach for maximum security
 */
export function sanitizeRichText(html: string, maxLength = 10000): string {
  if (typeof html !== "string") return "";

  // First, limit length
  let sanitized = html.slice(0, maxLength);

  // Remove script tags and their content
  sanitized = sanitized.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "");

  // Remove javascript: urls
  sanitized = sanitized.replace(/javascript:/gi, "");

  // Remove data: urls (can be used for XSS)
  sanitized = sanitized.replace(/data:/gi, "");

  // Remove style tags
  sanitized = sanitized.replace(
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    ""
  );

  // Remove iframe, object, embed, form
  sanitized = sanitized.replace(/<(iframe|object|embed|form)[^>]*>.*?<\/\1>/gi, "");
  sanitized = sanitized.replace(/<(iframe|object|embed|form)[^>]*\/?>/gi, "");

  // Remove base tags
  sanitized = sanitized.replace(/<base[^>]*\/?>/gi, "");

  return sanitized.trim();
}

/**
 * Sanitize a URL
 * - Validates protocol
 * - Prevents javascript: and data: URLs
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== "string") return "";

  const trimmed = url.trim();

  // Allow empty strings
  if (!trimmed) return "";

  // Check for dangerous protocols
  const lowerUrl = trimmed.toLowerCase();
  if (
    lowerUrl.startsWith("javascript:") ||
    lowerUrl.startsWith("data:") ||
    lowerUrl.startsWith("vbscript:")
  ) {
    return "";
  }

  // Allow http, https, and relative URLs
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("./")
  ) {
    return trimmed;
  }

  // If no protocol, assume it's a relative URL or add https
  if (!trimmed.includes("://")) {
    // Check if it looks like a domain
    if (/^[\w-]+\.[\w.-]+/.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  }

  return "";
}

/**
 * Sanitize an ID (cuid, uuid, etc.)
 * - Only allows alphanumeric and hyphens
 */
export function sanitizeId(id: string): string {
  if (typeof id !== "string") return "";

  // Only allow alphanumeric characters and hyphens
  return id.replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 100);
}

/**
 * Sanitize a number input
 * Returns null if invalid
 */
export function sanitizeNumber(
  value: unknown,
  min = -Infinity,
  max = Infinity
): number | null {
  const num = typeof value === "string" ? parseFloat(value) : Number(value);

  if (isNaN(num) || !isFinite(num)) {
    return null;
  }

  if (num < min || num > max) {
    return null;
  }

  return num;
}

/**
 * Sanitize an integer input
 * Returns null if invalid
 */
export function sanitizeInteger(
  value: unknown,
  min = -Infinity,
  max = Infinity
): number | null {
  const num = sanitizeNumber(value, min, max);

  if (num === null) {
    return null;
  }

  return Math.floor(num);
}

/**
 * Sanitize order data for ticket purchase
 */
export interface SanitizedOrderData {
  name: string;
  email: string;
  phone: string;
  address: string;
  tickets: { quantity: number; ticketTypeId: string }[];
}

export function sanitizeOrderData(data: unknown): SanitizedOrderData | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const obj = data as Record<string, unknown>;

  const name = sanitizeText(String(obj.name || ""), 200);
  const email = sanitizeEmail(String(obj.email || ""));
  const phone = sanitizePhone(String(obj.phone || ""));
  const address = sanitizeText(String(obj.address || ""), 500);

  // Validate required fields
  if (!name || !email || !phone || !address) {
    return null;
  }

  // Sanitize tickets array
  if (!Array.isArray(obj.tickets) || obj.tickets.length === 0) {
    return null;
  }

  const tickets: { quantity: number; ticketTypeId: string }[] = [];

  for (const ticket of obj.tickets) {
    if (!ticket || typeof ticket !== "object") {
      return null;
    }

    const t = ticket as Record<string, unknown>;
    const quantity = sanitizeInteger(t.quantity, 1, 100);
    const ticketTypeId = sanitizeId(String(t.ticketTypeId || ""));

    if (quantity === null || !ticketTypeId) {
      return null;
    }

    tickets.push({ quantity, ticketTypeId });
  }

  return { name, email, phone, address, tickets };
}

/**
 * Sanitize event data for creation/update
 */
export interface SanitizedEventData {
  title: string;
  description: string;
  date: Date;
  location: string;
  address: string;
  city: string;
  country: string;
  organizer: string;
  imageUrl: string;
  categoryId: string;
  ticketTypes: { name: string; price: number; quantity: number }[];
}

export function sanitizeEventData(data: unknown): SanitizedEventData | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const obj = data as Record<string, unknown>;

  const title = sanitizeText(String(obj.title || ""), 200);
  const description = sanitizeRichText(String(obj.description || ""), 10000);
  const location = sanitizeText(String(obj.location || ""), 200);
  const address = sanitizeText(String(obj.address || ""), 500);
  const city = sanitizeText(String(obj.city || ""), 100);
  const country = sanitizeText(String(obj.country || ""), 100);
  const organizer = sanitizeText(String(obj.organizer || ""), 200);
  const imageUrl = sanitizeUrl(String(obj.imageUrl || ""));
  const categoryId = sanitizeId(String(obj.categoryId || ""));

  // Parse date
  const dateValue = obj.date;
  let date: Date;
  if (dateValue instanceof Date) {
    date = dateValue;
  } else if (typeof dateValue === "string" || typeof dateValue === "number") {
    date = new Date(dateValue);
  } else {
    return null;
  }

  if (isNaN(date.getTime())) {
    return null;
  }

  // Validate required fields
  if (
    !title ||
    !description ||
    !location ||
    !address ||
    !city ||
    !country ||
    !organizer ||
    !categoryId
  ) {
    return null;
  }

  // Sanitize ticket types
  if (!Array.isArray(obj.ticketTypes) || obj.ticketTypes.length === 0) {
    return null;
  }

  const ticketTypes: { name: string; price: number; quantity: number }[] = [];

  for (const tt of obj.ticketTypes) {
    if (!tt || typeof tt !== "object") {
      return null;
    }

    const t = tt as Record<string, unknown>;
    const name = sanitizeText(String(t.name || ""), 100);
    const price = sanitizeNumber(t.price, 0, 10000000);
    const quantity = sanitizeInteger(t.quantity, 1, 100000);

    if (!name || price === null || quantity === null) {
      return null;
    }

    ticketTypes.push({ name, price, quantity });
  }

  return {
    title,
    description,
    date,
    location,
    address,
    city,
    country,
    organizer,
    imageUrl,
    categoryId,
    ticketTypes,
  };
}
