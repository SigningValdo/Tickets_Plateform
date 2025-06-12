const { body, param, query, validationResult } = require('express-validator');
const { AppError } = require('../middleware/errorHandler');

/**
 * Middleware pour vérifier les résultats de validation
 */
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return next(new AppError('Données de validation invalides', 400, errorMessages));
  }
  next();
};

/**
 * Validations pour l'authentification
 */
const authValidation = {
  register: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Adresse email valide requise'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Le mot de passe doit contenir au moins 8 caractères')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'),
    body('first_name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Le prénom doit contenir entre 2 et 50 caractères')
      .matches(/^[\p{L}\s-']+$/u)
      .withMessage('Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes'),
    body('last_name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Le nom doit contenir entre 2 et 50 caractères')
      .matches(/^[\p{L}\s-']+$/u)
      .withMessage('Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes'),
    body('phone')
      .optional()
      .isMobilePhone('fr-FR')
      .withMessage('Numéro de téléphone français valide requis'),
    body('date_of_birth')
      .optional()
      .isISO8601()
      .withMessage('Date de naissance valide requise (YYYY-MM-DD)')
      .custom(value => {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 13) {
          throw new Error('Vous devez avoir au moins 13 ans');
        }
        return true;
      }),
    checkValidation
  ],
  
  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Adresse email valide requise'),
    body('password')
      .notEmpty()
      .withMessage('Mot de passe requis'),
    checkValidation
  ],
  
  forgotPassword: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Adresse email valide requise'),
    checkValidation
  ],
  
  resetPassword: [
    body('token')
      .notEmpty()
      .withMessage('Token de réinitialisation requis'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Le mot de passe doit contenir au moins 8 caractères')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'),
    checkValidation
  ],
  
  changePassword: [
    body('current_password')
      .notEmpty()
      .withMessage('Mot de passe actuel requis'),
    body('new_password')
      .isLength({ min: 8 })
      .withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Le nouveau mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'),
    checkValidation
  ]
};

/**
 * Validations pour les utilisateurs
 */
const userValidation = {
  updateProfile: [
    body('first_name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Le prénom doit contenir entre 2 et 50 caractères'),
    body('last_name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
    body('phone')
      .optional()
      .isMobilePhone('fr-FR')
      .withMessage('Numéro de téléphone français valide requis'),
    body('date_of_birth')
      .optional()
      .isISO8601()
      .withMessage('Date de naissance valide requise'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('L\'adresse ne peut pas dépasser 200 caractères'),
    body('city')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('La ville ne peut pas dépasser 100 caractères'),
    body('postal_code')
      .optional()
      .matches(/^\d{5}$/)
      .withMessage('Code postal français valide requis (5 chiffres)'),
    body('country')
      .optional()
      .isISO31661Alpha2()
      .withMessage('Code pays ISO valide requis'),
    checkValidation
  ]
};

/**
 * Validations pour les événements
 */
const eventValidation = {
  create: [
    body('title')
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Le titre doit contenir entre 3 et 200 caractères'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 5000 })
      .withMessage('La description doit contenir entre 10 et 5000 caractères'),
    body('category')
      .isIn(['concert', 'theatre', 'sport', 'conference', 'festival', 'exposition', 'autre'])
      .withMessage('Catégorie invalide'),
    body('start_date')
      .isISO8601()
      .withMessage('Date de début valide requise')
      .custom(value => {
        if (new Date(value) <= new Date()) {
          throw new Error('La date de début doit être dans le futur');
        }
        return true;
      }),
    body('end_date')
      .isISO8601()
      .withMessage('Date de fin valide requise')
      .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.start_date)) {
          throw new Error('La date de fin doit être après la date de début');
        }
        return true;
      }),
    body('venue_name')
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage('Le nom du lieu doit contenir entre 2 et 200 caractères'),
    body('venue_address')
      .trim()
      .isLength({ min: 5, max: 300 })
      .withMessage('L\'adresse du lieu doit contenir entre 5 et 300 caractères'),
    body('venue_city')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('La ville doit contenir entre 2 et 100 caractères'),
    body('venue_postal_code')
      .matches(/^\d{5}$/)
      .withMessage('Code postal français valide requis'),
    body('max_attendees')
      .isInt({ min: 1, max: 100000 })
      .withMessage('Le nombre maximum de participants doit être entre 1 et 100000'),
    body('sale_start_date')
      .optional()
      .isISO8601()
      .withMessage('Date de début de vente valide requise'),
    body('sale_end_date')
      .optional()
      .isISO8601()
      .withMessage('Date de fin de vente valide requise')
      .custom((value, { req }) => {
        if (value && req.body.sale_start_date && new Date(value) <= new Date(req.body.sale_start_date)) {
          throw new Error('La date de fin de vente doit être après la date de début de vente');
        }
        return true;
      }),
    body('age_restriction')
      .optional()
      .isInt({ min: 0, max: 99 })
      .withMessage('La restriction d\'âge doit être entre 0 et 99 ans'),
    checkValidation
  ],
  
  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Le titre doit contenir entre 3 et 200 caractères'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 5000 })
      .withMessage('La description doit contenir entre 10 et 5000 caractères'),
    body('category')
      .optional()
      .isIn(['concert', 'theatre', 'sport', 'conference', 'festival', 'exposition', 'autre'])
      .withMessage('Catégorie invalide'),
    body('start_date')
      .optional()
      .isISO8601()
      .withMessage('Date de début valide requise'),
    body('end_date')
      .optional()
      .isISO8601()
      .withMessage('Date de fin valide requise'),
    body('max_attendees')
      .optional()
      .isInt({ min: 1, max: 100000 })
      .withMessage('Le nombre maximum de participants doit être entre 1 et 100000'),
    checkValidation
  ]
};

