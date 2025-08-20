export const placeMobileMoneyPayment = async ({
  orderId,
  amount,
  currency,
  email,
  phone,
  customer,
  description,
  reference,
  callback,
  locked_currency,
  locked_channel,
  locked_country,
  items,
  shipping,
  address,
  customer_meta,
}: {
  orderId: string;
  amount: number;
  currency: string;
  email: string;
  phone: string;
  customer: string;
  description: string;
  reference: string;
  callback: string;
  locked_currency: string;
  locked_channel: string;
  locked_country: string;
  items: any[];
  shipping: any;
  address: any;
  customer_meta: any;
}): Promise<MobileMoneyPayment | undefined> => {
  const url = "https://api.notchpay.co/payments";
  const options = {
    method: "POST",
    headers: {
      Authorization: process.env.NOTCHPAY_KEY!,
      "Content-Type": "application/json",
    },
    body: `{"amount":${amount},"currency":"XAF","email":"${email}","phone":${phone},"customer":"cus_123456789","description":"Paiement pour commande","reference":"${reference}","callback":"${callback}","locked_currency":"XAF","locked_channel":"cm.mtn","locked_country":"CM","items":[{}],"shipping":{},"address":{},"customer_meta":{"orderId": "${orderId}"}}`,
    // body: JSON.stringify({
    //   amount,
    //   currency,
    //   email,
    //   phone,
    //   customer: [customer],
    //   description,
    //   reference,
    //   callback,
    //   locked_currency,
    //   locked_channel: [locked_channel],
    //   locked_country,
    //   items,
    //   shipping,
    //   address,
    //   customer_meta,
    // }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export interface MobileMoneyPayment {
  status?: string;
  message?: string;
  code?: number;
  transaction?: Transaction;
  authorization_url?: string;
}

interface Transaction {
  id?: string;
  reference?: string;
  amount?: number;
  currency?: string;
  status?: string;
  customer?: string;
  created_at?: Date;
  completed_at?: Date;
  payment_method?: string;
}
