const express = require('express');
const { Ticket, Event, User, Order, TicketType } = require('../models');
const { authenticate, authorize, checkResourceOwnership } = require('../middleware/auth');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { generateQRCode } = require('../utils/qrcode');
const { sendEmail } = require('../utils/email');
const { Op } = require('sequelize');

const router = express.Router();

// @desc    Obtenir tous les billets (Admin seulement)
// @route   GET /api/tickets
// @access  Private (Admin)
router.get('/', authenticate, authorize(['admin']), catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    event_id,
    user_id,
    search
  } = req.query;

  const offset = (page - 1) * limit;
  const whereClause = {};

  if (status) {
    whereClause.status = status;
  }

  if (event_id) {
    whereClause.event_id = event_id;
  }

  if (user_id) {
    whereClause.user_id = user_id;
  }

  if (search) {
    whereClause[Op.or] = [
      { ticket_number: { [Op.iLike]: `%${search}%` } },
      { attendee_name: { [Op.iLike]: `%${search}%` } },
      { attendee_email: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const { count, rows: tickets } = await Ticket.findAndCountAll({
    where: whereClause,
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
      },
      {
        model: Order,
        as: 'order',
        attributes: ['id', 'order_number', 'status']
      },
      {
        model: TicketType,
        as: 'ticketType',
        attributes: ['id', 'name', 'price', 'currency']
      }
    ],
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

// @desc    Obtenir un billet par ID
// @route   GET /api/tickets/:id
// @access  Private (Owner/Admin)
router.get('/:id', authenticate, checkResourceOwnership(Ticket, 'user_id'), catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findByPk(req.params.id, {
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
        model: Order,
        as: 'order',
        attributes: ['id', 'order_number', 'status', 'total_amount', 'currency']
      },
      {
        model: TicketType,
        as: 'ticketType',
        attributes: ['id', 'name', 'description', 'price', 'currency', 'benefits']
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

// @desc    Valider un billet (scan QR code)
// @route   POST /api/tickets/:id/validate
// @access  Private (Admin/Organizer)
router.post('/:id/validate', authenticate, authorize(['admin', 'organizer']), catchAsync(async (req, res, next) => {
  const { validation_code } = req.body;
  
  const ticket = await Ticket.findByPk(req.params.id, {
    include: [
      {
        model: Event,
        as: 'event',
        attributes: ['id', 'title', 'start_date', 'end_date', 'organizer_id']
      }
    ]
  });

  if (!ticket) {
    return next(new AppError('Billet non trouvé', 404));
  }

  // Vérifier si l'utilisateur peut valider ce billet
  if (req.user.role !== 'admin' && ticket.event.organizer_id !== req.user.id) {
    return next(new AppError('Non autorisé à valider ce billet', 403));
  }

  // Vérifier le code de validation si fourni
  if (validation_code && ticket.validation_code !== validation_code) {
    return next(new AppError('Code de validation incorrect', 400));
  }

  // Vérifier si le billet peut être validé
  const validationResult = await ticket.validate({
    validated_by: req.user.id,
    validation_location: req.body.location || 'Entrance',
    validation_notes: req.body.notes
  });

  if (!validationResult.success) {
    return next(new AppError(validationResult.message, 400));
  }

  res.json({
    success: true,
    message: 'Billet validé avec succès',
    data: {
      ticket: validationResult.ticket,
      validation_time: validationResult.validation_time
    }
  });
}));

// @desc    Valider un billet par QR code
// @route   POST /api/tickets/validate-qr
// @access  Private (Admin/Organizer)
router.post('/validate-qr', authenticate, authorize(['admin', 'organizer']), catchAsync(async (req, res, next) => {
  const { qr_code, event_id } = req.body;

  if (!qr_code) {
    return next(new AppError('QR code requis', 400));
  }

  // Décoder le QR code pour obtenir l'ID du billet
  let ticketId;
  try {
    // Le QR code contient généralement l'URL avec l'ID du billet
    const qrData = JSON.parse(Buffer.from(qr_code, 'base64').toString());
    ticketId = qrData.ticket_id;
  } catch (error) {
    // Fallback: essayer d'extraire l'ID directement
    const match = qr_code.match(/ticket[\/_]([a-f0-9\-]+)/i);
    if (match) {
      ticketId = match[1];
    } else {
      return next(new AppError('QR code invalide', 400));
    }
  }

  const ticket = await Ticket.findByPk(ticketId, {
    include: [
      {
        model: Event,
        as: 'event',
        attributes: ['id', 'title', 'start_date', 'end_date', 'organizer_id']
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name']
      }
    ]
  });

  if (!ticket) {
    return next(new AppError('Billet non trouvé', 404));
  }

  // Vérifier l'événement si spécifié
  if (event_id && ticket.event_id !== event_id) {
    return next(new AppError('Ce billet n\'est pas valide pour cet événement', 400));
  }

  // Vérifier les permissions
  if (req.user.role !== 'admin' && ticket.event.organizer_id !== req.user.id) {
    return next(new AppError('Non autorisé à valider ce billet', 403));
  }

  // Valider le billet
  const validationResult = await ticket.validate({
    validated_by: req.user.id,
    validation_location: req.body.location || 'Entrance',
    validation_notes: req.body.notes
  });

  if (!validationResult.success) {
    return next(new AppError(validationResult.message, 400));
  }

  res.json({
    success: true,
    message: 'Billet validé avec succès',
    data: {
      ticket: validationResult.ticket,
      attendee: {
        name: `${ticket.user.first_name} ${ticket.user.last_name}`,
        ticket_type: ticket.ticketType?.name
      },
      validation_time: validationResult.validation_time
    }
  });
}));

// @desc    Transférer un billet
// @route   POST /api/tickets/:id/transfer
// @access  Private (Owner)
router.post('/:id/transfer', authenticate, checkResourceOwnership(Ticket, 'user_id'), catchAsync(async (req, res, next) => {
  const { recipient_email, recipient_name, transfer_message } = req.body;

  if (!recipient_email || !recipient_name) {
    return next(new AppError('Email et nom du destinataire requis', 400));
  }

  const ticket = await Ticket.findByPk(req.params.id, {
    include: [
      {
        model: Event,
        as: 'event',
        attributes: ['id', 'title', 'start_date', 'is_transferable']
      },
      {
        model: TicketType,
        as: 'ticketType',
        attributes: ['is_transferable']
      }
    ]
  });

  if (!ticket) {
    return next(new AppError('Billet non trouvé', 404));
  }

  // Vérifier si le transfert est autorisé
  if (!ticket.is_transferable || !ticket.event.is_transferable || !ticket.ticketType.is_transferable) {
    return next(new AppError('Ce billet n\'est pas transférable', 400));
  }

  // Vérifier si l'événement n'a pas encore commencé
  if (new Date() >= new Date(ticket.event.start_date)) {
    return next(new AppError('Impossible de transférer un billet pour un événement déjà commencé', 400));
  }

  // Vérifier le statut du billet
  if (ticket.status !== 'active') {
    return next(new AppError('Seuls les billets actifs peuvent être transférés', 400));
  }

  // Trouver ou créer l'utilisateur destinataire
  let recipient = await User.findOne({ where: { email: recipient_email.toLowerCase() } });
  
  if (!recipient) {
    // Créer un utilisateur temporaire
    const tempPassword = Math.random().toString(36).slice(-12);
    recipient = await User.create({
      first_name: recipient_name.split(' ')[0] || recipient_name,
      last_name: recipient_name.split(' ').slice(1).join(' ') || '',
      email: recipient_email.toLowerCase(),
      password: tempPassword,
      is_active: true,
      is_email_verified: false
    });
  }

  // Effectuer le transfert
  const transferResult = await ticket.transferTo(recipient.id, {
    transferred_by: req.user.id,
    transfer_reason: 'User transfer',
    transfer_message: transfer_message,
    transfer_date: new Date()
  });

  if (!transferResult.success) {
    return next(new AppError(transferResult.message, 400));
  }

  // Envoyer un email au destinataire
  try {
    await sendEmail({
      to: recipient.email,
      subject: `Billet transféré - ${ticket.event.title}`,
      template: 'ticket-transfer',
      data: {
        recipient_name: recipient_name,
        sender_name: `${req.user.first_name} ${req.user.last_name}`,
        event_title: ticket.event.title,
        ticket_number: ticket.ticket_number,
        transfer_message: transfer_message,
        ticket_url: `${process.env.FRONTEND_URL}/tickets/${ticket.id}`
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de transfert:', error);
  }

  res.json({
    success: true,
    message: 'Billet transféré avec succès',
    data: {
      ticket: transferResult.ticket,
      recipient: {
        id: recipient.id,
        name: recipient_name,
        email: recipient.email
      }
    }
  });
}));

// @desc    Annuler un billet
// @route   POST /api/tickets/:id/cancel
// @access  Private (Owner/Admin)
router.post('/:id/cancel', authenticate, checkResourceOwnership(Ticket, 'user_id'), catchAsync(async (req, res, next) => {
  const { reason } = req.body;
  
  const ticket = await Ticket.findByPk(req.params.id, {
    include: [
      {
        model: Event,
        as: 'event',
        attributes: ['id', 'title', 'start_date', 'refund_policy']
      },
      {
        model: Order,
        as: 'order',
        attributes: ['id', 'status']
      }
    ]
  });

  if (!ticket) {
    return next(new AppError('Billet non trouvé', 404));
  }

  // Vérifier si le billet peut être annulé
  if (ticket.status === 'cancelled') {
    return next(new AppError('Ce billet est déjà annulé', 400));
  }

  if (ticket.status === 'used') {
    return next(new AppError('Impossible d\'annuler un billet déjà utilisé', 400));
  }

  // Vérifier si l'événement n'a pas encore commencé
  if (new Date() >= new Date(ticket.event.start_date)) {
    return next(new AppError('Impossible d\'annuler un billet pour un événement déjà commencé', 400));
  }

  // Annuler le billet
  ticket.status = 'cancelled';
  ticket.cancelled_at = new Date();
  ticket.cancellation_reason = reason || 'Cancelled by user';
  await ticket.save();

  res.json({
    success: true,
    message: 'Billet annulé avec succès',
    data: {
      ticket
    }
  });
}));

// @desc    Régénérer le QR code d'un billet
// @route   POST /api/tickets/:id/regenerate-qr
// @access  Private (Owner/Admin)
router.post('/:id/regenerate-qr', authenticate, checkResourceOwnership(Ticket, 'user_id'), catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findByPk(req.params.id);

  if (!ticket) {
    return next(new AppError('Billet non trouvé', 404));
  }

  if (ticket.status !== 'active') {
    return next(new AppError('Seuls les billets actifs peuvent avoir leur QR code régénéré', 400));
  }

  // Générer un nouveau code de validation et QR code
  const newValidationCode = ticket.generateValidationCode();
  const newQRCode = await ticket.generateQRCode();

  ticket.validation_code = newValidationCode;
  ticket.qr_code = newQRCode;
  await ticket.save();

  res.json({
    success: true,
    message: 'QR code régénéré avec succès',
    data: {
      qr_code: newQRCode,
      validation_code: newValidationCode
    }
  });
}));

// @desc    Obtenir l'historique d'un billet
// @route   GET /api/tickets/:id/history
// @access  Private (Owner/Admin)
router.get('/:id/history', authenticate, checkResourceOwnership(Ticket, 'user_id'), catchAsync(async (req, res, next) => {
  const ticket = await Ticket.findByPk(req.params.id);

  if (!ticket) {
    return next(new AppError('Billet non trouvé', 404));
  }

  const history = ticket.transfer_history || [];

  res.json({
    success: true,
    data: {
      history
    }
  });
}));

// @desc    Envoyer le billet par email
// @route   POST /api/tickets/:id/send-email
// @access  Private (Owner)
router.post('/:id/send-email', authenticate, checkResourceOwnership(Ticket, 'user_id'), catchAsync(async (req, res, next) => {
  const { email } = req.body;
  
  const ticket = await Ticket.findByPk(req.params.id, {
    include: [
      {
        model: Event,
        as: 'event',
        attributes: ['id', 'title', 'start_date', 'venue_name', 'venue_address']
      },
      {
        model: TicketType,
        as: 'ticketType',
        attributes: ['name', 'description']
      }
    ]
  });

  if (!ticket) {
    return next(new AppError('Billet non trouvé', 404));
  }

  const recipientEmail = email || req.user.email;

  try {
    await sendEmail({
      to: recipientEmail,
      subject: `Votre billet - ${ticket.event.title}`,
      template: 'ticket-confirmation',
      data: {
        ticket_number: ticket.ticket_number,
        event_title: ticket.event.title,
        event_date: ticket.event.start_date,
        venue_name: ticket.event.venue_name,
        venue_address: ticket.event.venue_address,
        ticket_type: ticket.ticketType.name,
        attendee_name: ticket.attendee_name || `${req.user.first_name} ${req.user.last_name}`,
        qr_code: ticket.qr_code,
        ticket_url: `${process.env.FRONTEND_URL}/tickets/${ticket.id}`
      }
    });

    res.json({
      success: true,
      message: 'Billet envoyé par email avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return next(new AppError('Erreur lors de l\'envoi de l\'email', 500));
  }
}));

// @desc    Obtenir les statistiques des billets (Admin)
// @route   GET /api/tickets/stats
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

  const [totalTickets, ticketsByStatus, ticketsByEvent] = await Promise.all([
    Ticket.count({ where: whereClause }),
    Ticket.findAll({
      where: whereClause,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    }),
    Ticket.findAll({
      where: whereClause,
      attributes: [
        'event_id',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      include: [
        {
          model: Event,
          as: 'event',
          attributes: ['title']
        }
      ],
      group: ['event_id', 'event.id', 'event.title'],
      raw: true
    })
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        total_tickets: totalTickets,
        by_status: ticketsByStatus,
        by_event: ticketsByEvent
      }
    }
  });
}));

module.exports = router;