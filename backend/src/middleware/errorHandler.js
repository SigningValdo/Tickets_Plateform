const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');

// Classe d'erreur personnalisée
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Gestionnaire d'erreurs de validation Sequelize
const handleSequelizeValidationError = (error) => {
  const errors = error.errors.map(err => ({
    field: err.path,
    message: err.message,
    value: err.value
  }));
  
  return new AppError('Données de validation invalides', 400, true, errors);
};

// Gestionnaire d'erreurs de contrainte unique Sequelize
const handleSequelizeUniqueError = (error) => {
  const field = error.errors[0]?.path || 'field';
  const value = error.errors[0]?.value || 'value';
  
  let message = `${field} '${value}' existe déjà`;
  
  // Messages personnalisés pour certains champs
  if (field === 'email') {
    message = 'Cette adresse email est déjà utilisée';
  } else if (field === 'phone') {
    message = 'Ce numéro de téléphone est déjà utilisé';
  }
  
  return new AppError(message, 400);
};

// Gestionnaire d'erreurs de clé étrangère Sequelize
const handleSequelizeForeignKeyError = (error) => {
  return new AppError('Référence invalide - la ressource liée n\'existe pas', 400);
};

// Gestionnaire d'erreurs JWT
const handleJWTError = () => {
  return new AppError('Token invalide. Veuillez vous reconnecter.', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Token expiré. Veuillez vous reconnecter.', 401);
};

// Gestionnaire d'erreurs de cast (MongoDB style, adapté pour PostgreSQL)
const handleCastError = (error) => {
  return new AppError('Format de données invalide', 400);
};

// Envoyer l'erreur en développement
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack,
    ...(err.errors && { errors: err.errors })
  });
};

// Envoyer l'erreur en production
const sendErrorProd = (err, res) => {
  // Erreur opérationnelle, de confiance : envoyer le message au client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors })
    });
  } else {
    // Erreur de programmation : ne pas divulguer les détails
    console.error('ERREUR:', err);
    
    res.status(500).json({
      success: false,
      message: 'Une erreur inattendue s\'est produite'
    });
  }
};

// Middleware principal de gestion d'erreurs
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  
  // Log de l'erreur
  console.error('Erreur capturée:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id
  });
  
  // Gestion des erreurs Sequelize
  if (err instanceof ValidationError) {
    error = handleSequelizeValidationError(err);
  } else if (err instanceof UniqueConstraintError) {
    error = handleSequelizeUniqueError(err);
  } else if (err instanceof ForeignKeyConstraintError) {
    error = handleSequelizeForeignKeyError(err);
  }
  
  // Gestion des erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  } else if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }
  
  // Gestion des erreurs de cast
  if (err.name === 'CastError') {
    error = handleCastError(err);
  }
  
  // Gestion des erreurs de syntaxe JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = new AppError('JSON invalide dans le corps de la requête', 400);
  }
  
  // Gestion des erreurs de limite de taille
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new AppError('Fichier trop volumineux', 400);
  }
  
  // Gestion des erreurs de connexion à la base de données
  if (err.name === 'SequelizeConnectionError') {
    error = new AppError('Erreur de connexion à la base de données', 500);
  }
  
  // Gestion des erreurs de timeout
  if (err.name === 'SequelizeTimeoutError') {
    error = new AppError('Timeout de la base de données', 500);
  }
  
  // Envoyer la réponse d'erreur
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

// Gestionnaire pour les routes non trouvées
const notFound = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} non trouvée`, 404);
  next(error);
};

// Gestionnaire d'erreurs asynchrones
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Middleware de validation des données
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));
      
      return next(new AppError('Données de validation invalides', 400, true, errors));
    }
    
    next();
  };
};

module.exports = {
  AppError,
  errorHandler,
  notFound,
  catchAsync,
  validateRequest
};