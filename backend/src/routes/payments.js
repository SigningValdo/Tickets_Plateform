const express = require('express');
const { Payment, Order, User, Event } = require('../models');
const { authenticate, authorize, checkResourceOwnership } = require('../middleware/auth');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { processRefund, handleWebhook } = require('../utils/payment');
const { Op } = require('sequelize');
const { sequelize } = require('../models');

const router = express.Router();

// @desc    Obtenir tous les paiements (Admin) ou les paiements de l'utilisateur
// @route   GET /api/payments
// @access  Private
router.get('/', authenticate, catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    payment_method,
    user_id,
    date_from,
    date_to
  } = req.query;

  const offset = (page - 1) * limit;
  const whereClause = {};

  // Si l'utilisateur n'est pas admin, limiter à ses propres paiements
  if (req.user.role !== 'admin') {
    whereClause.user_id = req.user.id;
  } else if (user_id) {
    whereClause.user_id = user_id;
  }

  if (status) {
    whereClause.status = status;
  }

  if (payment_method) {
    whereClause.payment_method = payment_method;
  }

  if (date_from || date_to) {
    whereClause.created_at = {};
    if (date_from) {
      whereClause.created_at[Op.gte] = new Date(date_from);
    }
    if (date_to) {
      whereClause.created_at[Op.lte] = new Date(date_to);
    }
  }

  const { count, rows: payments } = await Payment.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: Order,
        as: 'order',
        attributes: ['id', 'order_number', 'status'],
        include: [
          {
            model: Event,
            as: 'event',
            attributes: ['id', 'title', 'start_date']
          }
        ]
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name', 'email']
      }
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(limit),
    offset: parseInt(offset)
  });

  res.json({
    success: true,
    data: {
      payments,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        total_items: count,
        items_per_page: parseInt(limit)
      }
    }
  });
}));

