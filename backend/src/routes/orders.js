const express = require('express');
const { Order, Event, User, Ticket, TicketType, Payment } = require('../models');
const { authenticate, authorize, checkResourceOwnership } = require('../middleware/auth');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { processPayment, createPaymentIntent } = require('../utils/payment');
const { sendEmail } = require('../utils/email');
const { Op } = require('sequelize');
const { sequelize } = require('../models');

const router = express.Router();

// @desc    Obtenir toutes les commandes (Admin) ou les commandes de l'utilisateur
// @route   GET /api/orders
// @access  Private
router.get('/', authenticate, catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    event_id,
    user_id,
    date_from,
    date_to
  } = req.query;

  const offset = (page - 1) * limit;
  const whereClause = {};

  // Si l'utilisateur n'est pas admin, limiter aux ses propres commandes
  if (req.user.role !== 'admin') {
    whereClause.user_id = req.user.id;
  } else if (user_id) {
    whereClause.user_id = user_id;
  }

  if (status) {
    whereClause.status = status;
  }

  if (event_id) {
    whereClause.event_id = event_id;
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

  const { count, rows: orders } = await Order.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: Event,
        as: 'event',
        attributes: ['id', 'title', 'start_date', 'venue_name', 'images']
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name', 'email']
      },
      {
        model: Ticket,
        as: 'tickets',
        attributes: ['id', 'ticket_number', 'status']
      }
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(limit),
    offset: parseInt(offset)
  });

  res.json({
    success: true,
    data: {
      orders,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        total_items: count,
        items_per_page: parseInt(limit)
      }
    }
  });
}));

