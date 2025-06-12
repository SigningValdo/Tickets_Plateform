const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const { authenticate } = require('../middleware/auth');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { sendEmail } = require('../utils/email');
const { generateTokens, verifyRefreshToken } = require('../utils/jwt');

const router = express.Router();

// @desc    Inscription d'un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
router.post('/register', catchAsync(async (req, res, next) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    password,
    confirm_password,
    date_of_birth,
    gender
  } = req.body;

  // Validation des champs requis
  if (!first_name || !last_name || !email || !password) {
    return next(new AppError('Tous les champs obligatoires doivent être remplis', 400));
  }

  // Vérification de la confirmation du mot de passe
  if (password !== confirm_password) {
    return next(new AppError('Les mots de passe ne correspondent pas', 400));
  }

  // Vérification de la force du mot de passe
  if (password.length < 8) {
    return next(new AppError('Le mot de passe doit contenir au moins 8 caractères', 400));
  }

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return next(new AppError('Un utilisateur avec cette adresse email existe déjà', 400));
  }

  // Générer le token de vérification d'email
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');
  const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

  // Créer l'utilisateur
  const user = await User.create({
    first_name,
    last_name,
    email: email.toLowerCase(),
    phone,
    password,
    date_of_birth,
    gender,
    email_verification_token: emailVerificationToken,
    email_verification_expires: emailVerificationExpires
  });

  // Envoyer l'email de vérification
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/auth/email-verification?token=${emailVerificationToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Vérification de votre adresse email - E-Tickets',
      template: 'email-verification',
      data: {
        name: `${user.first_name} ${user.last_name}`,
        verificationUrl
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
    // Ne pas faire échouer l'inscription si l'email ne peut pas être envoyé
  }

  // Générer les tokens JWT
  const { accessToken, refreshToken } = generateTokens(user.id);

  res.status(201).json({
    success: true,
    message: 'Inscription réussie. Veuillez vérifier votre adresse email.',
    data: {
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        is_email_verified: user.is_email_verified
      },
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken
      }
    }
  });
}));

// @desc    Connexion d'un utilisateur
// @route   POST /api/auth/login
// @access  Public
router.post('/login', catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validation des champs
  if (!email || !password) {
    return next(new AppError('Email et mot de passe requis', 400));
  }

  // Trouver l'utilisateur avec le mot de passe
  const user = await User.findOne({
    where: { email: email.toLowerCase() },
    attributes: { include: ['password'] }
  });

  if (!user || !(await user.validatePassword(password))) {
    return next(new AppError('Email ou mot de passe incorrect', 401));
  }

  // Vérifier si le compte est actif
  if (!user.is_active) {
    return next(new AppError('Votre compte a été désactivé. Contactez le support.', 401));
  }

  // Mettre à jour la dernière connexion
  user.last_login = new Date();
  await user.save();

  // Générer les tokens JWT
  const { accessToken, refreshToken } = generateTokens(user.id);

  res.json({
    success: true,
    message: 'Connexion réussie',
    data: {
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        is_email_verified: user.is_email_verified,
        avatar: user.avatar
      },
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken
      }
    }
  });
}));

// @desc    Rafraîchir le token d'accès
// @route   POST /api/auth/refresh
// @access  Public
router.post('/refresh', catchAsync(async (req, res, next) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return next(new AppError('Token de rafraîchissement requis', 400));
  }

  const decoded = verifyRefreshToken(refresh_token);
  if (!decoded) {
    return next(new AppError('Token de rafraîchissement invalide', 401));
  }

  // Vérifier que l'utilisateur existe toujours
  const user = await User.findByPk(decoded.userId);
  if (!user || !user.is_active) {
    return next(new AppError('Utilisateur non trouvé ou inactif', 401));
  }

  // Générer de nouveaux tokens
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);

  res.json({
    success: true,
    data: {
      tokens: {
        access_token: accessToken,
        refresh_token: newRefreshToken
      }
    }
  });
}));

// @desc    Vérification de l'adresse email
// @route   POST /api/auth/verify-email
// @access  Public
router.post('/verify-email', catchAsync(async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new AppError('Token de vérification requis', 400));
  }

  // Trouver l'utilisateur avec ce token
  const user = await User.findOne({
    where: {
      email_verification_token: token,
      email_verification_expires: {
        [require('sequelize').Op.gt]: new Date()
      }
    }
  });

  if (!user) {
    return next(new AppError('Token de vérification invalide ou expiré', 400));
  }

  // Marquer l'email comme vérifié
  user.is_email_verified = true;
  user.email_verification_token = null;
  user.email_verification_expires = null;
  await user.save();

  res.json({
    success: true,
    message: 'Adresse email vérifiée avec succès'
  });
}));

