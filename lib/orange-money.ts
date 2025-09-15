// Orange Money Web Payment (OM WebPay) minimal client
// NOTE: You must provide valid credentials via env vars:
// - ORANGE_CLIENT_ID
// - ORANGE_CLIENT_SECRET
// - ORANGE_API_BASE (default: https://api.orange.com)
// - ORANGE_MERCHANT_KEY (merchant identifier / key from Orange Money)
// - ORANGE_COUNTRY (e.g., "cm", "ci", "sn")
//
// This implementation follows the typical flow:
// 1) Get OAuth access token
// 2) Initialize a web payment to obtain a payment_url
//
// Exact fields may vary by Orange deployment/contract. Adjust as needed per your contract docs.

export async function getOrangeAccessToken(): Promise<string> {
  const base = process.env.ORANGE_API_BASE || "https://api.orange.com";
  const clientId = process.env.ORANGE_CLIENT_ID;
  const clientSecret = process.env.ORANGE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Orange Money credentials missing: ORANGE_CLIENT_ID/ORANGE_CLIENT_SECRET");
  }

  const tokenUrl = `${base}/oauth/v3/token`;
  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const resp = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Orange OAuth failed: ${resp.status} ${err}`);
  }
  const data = (await resp.json()) as { access_token: string };
  if (!data.access_token) throw new Error("No access_token in Orange OAuth response");
  return data.access_token;
}

export interface InitOrangePaymentInput {
  orderId: string;
  amount: number;
  currency: string; // e.g., "XAF" or "XOF"
  returnUrl: string; // URL where user returns after payment
  cancelUrl: string; // URL where user returns if cancelled
  notifUrl: string; // server webhook URL for notifications
  customerName?: string;
  customerPhone?: string;
}

export async function initOrangeWebPayment(input: InitOrangePaymentInput): Promise<{ payment_url: string }>{
  const base = process.env.ORANGE_API_BASE || "https://api.orange.com";
  const merchantKey = process.env.ORANGE_MERCHANT_KEY;
  const country = (process.env.ORANGE_COUNTRY || "cm").toLowerCase();

  if (!merchantKey) throw new Error("Missing ORANGE_MERCHANT_KEY");

  const accessToken = await getOrangeAccessToken();

  // Orange Money web payment endpoint. Some deployments require the country in path or query.
  // Common endpoint (may vary): /orange-money-webpay/v1/webpayment
  const url = `${base}/orange-money-webpay/v1/webpayment`;

  const payload = {
    order_id: input.orderId,
    amount: input.amount,
    currency: input.currency,
    merchant_key: merchantKey,
    return_url: input.returnUrl,
    cancel_url: input.cancelUrl,
    notif_url: input.notifUrl,
    lang: "fr",
    // Depending on your contract, you might include customer details:
    // payer_name / payer_phone etc. Uncomment if needed.
    // payer_name: input.customerName,
    // payer_phone: input.customerPhone,
    // Some integrations require a country parameter as query (?country=cm) instead of body. Adjust if needed.
  } as Record<string, any>;

  const resp = await fetch(`${url}?country=${encodeURIComponent(country)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Orange init payment failed: ${resp.status} ${err}`);
  }

  const data = (await resp.json()) as { payment_url?: string };
  if (!data.payment_url) throw new Error("No payment_url returned by Orange");
  return { payment_url: data.payment_url };
}
