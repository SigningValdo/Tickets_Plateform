const express = require('express');
const { User, Order, Ticket, Event } = require('../models');
const { authenticate, authorize, checkResourceOwnership } = require('../middleware/auth');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { uploadAvatar, processAvatar } = require('../utils/upload');
const { Op } = require('sequelize');

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// @desc    Obtenir le profil de l'utilisateur connecté
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', catchAsync(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    include: [
      {
        model: Order,
        as: 'orders',
        limit: 5,
        order: [['created_at', 'DESC']],
        include: [
          {
            model: Event,
            as: 'event',
            attributes: ['id', 'title', 'start_date', 'venue_name']
          }
        ]
      },
      {
        model: Ticket,
        as: 'tickets',
        limit: 5,
        order: [['created_at', 'DESC']],
        include: [
          {
            model: Event,
            as: 'event',
            attributes: ['id', 'title', 'start_date', 'venue_name']
          }
        ]
      }
    ]
  });

  if (!user) {
    return next(new AppError('Utilisateur non trouvé', 404));
  }

  res.json({
    success: true,
    data: {
      user
    }
  });
}));

// @desc    Mettre à jour le profil de l'utilisateur
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', catchAsync(async (req, res, next) => {
  const {
    first_name,
    last_name,
    phone,
    date_of_birth,
    gender,
    address,
    city,
    country,
    preferences
  } = req.body;

  const user = await User.findByPk(req.user.id);

  if (!user) {
    return next(new AppError('Utilisateur non trouvé', 404));
  }

  // Mettre à jour les champs autorisés
  const allowedFields = {
    first_name,
    last_name,
    phone,
    date_of_birth,
    gender,
    address,
    city,
    country,
    preferences
  };

  // Filtrer les valeurs undefined
  Object.keys(allowedFields).forEach(key => {
    if (allowedFields[key] !== undefined) {
      user[key] = allowedFields[key];
    }
  });

  await user.save();

  res.json({
    success: true,
    message: 'Profil mis à jour avec succès',
    data: {
      user
    }
  });
}));

// @desc    Télécharger un avatar
// @route   POST /api/users/avatar
// @access  Private
router.post('/avatar', uploadAvatar.single('avatar'), processAvatar, catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Aucun fichier téléchargé', 400));
  }

  const user = await User.findByPk(req.user.id);
  
  if (!user) {
    return next(new AppError('Utilisateur non trouvé', 404));
  }

  // Mettre à jour l'avatar
  user.avatar = req.file.location || req.file.path;
  await user.save();

  res.json({
    success: true,
    message: 'Avatar mis à jour avec succès',
    data: {
      avatar: user.avatar
    }
  });
}));

// @desc    Supprimer l'avatar
// @route   DELETE /api/users/avatar
// @access  Private
router.delete('/avatar', catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);
  
  if (!user) {
    return next(new AppError('Utilisateur non trouvé', 404));
  }

  user.avatar = null;
  await user.save();

  res.json({
    success: true,
    message: 'Avatar supprimé avec succès'
  });
}));