// @desc    Renvoyer l'email de vérification
// @route   POST /api/auth/resend-verification
// @access  Private
router.post('/resend-verification', authenticate, catchAsync(async (req, res, next) => {
  const user = req.user;

  if (user.is_email_verified) {
    return next(new AppError('Votre adresse email est déjà vérifiée', 400));
  }

  // Générer un nouveau token
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');
  const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  user.email_verification_token = emailVerificationToken;
  user.email_verification_expires = emailVerificationExpires;
  await user.save();

  // Envoyer l'email
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/auth/email-verification?token=${emailVerificationToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Vérification de votre adresse email - E-Tickets',
      template: 'email-verification',
      data: {
        name: `${user.first_name} ${user.last_name}`,
        verificationUrl
      }
    });

    res.json({
      success: true,
      message: 'Email de vérification envoyé'
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return next(new AppError('Erreur lors de l\'envoi de l\'email', 500));
  }
}));

// @desc    Demande de réinitialisation de mot de passe
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Adresse email requise', 400));
  }

  const user = await User.findOne({ where: { email: email.toLowerCase() } });

  if (!user) {
    // Ne pas révéler si l'email existe ou non
    return res.json({
      success: true,
      message: 'Si cette adresse email existe, vous recevrez un lien de réinitialisation'
    });
  }

  // Générer le token de réinitialisation
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.reset_password_token = resetToken;
  user.reset_password_expires = resetExpires;
  await user.save();

  // Envoyer l'email
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe - E-Tickets',
      template: 'password-reset',
      data: {
        name: `${user.first_name} ${user.last_name}`,
        resetUrl
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();
    return next(new AppError('Erreur lors de l\'envoi de l\'email', 500));
  }

  res.json({
    success: true,
    message: 'Si cette adresse email existe, vous recevrez un lien de réinitialisation'
  });
}));

// @desc    Réinitialisation du mot de passe
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', catchAsync(async (req, res, next) => {
  const { token, password, confirm_password } = req.body;

  if (!token || !password || !confirm_password) {
    return next(new AppError('Tous les champs sont requis', 400));
  }

  if (password !== confirm_password) {
    return next(new AppError('Les mots de passe ne correspondent pas', 400));
  }

  if (password.length < 8) {
    return next(new AppError('Le mot de passe doit contenir au moins 8 caractères', 400));
  }

  // Trouver l'utilisateur avec le token valide
  const user = await User.findOne({
    where: {
      reset_password_token: token,
      reset_password_expires: {
        [require('sequelize').Op.gt]: new Date()
      }
    }
  });

  if (!user) {
    return next(new AppError('Token de réinitialisation invalide ou expiré', 400));
  }

  // Mettre à jour le mot de passe
  user.password = password;
  user.reset_password_token = null;
  user.reset_password_expires = null;
  await user.save();

  res.json({
    success: true,
    message: 'Mot de passe réinitialisé avec succès'
  });
}));

// @desc    Changer le mot de passe (utilisateur connecté)
// @route   POST /api/auth/change-password
// @access  Private
router.post('/change-password', authenticate, catchAsync(async (req, res, next) => {
  const { current_password, new_password, confirm_password } = req.body;

  if (!current_password || !new_password || !confirm_password) {
    return next(new AppError('Tous les champs sont requis', 400));
  }

  if (new_password !== confirm_password) {
    return next(new AppError('Les nouveaux mots de passe ne correspondent pas', 400));
  }

  if (new_password.length < 8) {
    return next(new AppError('Le nouveau mot de passe doit contenir au moins 8 caractères', 400));
  }

  // Récupérer l'utilisateur avec le mot de passe
  const user = await User.findByPk(req.user.id, {
    attributes: { include: ['password'] }
  });

  // Vérifier le mot de passe actuel
  if (!(await user.validatePassword(current_password))) {
    return next(new AppError('Mot de passe actuel incorrect', 400));
  }

  // Mettre à jour le mot de passe
  user.password = new_password;
  await user.save();

  res.json({
    success: true,
    message: 'Mot de passe modifié avec succès'
  });
}));

// @desc    Obtenir le profil de l'utilisateur connecté
// @route   GET /api/auth/me
// @access  Private
router.get('/me', authenticate, catchAsync(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
}));

// @desc    Déconnexion (côté client principalement)
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', authenticate, catchAsync(async (req, res) => {
  // En JWT, la déconnexion se fait principalement côté client
  // Ici on peut logger l'événement ou invalider le token si on a une blacklist
  
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
}));

module.exports = router;