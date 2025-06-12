const express = require('express');
const { Event, User, TicketType, Order, Ticket } = require('../models');
const { authenticate, authorize, checkEventOwnership } = require('../middleware/auth');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { uploadEventImages, processEventImages } = require('../utils/upload');
const { Op } = require('sequelize');
const { sequelize } = require('../models');

const router = express.Router();

// @desc    Obtenir tous les événements (avec filtres)
// @route   GET /api/events
// @access  Public
router.get('/', catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    category,
    city,
    country,
    date_from,
    date_to,
    price_min,
    price_max,
    search,
    status = 'published',
    sort = 'start_date',
    order = 'ASC'
  } = req.query;

  const offset = (page - 1) * limit;
  const whereClause = { status };

  // Filtres
  if (category) {
    whereClause.category = category;
  }

  if (city) {
    whereClause.venue_city = { [Op.iLike]: `%${city}%` };
  }

  if (country) {
    whereClause.venue_country = { [Op.iLike]: `%${country}%` };
  }

  if (date_from || date_to) {
    whereClause.start_date = {};
    if (date_from) {
      whereClause.start_date[Op.gte] = new Date(date_from);
    }
    if (date_to) {
      whereClause.start_date[Op.lte] = new Date(date_to);
    }
  }

  if (search) {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
      { venue_name: { [Op.iLike]: `%${search}%` } },
      { tags: { [Op.contains]: [search] } }
    ];
  }

  // Filtre par prix (nécessite une jointure avec TicketType)
  const includeClause = [
    {
      model: User,
      as: 'organizer',
      attributes: ['id', 'first_name', 'last_name', 'avatar']
    },
    {
      model: TicketType,
      as: 'ticketTypes',
      attributes: ['id', 'name', 'price', 'currency', 'quantity', 'sold_count'],
      where: price_min || price_max ? {
        ...(price_min && { price: { [Op.gte]: parseFloat(price_min) } }),
        ...(price_max && { price: { [Op.lte]: parseFloat(price_max) } })
      } : undefined,
      required: !!(price_min || price_max)
    }
  ];

  const { count, rows: events } = await Event.findAndCountAll({
    where: whereClause,
    include: includeClause,
    order: [[sort, order.toUpperCase()]],
    limit: parseInt(limit),
    offset: parseInt(offset),
    distinct: true
  });

  res.json({
    success: true,
    data: {
      events,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        total_items: count,
        items_per_page: parseInt(limit)
      }
    }
  });
}));

// @desc    Obtenir un événement par ID
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', catchAsync(async (req, res, next) => {
  const event = await Event.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'organizer',
        attributes: ['id', 'first_name', 'last_name', 'avatar', 'email']
      },
      {
        model: TicketType,
        as: 'ticketTypes',
        where: { is_active: true },
        required: false,
        order: [['sort_order', 'ASC']]
      }
    ]
  });

  if (!event) {
    return next(new AppError('Événement non trouvé', 404));
  }

  // Incrémenter le compteur de vues
  await event.increment('view_count');

  res.json({
    success: true,
    data: {
      event
    }
  });
}));