// @desc    Créer une nouvelle commande
// @route   POST /api/orders
// @access  Private
router.post('/', authenticate, catchAsync(async (req, res, next) => {
  const {
    event_id,
    items, // [{ ticket_type_id, quantity, attendee_info }]
    customer_info,
    billing_info,
    discount_code,
    payment_method = 'stripe'
  } = req.body;

  if (!event_id || !items || !Array.isArray(items) || items.length === 0) {
    return next(new AppError('Événement et articles requis', 400));
  }

  // Vérifier que l'événement existe et est disponible
  const event = await Event.findByPk(event_id, {
    include: [
      {
        model: TicketType,
        as: 'ticketTypes',
        where: { is_active: true },
        required: false
      }
    ]
  });

  if (!event) {
    return next(new AppError('Événement non trouvé', 404));
  }

  if (!event.isActive()) {
    return next(new AppError('Cet événement n\'est pas disponible', 400));
  }

  if (!event.isSaleActive()) {
    return next(new AppError('La vente de billets n\'est pas ouverte', 400));
  }

  // Vérifier la disponibilité des billets
  const ticketTypeIds = items.map(item => item.ticket_type_id);
  const ticketTypes = await TicketType.findAll({
    where: {
      id: { [Op.in]: ticketTypeIds },
      event_id: event_id,
      is_active: true
    }
  });

  if (ticketTypes.length !== ticketTypeIds.length) {
    return next(new AppError('Un ou plusieurs types de billets sont invalides', 400));
  }

  // Vérifier la disponibilité et les limites
  let totalAmount = 0;
  let totalTax = 0;
  let totalServiceFee = 0;
  const orderItems = [];

  for (const item of items) {
    const ticketType = ticketTypes.find(tt => tt.id === item.ticket_type_id);
    
    if (!ticketType) {
      return next(new AppError(`Type de billet ${item.ticket_type_id} non trouvé`, 400));
    }

    // Vérifier la disponibilité
    const available = await ticketType.getAvailableCount();
    if (available < item.quantity) {
      return next(new AppError(`Seulement ${available} billets disponibles pour ${ticketType.name}`, 400));
    }

    // Vérifier les limites par commande
    if (item.quantity > ticketType.max_per_order) {
      return next(new AppError(`Maximum ${ticketType.max_per_order} billets par commande pour ${ticketType.name}`, 400));
    }

    const itemTotal = ticketType.price * item.quantity;
    const itemTax = itemTotal * 0.20; // 20% TVA
    const itemServiceFee = itemTotal * 0.05; // 5% frais de service

    totalAmount += itemTotal;
    totalTax += itemTax;
    totalServiceFee += itemServiceFee;

    orderItems.push({
      ticket_type_id: ticketType.id,
      ticket_type_name: ticketType.name,
      price: ticketType.price,
      quantity: item.quantity,
      subtotal: itemTotal,
      attendee_info: item.attendee_info || []
    });
  }

  // Appliquer le code de réduction si fourni
  let discountAmount = 0;
  if (discount_code) {
    // Logique de validation du code de réduction
    // Pour l'instant, on simule une réduction de 10%
    if (discount_code === 'WELCOME10') {
      discountAmount = totalAmount * 0.10;
    }
  }

  const finalAmount = totalAmount + totalTax + totalServiceFee - discountAmount;

  // Créer la commande
  const order = await Order.create({
    user_id: req.user.id,
    event_id: event_id,
    status: 'pending',
    items: orderItems,
    subtotal: totalAmount,
    tax_amount: totalTax,
    service_fee: totalServiceFee,
    discount_amount: discountAmount,
    total_amount: finalAmount,
    currency: event.currency || 'EUR',
    payment_method: payment_method,
    customer_info: customer_info || {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      phone: req.user.phone
    },
    billing_info: billing_info,
    discount_code: discount_code,
    expires_at: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
  });

  // Créer l'intention de paiement
  try {
    const paymentIntent = await createPaymentIntent({
      amount: Math.round(finalAmount * 100), // en centimes
      currency: order.currency.toLowerCase(),
      order_id: order.id,
      customer_email: order.customer_info.email
    });

    order.payment_intent_id = paymentIntent.id;
    await order.save();

    res.status(201).json({
      success: true,
      message: 'Commande créée avec succès',
      data: {
        order: {
          id: order.id,
          order_number: order.order_number,
          status: order.status,
          total_amount: order.total_amount,
          currency: order.currency,
          expires_at: order.expires_at
        },
        payment: {
          client_secret: paymentIntent.client_secret,
          payment_intent_id: paymentIntent.id
        }
      }
    });
  } catch (error) {
    // Supprimer la commande si la création du paiement échoue
    await order.destroy();
    console.error('Erreur lors de la création de l\'intention de paiement:', error);
    return next(new AppError('Erreur lors de l\'initialisation du paiement', 500));
  }
}));

// @desc    Obtenir une commande par ID
// @route   GET /api/orders/:id
// @access  Private (Owner/Admin)
router.get('/:id', authenticate, checkResourceOwnership(Order, 'user_id'), catchAsync(async (req, res, next) => {
  const order = await Order.findByPk(req.params.id, {
    include: [
      {
        model: Event,
        as: 'event',
        attributes: ['id', 'title', 'description', 'start_date', 'end_date', 'venue_name', 'venue_address', 'images']
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
      },
      {
        model: Ticket,
        as: 'tickets',
        include: [
          {
            model: TicketType,
            as: 'ticketType',
            attributes: ['id', 'name', 'description']
          }
        ]
      },
      {
        model: Payment,
        as: 'payments',
        order: [['created_at', 'DESC']]
      }
    ]
  });

  if (!order) {
    return next(new AppError('Commande non trouvée', 404));
  }

  res.json({
    success: true,
    data: {
      order
    }
  });
}));

