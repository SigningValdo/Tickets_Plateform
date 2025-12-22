/**
 * Notchpay Payment Integration
 * Documentation: https://developer.notchpay.co/
 */

const NOTCHPAY_API_URL = "https://api.notchpay.co";

export interface NotchpayPaymentParams {
  orderId: string;
  amount: number;
  currency?: string;
  email: string;
  phone: string;
  name: string;
  callbackUrl: string;
  description?: string;
}

export interface NotchpayPaymentResponse {
  status: string;
  message: string;
  code?: number;
  transaction?: {
    reference: string;
    amount: number;
    currency: string;
    status: string;
    customer: {
      name: string;
      email: string;
      phone: string;
    };
    created_at: string;
  };
  authorization_url?: string;
}

export interface NotchpayVerifyResponse {
  status: string;
  message: string;
  transaction?: {
    reference: string;
    amount: number;
    currency: string;
    status: string;
    customer: {
      name: string;
      email: string;
      phone: string;
    };
    metadata?: {
      orderId?: string;
    };
  };
}

/**
 * Initialize a Notchpay payment
 */
export async function initNotchpayPayment({
  orderId,
  amount,
  currency = "XAF",
  email,
  phone,
  name,
  callbackUrl,
  description,
}: NotchpayPaymentParams): Promise<NotchpayPaymentResponse> {
  const apiKey = process.env.NOTCHPAY_PUBLIC_KEY;

  if (!apiKey) {
    throw new Error("NOTCHPAY_PUBLIC_KEY is not configured");
  }

  const reference = `FZ-${orderId}-${Date.now()}`;

  const payload = {
    amount,
    currency,
    description: description || `Achat de billets - Commande ${orderId}`,
    reference,
    callback: callbackUrl,
    customer: {
      name,
      email,
      phone,
    },
    metadata: {
      orderId,
      source: "fanzone-tickets",
    },
  };

  const response = await fetch(`${NOTCHPAY_API_URL}/payments`, {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Notchpay error:", data);
    throw new Error(data.message || "Notchpay payment initialization failed");
  }

  return data;
}

/**
 * Verify a Notchpay payment by reference
 */
export async function verifyNotchpayPayment(
  reference: string
): Promise<NotchpayVerifyResponse> {
  const apiKey = process.env.NOTCHPAY_PUBLIC_KEY;

  if (!apiKey) {
    throw new Error("NOTCHPAY_PUBLIC_KEY is not configured");
  }

  const response = await fetch(`${NOTCHPAY_API_URL}/payments/${reference}`, {
    method: "GET",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Notchpay verification error:", data);
    throw new Error(data.message || "Payment verification failed");
  }

  return data;
}

/**
 * Validate Notchpay webhook signature using HMAC-SHA256
 * Returns false if validation fails - NEVER accept unvalidated webhooks
 */
export function validateNotchpayWebhook(
  signature: string | null,
  payload: string
): boolean {
  const webhookSecret = process.env.NOTCHPAY_WEBHOOK_SECRET;

  // CRITICAL: Reject if no secret configured
  if (!webhookSecret || webhookSecret === "your_webhook_secret") {
    console.error("NOTCHPAY_WEBHOOK_SECRET not properly configured");
    return false;
  }

  // Reject if no signature provided
  if (!signature) {
    console.error("No webhook signature provided");
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  try {
    const crypto = require("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");

    // Timing-safe comparison
    const signatureBuffer = Buffer.from(signature, "utf8");
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch (error) {
    console.error("Webhook signature validation error:", error);
    return false;
  }
}

/**
 * Validate webhook timestamp to prevent replay attacks
 * Rejects webhooks older than 5 minutes
 */
export function validateWebhookTimestamp(timestamp: string | null): boolean {
  if (!timestamp) {
    return true; // Some webhooks may not have timestamp
  }

  const webhookTime = new Date(timestamp).getTime();
  const currentTime = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  return currentTime - webhookTime < fiveMinutes;
}