/**
 * Validations pour les types de billets
 */
const ticketTypeValidation = {
  create: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('La description ne peut pas dépasser 500 caractères'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Le prix doit être un nombre positif'),
    body('currency')
      .isIn(['EUR', 'USD', 'GBP'])
      .withMessage('Devise non supportée'),
    body('quantity')
      .isInt({ min: 1, max: 10000 })
      .withMessage('La quantité doit être entre 1 et 10000'),
    body('max_per_order')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Le maximum par commande doit être entre 1 et 50'),
    body('sale_start_date')
      .optional()
      .isISO8601()
      .withMessage('Date de début de vente valide requise'),
    body('sale_end_date')
      .optional()
      .isISO8601()
      .withMessage('Date de fin de vente valide requise'),
    checkValidation
  ],
  
  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('La description ne peut pas dépasser 500 caractères'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Le prix doit être un nombre positif'),
    body('quantity')
      .optional()
      .isInt({ min: 1, max: 10000 })
      .withMessage('La quantité doit être entre 1 et 10000'),
    checkValidation
  ]
};

/**
 * Validations pour les commandes
 */
const orderValidation = {
  create: [
    body('event_id')
      .isUUID()
      .withMessage('ID d\'événement valide requis'),
    body('items')
      .isArray({ min: 1 })
      .withMessage('Au moins un article requis'),
    body('items.*.ticket_type_id')
      .isUUID()
      .withMessage('ID de type de billet valide requis'),
    body('items.*.quantity')
      .isInt({ min: 1, max: 50 })
      .withMessage('La quantité doit être entre 1 et 50'),
    body('customer_info.first_name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Prénom requis'),
    body('customer_info.last_name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Nom requis'),
    body('customer_info.email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Email valide requis'),
    body('customer_info.phone')
      .optional()
      .isMobilePhone()
      .withMessage('Numéro de téléphone valide requis'),
    body('discount_code')
      .optional()
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Code de réduction invalide'),
    checkValidation
  ]
};

/**
 * Validations pour les billets
 */
const ticketValidation = {
  transfer: [
    body('to_email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Adresse email valide requise'),
    body('message')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Le message ne peut pas dépasser 500 caractères'),
    checkValidation
  ]
};

/**
 * Validations pour les paramètres d'URL
 */
const paramValidation = {
  id: [
    param('id')
      .isUUID()
      .withMessage('ID valide requis'),
    checkValidation
  ],
  
  orderNumber: [
    param('orderNumber')
      .matches(/^ORD-\d{10}$/)
      .withMessage('Numéro de commande valide requis'),
    checkValidation
  ]
};

/**
 * Validations pour les paramètres de requête
 */
const queryValidation = {
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Le numéro de page doit être un entier positif'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('La limite doit être entre 1 et 100'),
    checkValidation
  ],
  
  dateRange: [
    query('date_from')
      .optional()
      .isISO8601()
      .withMessage('Date de début valide requise'),
    query('date_to')
      .optional()
      .isISO8601()
      .withMessage('Date de fin valide requise')
      .custom((value, { req }) => {
        if (value && req.query.date_from && new Date(value) <= new Date(req.query.date_from)) {
          throw new Error('La date de fin doit être après la date de début');
        }
        return true;
      }),
    checkValidation
  ]
};

/**
 * Fonction utilitaire pour valider les fichiers uploadés
 */
const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB par défaut
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    required = false
  } = options;

  if (!file && required) {
    throw new AppError('Fichier requis', 400);
  }

  if (file) {
    if (file.size > maxSize) {
      throw new AppError(`Fichier trop volumineux (max ${maxSize / 1024 / 1024}MB)`, 400);
    }

    if (!allowedTypes.includes(file.mimetype)) {
      throw new AppError(`Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`, 400);
    }
  }

  return true;
};

/**
 * Fonction utilitaire pour nettoyer et valider les données
 */
const sanitizeData = (data, allowedFields) => {
  const sanitized = {};
  
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      if (typeof data[field] === 'string') {
        sanitized[field] = data[field].trim();
      } else {
        sanitized[field] = data[field];
      }
    }
  }
  
  return sanitized;
};

module.exports = {
  checkValidation,
  authValidation,
  userValidation,
  eventValidation,
  ticketTypeValidation,
  orderValidation,
  ticketValidation,
  paramValidation,
  queryValidation,
  validateFile,
  sanitizeData
};