// @desc    Créer un nouvel événement
// @route   POST /api/events
// @access  Private (Organizer/Admin)
router.post('/', authenticate, authorize(['organizer', 'admin']), catchAsync(async (req, res, next) => {
  const eventData = {
    ...req.body,
    organizer_id: req.user.id,
    status: req.user.role === 'admin' ? 'published' : 'draft'
  };

  // Validation des dates
  if (new Date(eventData.start_date) <= new Date()) {
    return next(new AppError('La date de début doit être dans le futur', 400));
  }

  if (new Date(eventData.end_date) <= new Date(eventData.start_date)) {
    return next(new AppError('La date de fin doit être après la date de début', 400));
  }

  if (eventData.ticket_sale_start && new Date(eventData.ticket_sale_start) >= new Date(eventData.start_date)) {
    return next(new AppError('La vente de billets doit commencer avant l\'événement', 400));
  }

  const event = await Event.create(eventData);

  // Créer les types de billets si fournis
  if (req.body.ticket_types && Array.isArray(req.body.ticket_types)) {
    const ticketTypes = req.body.ticket_types.map(ticketType => ({
      ...ticketType,
      event_id: event.id
    }));
    await TicketType.bulkCreate(ticketTypes);
  }

  // Récupérer l'événement complet
  const completeEvent = await Event.findByPk(event.id, {
    include: [
      {
        model: User,
        as: 'organizer',
        attributes: ['id', 'first_name', 'last_name', 'avatar']
      },
      {
        model: TicketType,
        as: 'ticketTypes'
      }
    ]
  });

  res.status(201).json({
    success: true,
    message: 'Événement créé avec succès',
    data: {
      event: completeEvent
    }
  });
}));

// @desc    Mettre à jour un événement
// @route   PUT /api/events/:id
// @access  Private (Owner/Admin)
router.put('/:id', authenticate, checkEventOwnership, catchAsync(async (req, res, next) => {
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    return next(new AppError('Événement non trouvé', 404));
  }

  // Vérifier si l'événement peut être modifié
  if (event.status === 'cancelled') {
    return next(new AppError('Impossible de modifier un événement annulé', 400));
  }

  // Validation des dates si modifiées
  if (req.body.start_date && new Date(req.body.start_date) <= new Date()) {
    return next(new AppError('La date de début doit être dans le futur', 400));
  }

  if (req.body.end_date && req.body.start_date && new Date(req.body.end_date) <= new Date(req.body.start_date)) {
    return next(new AppError('La date de fin doit être après la date de début', 400));
  }

  // Mettre à jour l'événement
  await event.update(req.body);

  // Récupérer l'événement mis à jour
  const updatedEvent = await Event.findByPk(event.id, {
    include: [
      {
        model: User,
        as: 'organizer',
        attributes: ['id', 'first_name', 'last_name', 'avatar']
      },
      {
        model: TicketType,
        as: 'ticketTypes'
      }
    ]
  });

  res.json({
    success: true,
    message: 'Événement mis à jour avec succès',
    data: {
      event: updatedEvent
    }
  });
}));

// @desc    Supprimer un événement
// @route   DELETE /api/events/:id
// @access  Private (Owner/Admin)
router.delete('/:id', authenticate, checkEventOwnership, catchAsync(async (req, res, next) => {
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    return next(new AppError('Événement non trouvé', 404));
  }

  // Vérifier s'il y a des billets vendus
  const soldTickets = await Ticket.count({
    where: { event_id: event.id }
  });

  if (soldTickets > 0) {
    return next(new AppError('Impossible de supprimer un événement avec des billets vendus', 400));
  }

  await event.destroy();

  res.json({
    success: true,
    message: 'Événement supprimé avec succès'
  });
}));

// @desc    Télécharger des images pour un événement
// @route   POST /api/events/:id/images
// @access  Private (Owner/Admin)
router.post('/:id/images', authenticate, checkEventOwnership, uploadEventImages.array('images', 5), processEventImages, catchAsync(async (req, res, next) => {
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    return next(new AppError('Événement non trouvé', 404));
  }

  if (!req.files || req.files.length === 0) {
    return next(new AppError('Aucune image téléchargée', 400));
  }

  // Ajouter les nouvelles images
  const newImages = req.files.map(file => file.location || file.path);
  const currentImages = event.images || [];
  const updatedImages = [...currentImages, ...newImages];

  await event.update({ images: updatedImages });

  res.json({
    success: true,
    message: 'Images téléchargées avec succès',
    data: {
      images: updatedImages
    }
  });
}));