// @desc    Confirmer le paiement d'une commande
// @route   POST /api/orders/:id/confirm-payment
// @access  Private (Owner)
router.post('/:id/confirm-payment', authenticate, checkResourceOwnership(Order, 'user_id'), catchAsync(async (req, res, next) => {
  const { payment_intent_id, payment_method_id } = req.body;
  
  const order = await Order.findByPk(req.params.id, {
    include: [
      {
        model: Event,
        as: 'event',
        include: [
          {
            model: TicketType,
            as: 'ticketTypes'
          }
        ]
      }
    ]
  });

  if (!order) {
    return next(new AppError('Commande non trouvée', 404));
  }

  if (order.status !== 'pending') {
    return next(new AppError('Cette commande ne peut plus être payée', 400));
  }

  if (order.isExpired()) {
    return next(new AppError('Cette commande a expiré', 400));
  }

  try {
    // Traiter le paiement
    const paymentResult = await processPayment({
      payment_intent_id: payment_intent_id || order.payment_intent_id,
      payment_method_id,
      amount: Math.round(order.total_amount * 100),
      currency: order.currency
    });

    if (!paymentResult.success) {
      return next(new AppError(paymentResult.error || 'Échec du paiement', 400));
    }

    // Mettre à jour la commande
    order.status = 'confirmed';
    order.payment_status = 'completed';
    order.completed_at = new Date();
    await order.save();

    // Créer l'enregistrement de paiement
    await Payment.create({
      order_id: order.id,
      user_id: order.user_id,
      amount: order.total_amount,
      currency: order.currency,
      payment_method: order.payment_method,
      payment_provider: 'stripe',
      status: 'completed',
      gateway_transaction_id: paymentResult.transaction_id,
      gateway_response: paymentResult.response,
      processed_at: new Date(),
      completed_at: new Date()
    });

    // Créer les billets
    const tickets = [];
    for (const item of order.items) {
      const ticketType = order.event.ticketTypes.find(tt => tt.id === item.ticket_type_id);
      
      for (let i = 0; i < item.quantity; i++) {
        const attendeeInfo = item.attendee_info && item.attendee_info[i] ? item.attendee_info[i] : {};
        
        const ticket = await Ticket.create({
          user_id: order.user_id,
          event_id: order.event_id,
          ticket_type_id: item.ticket_type_id,
          order_id: order.id,
          status: 'active',
          price_paid: item.price,
          currency: order.currency,
          attendee_name: attendeeInfo.name || `${order.customer_info.first_name} ${order.customer_info.last_name}`,
          attendee_email: attendeeInfo.email || order.customer_info.email,
          attendee_phone: attendeeInfo.phone || order.customer_info.phone,
          special_requirements: attendeeInfo.special_requirements
        });
        
        tickets.push(ticket);
      }
    }

    // Envoyer l'email de confirmation
    try {
      await sendEmail({
        to: order.customer_info.email,
        subject: `Confirmation de commande - ${order.event.title}`,
        template: 'order-confirmation',
        data: {
          order_number: order.order_number,
          customer_name: `${order.customer_info.first_name} ${order.customer_info.last_name}`,
          event_title: order.event.title,
          event_date: order.event.start_date,
          total_amount: order.total_amount,
          currency: order.currency,
          tickets_count: tickets.length,
          order_url: `${process.env.FRONTEND_URL}/orders/${order.id}`
        }
      });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
    }

    res.json({
      success: true,
      message: 'Paiement confirmé avec succès',
      data: {
        order: {
          id: order.id,
          order_number: order.order_number,
          status: order.status,
          payment_status: order.payment_status
        },
        tickets: tickets.map(ticket => ({
          id: ticket.id,
          ticket_number: ticket.ticket_number,
          qr_code: ticket.qr_code
        }))
      }
    });
  } catch (error) {
    console.error('Erreur lors du traitement du paiement:', error);
    return next(new AppError('Erreur lors du traitement du paiement', 500));
  }
}));

// @desc    Annuler une commande
// @route   POST /api/orders/:id/cancel
// @access  Private (Owner/Admin)
router.post('/:id/cancel', authenticate, checkResourceOwnership(Order, 'user_id'), catchAsync(async (req, res, next) => {
  const { reason } = req.body;
  
  const order = await Order.findByPk(req.params.id);

  if (!order) {
    return next(new AppError('Commande non trouvée', 404));
  }

  if (!order.canCancel()) {
    return next(new AppError('Cette commande ne peut plus être annulée', 400));
  }

  // Annuler la commande
  order.status = 'cancelled';
  order.cancelled_at = new Date();
  order.cancellation_reason = reason || 'Cancelled by user';
  await order.save();

  // Annuler les billets associés
  await Ticket.update(
    { status: 'cancelled' },
    { where: { order_id: order.id } }
  );

  // Si la commande était payée, initier un remboursement
  if (order.payment_status === 'completed') {
    // Logique de remboursement à implémenter
    // Pour l'instant, on marque juste comme en attente de remboursement
    order.refund_status = 'pending';
    order.refund_requested_at = new Date();
    await order.save();
  }

  res.json({
    success: true,
    message: 'Commande annulée avec succès',
    data: {
      order
    }
  });
}));

