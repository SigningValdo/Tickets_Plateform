const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { AppError } = require('../middleware/errorHandler');

/**
 * Générer les tokens d'accès et de rafraîchissement
 * @param {Object} payload - Les données à inclure dans le token
 * @returns {Object} - Les tokens générés
 */
function generateTokens(payload) {
  try {
    // Token d'accès (courte durée)
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        issuer: process.env.APP_NAME || 'ticketing-platform',
        audience: 'user'
      }
    );

    // Token de rafraîchissement (longue durée)
    const refreshToken = jwt.sign(
      { userId: payload.userId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        issuer: process.env.APP_NAME || 'ticketing-platform',
        audience: 'user'
      }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m'
    };
  } catch (error) {
    throw new AppError('Erreur lors de la génération des tokens', 500);
  }
}

/**
 * Vérifier et décoder un token d'accès
 * @param {string} token - Le token à vérifier
 * @returns {Object} - Les données décodées du token
 */
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: process.env.APP_NAME || 'ticketing-platform',
      audience: 'user'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token expiré', 401);
    } else if (error.name === 'JsonWebTokenError') {
      throw new AppError('Token invalide', 401);
    } else {
      throw new AppError('Erreur de vérification du token', 401);
    }
  }
}

/**
 * Vérifier et décoder un token de rafraîchissement
 * @param {string} refreshToken - Le token de rafraîchissement à vérifier
 * @returns {Object} - Les données décodées du token
 */
function verifyRefreshToken(refreshToken) {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      {
        issuer: process.env.APP_NAME || 'ticketing-platform',
        audience: 'user'
      }
    );

    // Vérifier que c'est bien un token de rafraîchissement
    if (decoded.type !== 'refresh') {
      throw new AppError('Type de token invalide', 401);
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token de rafraîchissement expiré', 401);
    } else if (error.name === 'JsonWebTokenError') {
      throw new AppError('Token de rafraîchissement invalide', 401);
    } else if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError('Erreur de vérification du token de rafraîchissement', 401);
    }
  }
}

/**
 * Générer un token de réinitialisation de mot de passe
 * @returns {string} - Le token généré
 */
function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Générer un token de vérification d'email
 * @returns {string} - Le token généré
 */
function generateEmailVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Extraire le token du header Authorization
 * @param {string} authHeader - Le header Authorization
 * @returns {string|null} - Le token extrait ou null
 */
function extractTokenFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Vérifier si un token est expiré sans le décoder complètement
 * @param {string} token - Le token à vérifier
 * @returns {boolean} - True si le token est expiré
 */
function isTokenExpired(token) {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    return true;
  }
}

/**
 * Obtenir les informations du token sans le vérifier
 * @param {string} token - Le token à décoder
 * @returns {Object|null} - Les données décodées ou null
 */
function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  generateResetToken,
  generateEmailVerificationToken,
  extractTokenFromHeader,
  isTokenExpired,
  decodeToken
};