// @desc    Supprimer une image d'un événement
// @route   DELETE /api/events/:id/images
// @access  Private (Owner/Admin)
router.delete('/:id/images', authenticate, checkEventOwnership, catchAsync(async (req, res, next) => {
  const { image_url } = req.body;
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    return next(new AppError('Événement non trouvé', 404));
  }

  if (!image_url) {
    return next(new AppError('URL de l\'image requise', 400));
  }

  const currentImages = event.images || [];
  const updatedImages = currentImages.filter(img => img !== image_url);

  await event.update({ images: updatedImages });

  res.json({
    success: true,
    message: 'Image supprimée avec succès',
    data: {
      images: updatedImages
    }
  });
}));

// @desc    Obtenir les types de billets d'un événement
// @route   GET /api/events/:id/ticket-types
// @access  Public
router.get('/:id/ticket-types', catchAsync(async (req, res, next) => {
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    return next(new AppError('Événement non trouvé', 404));
  }

  const ticketTypes = await TicketType.findAll({
    where: {
      event_id: req.params.id,
      is_active: true
    },
    order: [['sort_order', 'ASC']]
  });

  res.json({
    success: true,
    data: {
      ticket_types: ticketTypes
    }
  });
}));

// @desc    Créer un type de billet pour un événement
// @route   POST /api/events/:id/ticket-types
// @access  Private (Owner/Admin)
router.post('/:id/ticket-types', authenticate, checkEventOwnership, catchAsync(async (req, res, next) => {
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    return next(new AppError('Événement non trouvé', 404));
  }

  const ticketTypeData = {
    ...req.body,
    event_id: req.params.id
  };

  // Validation des dates
  if (ticketTypeData.sale_start && new Date(ticketTypeData.sale_start) >= new Date(event.start_date)) {
    return next(new AppError('La vente doit commencer avant l\'événement', 400));
  }

  if (ticketTypeData.sale_end && new Date(ticketTypeData.sale_end) >= new Date(event.start_date)) {
    return next(new AppError('La vente doit se terminer avant l\'événement', 400));
  }

  const ticketType = await TicketType.create(ticketTypeData);

  res.status(201).json({
    success: true,
    message: 'Type de billet créé avec succès',
    data: {
      ticket_type: ticketType
    }
  });
}));

// @desc    Mettre à jour un type de billet
// @route   PUT /api/events/:id/ticket-types/:ticketTypeId
// @access  Private (Owner/Admin)
router.put('/:id/ticket-types/:ticketTypeId', authenticate, checkEventOwnership, catchAsync(async (req, res, next) => {
  const ticketType = await TicketType.findOne({
    where: {
      id: req.params.ticketTypeId,
      event_id: req.params.id
    }
  });

  if (!ticketType) {
    return next(new AppError('Type de billet non trouvé', 404));
  }

  // Vérifier s'il y a des billets vendus
  const soldTickets = await Ticket.count({
    where: { ticket_type_id: ticketType.id }
  });

  // Certains champs ne peuvent pas être modifiés s'il y a des billets vendus
  if (soldTickets > 0) {
    const restrictedFields = ['price', 'currency'];
    const hasRestrictedChanges = restrictedFields.some(field => 
      req.body[field] !== undefined && req.body[field] !== ticketType[field]
    );

    if (hasRestrictedChanges) {
      return next(new AppError('Impossible de modifier le prix ou la devise avec des billets vendus', 400));
    }
  }

  await ticketType.update(req.body);

  res.json({
    success: true,
    message: 'Type de billet mis à jour avec succès',
    data: {
      ticket_type: ticketType
    }
  });
}));

