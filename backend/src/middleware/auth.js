const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { verifyAccessToken } = require('../utils/jwt');

// Middleware d'authentification
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification requis'
      });
    }
    
    const token = authHeader.substring(7); // Enlever 'Bearer '
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification requis'
      });
    }
    
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer l'utilisateur
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide - utilisateur non trouvé'
      });
    }
    
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Compte utilisateur désactivé'
      });
    }
    
    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    }
    
    console.error('Erreur d\'authentification:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Middleware d'autorisation par rôle
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé - privilèges insuffisants'
      });
    }
    
    next();
  };
};

// Middleware pour vérifier si l'utilisateur est propriétaire de la ressource
const checkOwnership = (resourceField = 'user_id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }
    
    // Les admins peuvent accéder à toutes les ressources
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Vérifier la propriété de la ressource
    const resourceUserId = req.resource ? req.resource[resourceField] : req.params.userId;
    
    if (resourceUserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé - vous ne pouvez accéder qu\'à vos propres ressources'
      });
    }
    
    next();
  };
};

// Middleware pour vérifier si l'utilisateur peut gérer un événement
const checkEventOwnership = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }
    
    // Les admins peuvent gérer tous les événements
    if (req.user.role === 'admin') {
      return next();
    }
    
    const { Event } = require('../models');
    const eventId = req.params.eventId || req.params.id;
    
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'ID d\'événement requis'
      });
    }
    
    const event = await Event.findByPk(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }
    
    // Vérifier si l'utilisateur est l'organisateur de l'événement
    if (event.organizer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé - vous ne pouvez gérer que vos propres événements'
      });
    }
    
    req.event = event;
    next();
    
  } catch (error) {
    console.error('Erreur lors de la vérification de propriété de l\'événement:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Middleware optionnel d'authentification (n'échoue pas si pas de token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continuer sans utilisateur
    }
    
    const token = authHeader.substring(7);
    
    if (!token) {
      return next(); // Continuer sans utilisateur
    }
    
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer l'utilisateur
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (user && user.is_active) {
      req.user = user;
    }
    
    next();
    
  } catch (error) {
    // En cas d'erreur, continuer sans utilisateur
    next();
  }
};

// Middleware pour vérifier l'email vérifié
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentification requise'
    });
  }
  
  if (!req.user.is_email_verified) {
    return res.status(403).json({
      success: false,
      message: 'Veuillez vérifier votre adresse email avant de continuer'
    });
  }
  
  next();
};

// Middleware pour vérifier la propriété d'une ressource
const checkResourceOwnership = (Model, ownerField = 'user_id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentification requise'
        });
      }

      const resourceId = req.params.id || req.params.orderId || req.params.ticketId;
      
      if (!resourceId) {
        return res.status(400).json({
          success: false,
          message: 'ID de ressource requis'
        });
      }

      const resource = await Model.findByPk(resourceId);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Ressource non trouvée'
        });
      }

      // Vérifier la propriété ou si l'utilisateur est admin
      if (req.user.role === 'admin' || resource[ownerField] === req.user.id) {
        req.resource = resource;
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé à cette ressource'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de propriété:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la vérification de propriété'
      });
    }
  };
};

module.exports = {
  authenticate,
  authorize,
  checkOwnership,
  checkEventOwnership,
  checkResourceOwnership,
  optionalAuth,
  requireEmailVerification
};