// @desc    Obtenir les commandes de l'utilisateur
// @route   GET /api/users/orders
// @access  Private
router.get('/orders', catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const offset = (page - 1) * limit;

  const whereClause = { user_id: req.user.id };
  if (status) {
    whereClause.status = status;
  }

  const { count, rows: orders } = await Order.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: Event,
        as: 'event',
        attributes: ['id', 'title', 'start_date', 'end_date', 'venue_name', 'venue_address', 'images']
      },
      {
        model: Ticket,
        as: 'tickets',
        attributes: ['id', 'ticket_number', 'status', 'seat_number', 'qr_code']
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

// @desc    Obtenir une commande spécifique
// @route   GET /api/users/orders/:orderId
// @access  Private
router.get('/orders/:orderId', checkResourceOwnership(Order, 'user_id'), catchAsync(async (req, res, next) => {
  const order = await Order.findByPk(req.params.orderId, {
    include: [
      {
        model: Event,
        as: 'event',
        attributes: ['id', 'title', 'description', 'start_date', 'end_date', 'venue_name', 'venue_address', 'images', 'contact_email', 'contact_phone']
      },
      {
        model: Ticket,
        as: 'tickets',
        attributes: ['id', 'ticket_number', 'status', 'seat_number', 'qr_code', 'validation_code', 'attendee_name', 'attendee_email']
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

// @desc    Obtenir les billets de l'utilisateur
// @route   GET /api/users/tickets
// @access  Private
router.get('/tickets', catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status, upcoming } = req.query;
  const offset = (page - 1) * limit;

  const whereClause = { user_id: req.user.id };
  if (status) {
    whereClause.status = status;
  }

  const includeClause = [
    {
      model: Event,
      as: 'event',
      attributes: ['id', 'title', 'start_date', 'end_date', 'venue_name', 'venue_address', 'images'],
      where: upcoming === 'true' ? {
        start_date: {
          [Op.gte]: new Date()
        }
      } : undefined
    },
    {
      model: Order,
      as: 'order',
      attributes: ['id', 'order_number', 'status']
    }
  ];

  const { count, rows: tickets } = await Ticket.findAndCountAll({
    where: whereClause,
    include: includeClause,
    order: [['created_at', 'DESC']],
    limit: parseInt(limit),
    offset: parseInt(offset)
  });

  res.json({
    success: true,
    data: {
      tickets,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        total_items: count,
        items_per_page: parseInt(limit)
      }
    }
  });
}));

// @desc    Obtenir un billet spécifique
// @route   GET /api/users/tickets/:ticketId
// @access  Private
router.get('/tickets/:ticketId', checkResourceOwnership(Ticket, 'user_id'), catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findByPk(req.params.ticketId, {
    include: [
      {
        model: Event,
        as: 'event',
        attributes: ['id', 'title', 'description', 'start_date', 'end_date', 'venue_name', 'venue_address', 'images', 'contact_email', 'contact_phone']
      },
      {
        model: Order,
        as: 'order',
        attributes: ['id', 'order_number', 'status', 'total_amount', 'currency']
      }
    ]
  });

  if (!ticket) {
    return next(new AppError('Billet non trouvé', 404));
  }

  res.json({
    success: true,
    data: {
      ticket
    }
  });
}));

// @desc    Transférer un billet
// @route   POST /api/users/tickets/:ticketId/transfer
// @access  Private
router.post('/tickets/:ticketId/transfer', checkResourceOwnership(Ticket, 'user_id'), catchAsync(async (req, res, next) => {
  const { recipient_email, recipient_name } = req.body;

  if (!recipient_email || !recipient_name) {
    return next(new AppError('Email et nom du destinataire requis', 400));
  }

  const ticket = await Ticket.findByPk(req.params.ticketId, {
    include: [
      {
        model: Event,
        as: 'event',
        attributes: ['id', 'title', 'start_date', 'is_transferable']
      }
    ]
  });

  if (!ticket) {
    return next(new AppError('Billet non trouvé', 404));
  }

  // Vérifier si le billet est transférable
  if (!ticket.is_transferable || !ticket.event.is_transferable) {
    return next(new AppError('Ce billet n\'est pas transférable', 400));
  }

  // Vérifier si l'événement n'a pas encore commencé
  if (new Date() >= new Date(ticket.event.start_date)) {
    return next(new AppError('Impossible de transférer un billet pour un événement déjà commencé', 400));
  }

  // Vérifier si le billet n'est pas déjà utilisé
  if (ticket.status === 'used') {
    return next(new AppError('Impossible de transférer un billet déjà utilisé', 400));
  }

  // Trouver ou créer l'utilisateur destinataire
  let recipient = await User.findOne({ where: { email: recipient_email.toLowerCase() } });
  
  if (!recipient) {
    // Créer un utilisateur temporaire
    recipient = await User.create({
      first_name: recipient_name.split(' ')[0] || recipient_name,
      last_name: recipient_name.split(' ').slice(1).join(' ') || '',
      email: recipient_email.toLowerCase(),
      password: Math.random().toString(36).slice(-8), // Mot de passe temporaire
      is_active: false // Compte inactif jusqu'à activation
    });
  }

  // Effectuer le transfert
  const transferResult = await ticket.transferTo(recipient.id, {
    transferred_by: req.user.id,
    transfer_reason: 'User transfer',
    transfer_date: new Date()
  });

  if (!transferResult.success) {
    return next(new AppError(transferResult.message, 400));
  }

  res.json({
    success: true,
    message: 'Billet transféré avec succès',
    data: {
      ticket: transferResult.ticket,
      recipient: {
        id: recipient.id,
        name: `${recipient.first_name} ${recipient.last_name}`,
        email: recipient.email
      }
    }
  });
}));

// @desc    Annuler une commande (si possible)
// @route   POST /api/users/orders/:orderId/cancel
// @access  Private
router.post('/orders/:orderId/cancel', checkResourceOwnership(Order, 'user_id'), catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  const order = await Order.findByPk(req.params.orderId, {
    include: [
      {
        model: Event,
        as: 'event',
        attributes: ['id', 'title', 'start_date', 'cancellation_policy']
      }
    ]
  });

  if (!order) {
    return next(new AppError('Commande non trouvée', 404));
  }

  // Vérifier si l'annulation est possible
  if (!order.canCancel()) {
    return next(new AppError('Cette commande ne peut plus être annulée', 400));
  }

  // Effectuer l'annulation
  order.status = 'cancelled';
  order.cancelled_at = new Date();
  order.cancellation_reason = reason || 'Cancelled by user';
  await order.save();

  // Mettre à jour le statut des billets
  await Ticket.update(
    { status: 'cancelled' },
    { where: { order_id: order.id } }
  );

  res.json({
    success: true,
    message: 'Commande annulée avec succès',
    data: {
      order
    }
  });
}));