// @desc    Obtenir un paiement par ID
// @route   GET /api/payments/:id
// @access  Private (Owner/Admin)
router.get('/:id', authenticate, catchAsync(async (req, res, next) => {
  const whereClause = { id: req.params.id };
  
  // Si l'utilisateur n'est pas admin, limiter à ses propres paiements
  if (req.user.role !== 'admin') {
    whereClause.user_id = req.user.id;
  }

  const payment = await Payment.findOne({
    where: whereClause,
    include: [
      {
        model: Order,
        as: 'order',
        include: [
          {
            model: Event,
            as: 'event',
            attributes: ['id', 'title', 'start_date', 'venue_name']
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ]
      }
    ]
  });

  if (!payment) {
    return next(new AppError('Paiement non trouvé', 404));
  }

  res.json({
    success: true,
    data: {
      payment
    }
  });
}));

// @desc    Traiter un remboursement
// @route   POST /api/payments/:id/refund
// @access  Private (Admin)
router.post('/:id/refund', authenticate, authorize(['admin']), catchAsync(async (req, res, next) => {
  const { amount, reason } = req.body;
  
  const payment = await Payment.findByPk(req.params.id, {
    include: [
      {
        model: Order,
        as: 'order',
        include: [
          {
            model: Event,
            as: 'event',
            attributes: ['id', 'title']
          }
        ]
      }
    ]
  });

  if (!payment) {
    return next(new AppError('Paiement non trouvé', 404));
  }

  if (!payment.canRefund()) {
    return next(new AppError('Ce paiement ne peut pas être remboursé', 400));
  }

  const refundAmount = amount || payment.amount;
  
  if (refundAmount > (payment.amount - (payment.refund_amount || 0))) {
    return next(new AppError('Le montant du remboursement dépasse le montant disponible', 400));
  }

  try {
    // Traiter le remboursement via le processeur de paiement
    const refundResult = await processRefund({
      payment_id: payment.gateway_transaction_id,
      amount: Math.round(refundAmount * 100), // en centimes
      reason: reason || 'Requested by admin'
    });

    if (!refundResult.success) {
      return next(new AppError(refundResult.error || 'Échec du remboursement', 400));
    }

    // Mettre à jour le paiement
    const currentRefundAmount = payment.refund_amount || 0;
    payment.refund_amount = currentRefundAmount + refundAmount;
    payment.refund_reason = reason;
    payment.refund_transaction_id = refundResult.refund_id;
    payment.refunded_at = new Date();
    
    if (payment.refund_amount >= payment.amount) {
      payment.status = 'refunded';
    } else {
      payment.status = 'partially_refunded';
    }
    
    await payment.save();

    // Mettre à jour la commande
    const order = payment.order;
    if (payment.refund_amount >= payment.amount) {
      order.refund_status = 'completed';
      order.refunded_at = new Date();
    } else {
      order.refund_status = 'partial';
    }
    await order.save();

    res.json({
      success: true,
      message: 'Remboursement traité avec succès',
      data: {
        payment,
        refund: {
          amount: refundAmount,
          transaction_id: refundResult.refund_id,
          status: 'completed'
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors du traitement du remboursement:', error);
    return next(new AppError('Erreur lors du traitement du remboursement', 500));
  }
}));

// @desc    Webhook pour les notifications de paiement
// @route   POST /api/payments/webhook
// @access  Public (mais sécurisé par signature)
router.post('/webhook', express.raw({ type: 'application/json' }), catchAsync(async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  
  if (!signature) {
    return next(new AppError('Signature manquante', 400));
  }

  try {
    const event = await handleWebhook(req.body, signature);
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
        
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
        
      case 'charge.dispute.created':
        await handleChargeback(event.data.object);
        break;
        
      default:
        console.log(`Événement webhook non géré: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Erreur lors du traitement du webhook:', error);
    return next(new AppError('Erreur lors du traitement du webhook', 400));
  }
}));

// Fonction pour gérer le succès du paiement
async function handlePaymentSuccess(paymentIntent) {
  const order = await Order.findOne({
    where: { payment_intent_id: paymentIntent.id }
  });

  if (order && order.status === 'pending') {
    // Mettre à jour la commande
    order.status = 'confirmed';
    order.payment_status = 'completed';
    order.completed_at = new Date();
    await order.save();

    // Créer ou mettre à jour l'enregistrement de paiement
    const [payment] = await Payment.findOrCreate({
      where: {
        order_id: order.id,
        gateway_transaction_id: paymentIntent.id
      },
      defaults: {
        user_id: order.user_id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        payment_method: order.payment_method,
        payment_provider: 'stripe',
        status: 'completed',
        gateway_response: paymentIntent,
        processed_at: new Date(),
        completed_at: new Date()
      }
    });

    if (!payment.isNewRecord) {
      payment.status = 'completed';
      payment.completed_at = new Date();
      await payment.save();
    }
  }
}

// Fonction pour gérer l'échec du paiement
async function handlePaymentFailure(paymentIntent) {
  const order = await Order.findOne({
    where: { payment_intent_id: paymentIntent.id }
  });

  if (order) {
    // Mettre à jour la commande
    order.payment_status = 'failed';
    await order.save();

    // Créer ou mettre à jour l'enregistrement de paiement
    const [payment] = await Payment.findOrCreate({
      where: {
        order_id: order.id,
        gateway_transaction_id: paymentIntent.id
      },
      defaults: {
        user_id: order.user_id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        payment_method: order.payment_method,
        payment_provider: 'stripe',
        status: 'failed',
        failure_reason: paymentIntent.last_payment_error?.message || 'Payment failed',
        gateway_response: paymentIntent,
        processed_at: new Date(),
        failed_at: new Date()
      }
    });

    if (!payment.isNewRecord) {
      payment.status = 'failed';
      payment.failure_reason = paymentIntent.last_payment_error?.message || 'Payment failed';
      payment.failed_at = new Date();
      await payment.save();
    }
  }
}

// Fonction pour gérer les chargebacks
async function handleChargeback(charge) {
  const payment = await Payment.findOne({
    where: { gateway_transaction_id: charge.payment_intent }
  });

  if (payment) {
    payment.status = 'disputed';
    payment.notes = `Chargeback créé: ${charge.id}`;
    await payment.save();

    // Mettre à jour la commande
    const order = await Order.findByPk(payment.order_id);
    if (order) {
      order.status = 'disputed';
      await order.save();
    }
  }
}

// @desc    Obtenir les statistiques des paiements (Admin)
// @route   GET /api/payments/stats
// @access  Private (Admin)
router.get('/stats', authenticate, authorize(['admin']), catchAsync(async (req, res) => {
  const { date_from, date_to, payment_method } = req.query;

  const whereClause = {};
  if (payment_method) {
    whereClause.payment_method = payment_method;
  }

  if (date_from || date_to) {
    whereClause.created_at = {};
    if (date_from) {
      whereClause.created_at[Op.gte] = new Date(date_from);
    }
    if (date_to) {
      whereClause.created_at[Op.lte] = new Date(date_to);
    }
  }

  const [totalPayments, paymentsByStatus, totalRevenue, paymentsByMethod, averageAmount] = await Promise.all([
    Payment.count({ where: whereClause }),
    Payment.findAll({
      where: whereClause,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount']
      ],
      group: ['status'],
      raw: true
    }),
    Payment.sum('amount', {
      where: {
        ...whereClause,
        status: 'completed'
      }
    }),
    Payment.findAll({
      where: whereClause,
      attributes: [
        'payment_method',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount']
      ],
      group: ['payment_method'],
      raw: true
    }),
    Payment.findOne({
      where: {
        ...whereClause,
        status: 'completed'
      },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('amount')), 'average']
      ],
      raw: true
    })
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        total_payments: totalPayments,
        by_status: paymentsByStatus,
        by_method: paymentsByMethod,
        total_revenue: totalRevenue || 0,
        average_amount: averageAmount?.average || 0
      }
    }
  });
}));

// @desc    Exporter les paiements (Admin)
// @route   GET /api/payments/export
// @access  Private (Admin)
router.get('/export', authenticate, authorize(['admin']), catchAsync(async (req, res) => {
  const { format = 'csv', date_from, date_to, status } = req.query;

  const whereClause = {};
  if (status) {
    whereClause.status = status;
  }

  if (date_from || date_to) {
    whereClause.created_at = {};
    if (date_from) {
      whereClause.created_at[Op.gte] = new Date(date_from);
    }
    if (date_to) {
      whereClause.created_at[Op.lte] = new Date(date_to);
    }
  }

  const payments = await Payment.findAll({
    where: whereClause,
    include: [
      {
        model: Order,
        as: 'order',
        attributes: ['order_number'],
        include: [
          {
            model: Event,
            as: 'event',
            attributes: ['title']
          },
          {
            model: User,
            as: 'user',
            attributes: ['first_name', 'last_name', 'email']
          }
        ]
      }
    ],
    order: [['created_at', 'DESC']]
  });

  if (format === 'csv') {
    // Générer CSV
    const csvHeader = 'Transaction ID,Order Number,Customer Name,Customer Email,Event,Amount,Currency,Payment Method,Status,Date\n';
    const csvData = payments.map(payment => 
      `${payment.transaction_id},${payment.order.order_number},"${payment.order.user.first_name} ${payment.order.user.last_name}",${payment.order.user.email},"${payment.order.event.title}",${payment.amount},${payment.currency},${payment.payment_method},${payment.status},${payment.created_at}`
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=payments.csv');
    res.send(csvHeader + csvData);
  } else {
    res.json({
      success: true,
      data: {
        payments
      }
    });
  }
}));

// @desc    Retry un paiement échoué
// @route   POST /api/payments/:id/retry
// @access  Private (Owner)
router.post('/:id/retry', authenticate, catchAsync(async (req, res, next) => {
  const { payment_method_id } = req.body;
  
  const payment = await Payment.findOne({
    where: {
      id: req.params.id,
      user_id: req.user.id,
      status: 'failed'
    },
    include: [
      {
        model: Order,
        as: 'order'
      }
    ]
  });

  if (!payment) {
    return next(new AppError('Paiement non trouvé ou non éligible pour une nouvelle tentative', 404));
  }

  if (payment.retry_count >= 3) {
    return next(new AppError('Nombre maximum de tentatives atteint', 400));
  }

  try {
    // Créer une nouvelle intention de paiement
    const paymentIntent = await createPaymentIntent({
      amount: Math.round(payment.amount * 100),
      currency: payment.currency.toLowerCase(),
      order_id: payment.order_id,
      customer_email: payment.order.customer_info.email,
      payment_method_id
    });

    // Mettre à jour le paiement
    payment.retry_count = (payment.retry_count || 0) + 1;
    payment.status = 'pending';
    payment.gateway_transaction_id = paymentIntent.id;
    await payment.save();

    res.json({
      success: true,
      message: 'Nouvelle tentative de paiement initiée',
      data: {
        payment_intent: {
          id: paymentIntent.id,
          client_secret: paymentIntent.client_secret
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la nouvelle tentative de paiement:', error);
    return next(new AppError('Erreur lors de la nouvelle tentative de paiement', 500));
  }
}));

module.exports = router;