// @desc    Demander un remboursement
// @route   POST /api/orders/:id/refund
// @access  Private (Owner)
router.post('/:id/refund', authenticate, checkResourceOwnership(Order, 'user_id'), catchAsync(async (req, res, next) => {
  const { reason } = req.body;
  
  const order = await Order.findByPk(req.params.id, {
    include: [
      {
        model: Event,
        as: 'event',
        attributes: ['id', 'title', 'start_date', 'refund_policy']
      }
    ]
  });

  if (!order) {
    return next(new AppError('Commande non trouvée', 404));
  }

  if (!order.canRefund()) {
    return next(new AppError('Cette commande ne peut pas être remboursée', 400));
  }

  if (order.refund_status === 'pending' || order.refund_status === 'completed') {
    return next(new AppError('Une demande de remboursement est déjà en cours', 400));
  }

  // Marquer comme demande de remboursement
  order.refund_status = 'pending';
  order.refund_requested_at = new Date();
  order.refund_reason = reason;
  await order.save();

  res.json({
    success: true,
    message: 'Demande de remboursement soumise avec succès',
    data: {
      order
    }
  });
}));

// @desc    Obtenir les statistiques des commandes (Admin)
// @route   GET /api/orders/stats
// @access  Private (Admin)
router.get('/stats', authenticate, authorize(['admin']), catchAsync(async (req, res) => {
  const { event_id, date_from, date_to } = req.query;

  const whereClause = {};
  if (event_id) {
    whereClause.event_id = event_id;
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

  const [totalOrders, ordersByStatus, revenue, averageOrderValue] = await Promise.all([
    Order.count({ where: whereClause }),
    Order.findAll({
      where: whereClause,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    }),
    Order.sum('total_amount', {
      where: {
        ...whereClause,
        status: { [Op.in]: ['completed', 'confirmed'] }
      }
    }),
    Order.findOne({
      where: {
        ...whereClause,
        status: { [Op.in]: ['completed', 'confirmed'] }
      },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('total_amount')), 'average']
      ],
      raw: true
    })
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        total_orders: totalOrders,
        by_status: ordersByStatus,
        total_revenue: revenue || 0,
        average_order_value: averageOrderValue?.average || 0
      }
    }
  });
}));

// @desc    Exporter les commandes (Admin)
// @route   GET /api/orders/export
// @access  Private (Admin)
router.get('/export', authenticate, authorize(['admin']), catchAsync(async (req, res) => {
  const { format = 'csv', event_id, date_from, date_to } = req.query;

  const whereClause = {};
  if (event_id) {
    whereClause.event_id = event_id;
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

  const orders = await Order.findAll({
    where: whereClause,
    include: [
      {
        model: Event,
        as: 'event',
        attributes: ['title', 'start_date']
      },
      {
        model: User,
        as: 'user',
        attributes: ['first_name', 'last_name', 'email']
      }
    ],
    order: [['created_at', 'DESC']]
  });

  if (format === 'csv') {
    // Générer CSV
    const csvHeader = 'Order Number,Customer Name,Customer Email,Event,Total Amount,Currency,Status,Created At\n';
    const csvData = orders.map(order => 
      `${order.order_number},"${order.user.first_name} ${order.user.last_name}",${order.user.email},"${order.event.title}",${order.total_amount},${order.currency},${order.status},${order.created_at}`
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
    res.send(csvHeader + csvData);
  } else {
    res.json({
      success: true,
      data: {
        orders
      }
    });
  }
}));

module.exports = router;