// @desc    Obtenir les statistiques de l'utilisateur
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', catchAsync(async (req, res) => {
  const userId = req.user.id;

  const [totalOrders, totalTickets, upcomingEvents, totalSpent] = await Promise.all([
    Order.count({ where: { user_id: userId } }),
    Ticket.count({ where: { user_id: userId } }),
    Ticket.count({
      where: { user_id: userId },
      include: [
        {
          model: Event,
          as: 'event',
          where: {
            start_date: {
              [Op.gte]: new Date()
            }
          }
        }
      ]
    }),
    Order.sum('total_amount', {
      where: {
        user_id: userId,
        status: { [Op.in]: ['completed', 'confirmed'] }
      }
    })
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        total_orders: totalOrders || 0,
        total_tickets: totalTickets || 0,
        upcoming_events: upcomingEvents || 0,
        total_spent: totalSpent || 0
      }
    }
  });
}));

// @desc    Désactiver le compte utilisateur
// @route   DELETE /api/users/account
// @access  Private
router.delete('/account', catchAsync(async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return next(new AppError('Mot de passe requis pour supprimer le compte', 400));
  }

  const user = await User.findByPk(req.user.id, {
    attributes: { include: ['password'] }
  });

  // Vérifier le mot de passe
  if (!(await user.validatePassword(password))) {
    return next(new AppError('Mot de passe incorrect', 400));
  }

  // Vérifier s'il y a des commandes actives
  const activeOrders = await Order.count({
    where: {
      user_id: user.id,
      status: { [Op.in]: ['pending', 'confirmed'] }
    }
  });

  if (activeOrders > 0) {
    return next(new AppError('Impossible de supprimer le compte avec des commandes actives', 400));
  }

  // Désactiver le compte au lieu de le supprimer
  user.is_active = false;
  user.email = `deleted_${Date.now()}_${user.email}`;
  await user.save();

  res.json({
    success: true,
    message: 'Compte désactivé avec succès'
  });
}));

module.exports = router;