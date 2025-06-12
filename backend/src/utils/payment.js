const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { AppError } = require('../middleware/errorHandler');

/**
 * Créer une intention de paiement Stripe
 */
async function createPaymentIntent({
  amount,
  currency = 'eur',
  order_id,
  customer_email,
  payment_method_id = null,
  automatic_payment_methods = true
}) {
  try {
    const paymentIntentData = {
      amount: Math.round(amount), // Stripe attend des centimes
      currency: currency.toLowerCase(),
      metadata: {
        order_id: order_id.toString()
      },
      receipt_email: customer_email,
      description: `Commande #${order_id}`
    };

    if (payment_method_id) {
      paymentIntentData.payment_method = payment_method_id;
      paymentIntentData.confirm = true;
      paymentIntentData.return_url = `${process.env.FRONTEND_URL}/orders/${order_id}/confirmation`;
    } else if (automatic_payment_methods) {
      paymentIntentData.automatic_payment_methods = {
        enabled: true
      };
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);
    
    return {
      success: true,
      payment_intent: paymentIntent
    };
  } catch (error) {
    console.error('Erreur lors de la création de l\'intention de paiement:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Confirmer un paiement
 */
async function confirmPayment(payment_intent_id, payment_method_id) {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(payment_intent_id, {
      payment_method: payment_method_id,
      return_url: `${process.env.FRONTEND_URL}/payment/return`
    });
    
    return {
      success: true,
      payment_intent: paymentIntent
    };
  } catch (error) {
    console.error('Erreur lors de la confirmation du paiement:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Récupérer une intention de paiement
 */
async function retrievePaymentIntent(payment_intent_id) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
    
    return {
      success: true,
      payment_intent: paymentIntent
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'intention de paiement:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Annuler une intention de paiement
 */
async function cancelPaymentIntent(payment_intent_id) {
  try {
    const paymentIntent = await stripe.paymentIntents.cancel(payment_intent_id);
    
    return {
      success: true,
      payment_intent: paymentIntent
    };
  } catch (error) {
    console.error('Erreur lors de l\'annulation de l\'intention de paiement:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Traiter un remboursement
 */
async function processRefund({ payment_id, amount, reason = 'requested_by_customer' }) {
  try {
    const refundData = {
      payment_intent: payment_id,
      reason
    };

    if (amount) {
      refundData.amount = Math.round(amount);
    }

    const refund = await stripe.refunds.create(refundData);
    
    return {
      success: true,
      refund_id: refund.id,
      amount: refund.amount / 100,
      status: refund.status,
      refund
    };
  } catch (error) {
    console.error('Erreur lors du traitement du remboursement:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Récupérer un remboursement
 */
async function retrieveRefund(refund_id) {
  try {
    const refund = await stripe.refunds.retrieve(refund_id);
    
    return {
      success: true,
      refund
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du remboursement:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Créer un client Stripe
 */
async function createCustomer({ email, name, phone = null, address = null }) {
  try {
    const customerData = {
      email,
      name
    };

    if (phone) {
      customerData.phone = phone;
    }

    if (address) {
      customerData.address = address;
    }

    const customer = await stripe.customers.create(customerData);
    
    return {
      success: true,
      customer
    };
  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Mettre à jour un client Stripe
 */
async function updateCustomer(customer_id, updateData) {
  try {
    const customer = await stripe.customers.update(customer_id, updateData);
    
    return {
      success: true,
      customer
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du client:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Récupérer les méthodes de paiement d'un client
 */
async function getCustomerPaymentMethods(customer_id, type = 'card') {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer_id,
      type
    });
    
    return {
      success: true,
      payment_methods: paymentMethods.data
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des méthodes de paiement:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Attacher une méthode de paiement à un client
 */
async function attachPaymentMethod(payment_method_id, customer_id) {
  try {
    const paymentMethod = await stripe.paymentMethods.attach(payment_method_id, {
      customer: customer_id
    });
    
    return {
      success: true,
      payment_method: paymentMethod
    };
  } catch (error) {
    console.error('Erreur lors de l\'attachement de la méthode de paiement:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Détacher une méthode de paiement d'un client
 */
async function detachPaymentMethod(payment_method_id) {
  try {
    const paymentMethod = await stripe.paymentMethods.detach(payment_method_id);
    
    return {
      success: true,
      payment_method: paymentMethod
    };
  } catch (error) {
    console.error('Erreur lors du détachement de la méthode de paiement:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Gérer les webhooks Stripe
 */
async function handleWebhook(payload, signature) {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    return event;
  } catch (error) {
    console.error('Erreur lors de la vérification du webhook:', error);
    throw new AppError('Signature du webhook invalide', 400);
  }
}

/**
 * Calculer les frais de service
 */
function calculateServiceFee(amount, percentage = 2.9, fixed = 0.30) {
  const percentageFee = (amount * percentage) / 100;
  const totalFee = percentageFee + fixed;
  return Math.round(totalFee * 100) / 100; // Arrondir à 2 décimales
}

/**
 * Valider un montant de paiement
 */
function validatePaymentAmount(amount, currency = 'eur') {
  const minAmounts = {
    eur: 0.50,
    usd: 0.50,
    gbp: 0.30
  };

  const maxAmounts = {
    eur: 999999.99,
    usd: 999999.99,
    gbp: 999999.99
  };

  const minAmount = minAmounts[currency.toLowerCase()] || 0.50;
  const maxAmount = maxAmounts[currency.toLowerCase()] || 999999.99;

  if (amount < minAmount) {
    throw new AppError(`Le montant minimum est de ${minAmount} ${currency.toUpperCase()}`, 400);
  }

  if (amount > maxAmount) {
    throw new AppError(`Le montant maximum est de ${maxAmount} ${currency.toUpperCase()}`, 400);
  }

  return true;
}

/**
 * Formater un montant pour l'affichage
 */
function formatAmount(amount, currency = 'EUR') {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase()
  }).format(amount);
}

/**
 * Obtenir les devises supportées
 */
function getSupportedCurrencies() {
  return [
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' }
  ];
}

/**
 * Vérifier si une devise est supportée
 */
function isCurrencySupported(currency) {
  const supportedCurrencies = getSupportedCurrencies();
  return supportedCurrencies.some(c => c.code === currency.toUpperCase());
}

/**
 * Obtenir les informations d'une carte de crédit
 */
function getCardInfo(paymentMethod) {
  if (paymentMethod.type !== 'card') {
    return null;
  }

  const card = paymentMethod.card;
  return {
    brand: card.brand,
    last4: card.last4,
    exp_month: card.exp_month,
    exp_year: card.exp_year,
    country: card.country,
    funding: card.funding
  };
}

module.exports = {
  createPaymentIntent,
  confirmPayment,
  retrievePaymentIntent,
  cancelPaymentIntent,
  processRefund,
  retrieveRefund,
  createCustomer,
  updateCustomer,
  getCustomerPaymentMethods,
  attachPaymentMethod,
  detachPaymentMethod,
  handleWebhook,
  calculateServiceFee,
  validatePaymentAmount,
  formatAmount,
  getSupportedCurrencies,
  isCurrencySupported,
  getCardInfo
};