// @desc    Supprimer un type de billet
// @route   DELETE /api/events/:id/ticket-types/:ticketTypeId
// @access  Private (Owner/Admin)
router.delete('/:id/ticket-types/:ticketTypeId', authenticate, checkEventOwnership, catchAsync(async (req, res, next) => {
  const ticketType = await TicketType.findOne({
    where: {
      id: req.params.ticketTypeId,
      event_id: req.params.id
    }
  });

  if (!ticketType) {
    return next(new AppError('Type de billet non trouvé', 404));
  }

  // Vérifier s'il y a des billets vendus
  const soldTickets = await Ticket.count({
    where: { ticket_type_id: ticketType.id }
  });

  if (soldTickets > 0) {
    return next(new AppError('Impossible de supprimer un type de billet avec des billets vendus', 400));
  }

  await ticketType.destroy();

  res.json({
    success: true,
    message: 'Type de billet supprimé avec succès'
  });
}));

// @desc    Obtenir les statistiques d'un événement
// @route   GET /api/events/:id/stats
// @access  Private (Owner/Admin)
router.get('/:id/stats', authenticate, checkEventOwnership, catchAsync(async (req, res, next) => {
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    return next(new AppError('Événement non trouvé', 404));
  }

  const [ticketStats, orderStats, revenueStats] = await Promise.all([
    // Statistiques des billets
    Ticket.findAll({
      where: { event_id: req.params.id },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    }),
    // Statistiques des commandes
    Order.findAll({
      where: { event_id: req.params.id },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    }),
    // Revenus
    Order.findAll({
      where: {
        event_id: req.params.id,
        status: { [Op.in]: ['completed', 'confirmed'] }
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'total_revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'paid_orders']
      ],
      raw: true
    })
  ]);

  const totalTicketsSold = await event.getTotalTicketsSold();
  const totalRevenue = revenueStats[0]?.total_revenue || 0;
  const paidOrders = revenueStats[0]?.paid_orders || 0;

  res.json({
    success: true,
    data: {
      stats: {
        tickets: {
          total_sold: totalTicketsSold,
          by_status: ticketStats
        },
        orders: {
          total_paid: paidOrders,
          by_status: orderStats
        },
        revenue: {
          total: parseFloat(totalRevenue),
          currency: event.currency || 'EUR'
        },
        views: event.view_count || 0
      }
    }
  });
}));

// @desc    Publier un événement
// @route   POST /api/events/:id/publish
// @access  Private (Owner/Admin)
router.post('/:id/publish', authenticate, checkEventOwnership, catchAsync(async (req, res, next) => {
  const event = await Event.findByPk(req.params.id, {
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

  if (event.status === 'published') {
    return next(new AppError('L\'événement est déjà publié', 400));
  }

  // Vérifications avant publication
  if (!event.ticketTypes || event.ticketTypes.length === 0) {
    return next(new AppError('Au moins un type de billet est requis pour publier', 400));
  }

  if (!event.images || event.images.length === 0) {
    return next(new AppError('Au moins une image est requise pour publier', 400));
  }

  // Publier l'événement
  event.status = 'published';
  event.published_at = new Date();
  await event.save();

  res.json({
    success: true,
    message: 'Événement publié avec succès',
    data: {
      event
    }
  });
}));

// @desc    Annuler un événement
// @route   POST /api/events/:id/cancel
// @access  Private (Owner/Admin)
router.post('/:id/cancel', authenticate, checkEventOwnership, catchAsync(async (req, res, next) => {
  const { reason } = req.body;
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    return next(new AppError('Événement non trouvé', 404));
  }

  if (event.status === 'cancelled') {
    return next(new AppError('L\'événement est déjà annulé', 400));
  }

  // Annuler l'événement
  event.status = 'cancelled';
  event.cancelled_at = new Date();
  event.cancellation_reason = reason;
  await event.save();

  // Annuler toutes les commandes en attente
  await Order.update(
    {
      status: 'cancelled',
      cancelled_at: new Date(),
      cancellation_reason: 'Event cancelled'
    },
    {
      where: {
        event_id: event.id,
        status: { [Op.in]: ['pending', 'confirmed'] }
      }
    }
  );

  res.json({
    success: true,
    message: 'Événement annulé avec succès',
    data: {
      event
    }
  });
}));

module.exports = router;