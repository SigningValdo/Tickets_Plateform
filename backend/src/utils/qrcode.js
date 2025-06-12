const QRCode = require('qrcode');
const crypto = require('crypto');
const { AppError } = require('../middleware/errorHandler');

/**
 * Générer un code QR pour un ticket
 * @param {Object} ticketData - Les données du ticket
 * @returns {Promise<string>} - Le code QR en base64
 */
async function generateQRCode(ticketData) {
  try {
    const {
      id,
      ticket_number,
      event_id,
      user_id,
      order_id,
      seat_number,
      ticket_type
    } = ticketData;

    // Créer les données à encoder dans le QR code
    const qrData = {
      ticket_id: id,
      ticket_number,
      event_id,
      user_id,
      order_id,
      seat_number,
      ticket_type,
      timestamp: Date.now(),
      // Ajouter une signature pour la sécurité
      signature: generateTicketSignature({
        ticket_id: id,
        ticket_number,
        event_id,
        user_id
      })
    };

    // Convertir en JSON string
    const qrString = JSON.stringify(qrData);

    // Générer le QR code
    const qrCodeDataURL = await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    });

    return qrCodeDataURL;
  } catch (error) {
    console.error('Erreur lors de la génération du QR code:', error);
    throw new AppError('Erreur lors de la génération du QR code', 500);
  }
}

/**
 * Générer un QR code simple avec du texte
 * @param {string} text - Le texte à encoder
 * @param {Object} options - Options pour le QR code
 * @returns {Promise<string>} - Le code QR en base64
 */
async function generateSimpleQRCode(text, options = {}) {
  try {
    const defaultOptions = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    };

    const qrOptions = { ...defaultOptions, ...options };
    const qrCodeDataURL = await QRCode.toDataURL(text, qrOptions);
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Erreur lors de la génération du QR code simple:', error);
    throw new AppError('Erreur lors de la génération du QR code', 500);
  }
}

/**
 * Générer une signature pour sécuriser le ticket
 * @param {Object} ticketData - Les données du ticket
 * @returns {string} - La signature
 */
function generateTicketSignature(ticketData) {
  const secret = process.env.TICKET_SECRET || 'default-ticket-secret';
  const dataString = JSON.stringify(ticketData);
  
  return crypto
    .createHmac('sha256', secret)
    .update(dataString)
    .digest('hex');
}

/**
 * Vérifier la signature d'un ticket
 * @param {Object} ticketData - Les données du ticket
 * @param {string} signature - La signature à vérifier
 * @returns {boolean} - True si la signature est valide
 */
function verifyTicketSignature(ticketData, signature) {
  try {
    const expectedSignature = generateTicketSignature(ticketData);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Erreur lors de la vérification de signature:', error);
    return false;
  }
}

/**
 * Décoder et valider un QR code de ticket
 * @param {string} qrString - Le contenu du QR code
 * @returns {Object} - Les données décodées et validées
 */
function decodeTicketQR(qrString) {
  try {
    const qrData = JSON.parse(qrString);
    
    // Vérifier que toutes les données requises sont présentes
    const requiredFields = ['ticket_id', 'ticket_number', 'event_id', 'user_id', 'signature'];
    for (const field of requiredFields) {
      if (!qrData[field]) {
        throw new AppError(`Champ requis manquant: ${field}`, 400);
      }
    }

    // Vérifier la signature
    const { signature, ...ticketData } = qrData;
    if (!verifyTicketSignature(ticketData, signature)) {
      throw new AppError('Signature du ticket invalide', 400);
    }

    return {
      valid: true,
      data: qrData
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('QR code invalide', 400);
  }
}

/**
 * Générer un QR code pour l'URL de vérification d'un ticket
 * @param {string} ticketId - L'ID du ticket
 * @param {string} baseUrl - L'URL de base de l'application
 * @returns {Promise<string>} - Le code QR en base64
 */
async function generateTicketVerificationQR(ticketId, baseUrl) {
  try {
    const verificationUrl = `${baseUrl}/verify-ticket/${ticketId}`;
    
    return await generateSimpleQRCode(verificationUrl, {
      width: 200,
      margin: 2
    });
  } catch (error) {
    console.error('Erreur lors de la génération du QR de vérification:', error);
    throw new AppError('Erreur lors de la génération du QR de vérification', 500);
  }
}

/**
 * Générer un QR code pour un événement
 * @param {Object} eventData - Les données de l'événement
 * @returns {Promise<string>} - Le code QR en base64
 */
async function generateEventQRCode(eventData) {
  try {
    const { id, title, start_date, venue_name, venue_address } = eventData;
    
    const eventInfo = {
      event_id: id,
      title,
      start_date,
      venue_name,
      venue_address,
      url: `${process.env.FRONTEND_URL}/events/${id}`
    };

    const qrString = JSON.stringify(eventInfo);
    
    return await generateSimpleQRCode(qrString, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1a365d',
        light: '#ffffff'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la génération du QR de l\'événement:', error);
    throw new AppError('Erreur lors de la génération du QR de l\'événement', 500);
  }
}

/**
 * Générer un QR code pour le WiFi d'un événement
 * @param {Object} wifiData - Les données WiFi
 * @returns {Promise<string>} - Le code QR en base64
 */
async function generateWiFiQRCode(wifiData) {
  try {
    const { ssid, password, security = 'WPA', hidden = false } = wifiData;
    
    // Format standard pour QR code WiFi
    const wifiString = `WIFI:T:${security};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;
    
    return await generateSimpleQRCode(wifiString, {
      width: 200,
      margin: 1
    });
  } catch (error) {
    console.error('Erreur lors de la génération du QR WiFi:', error);
    throw new AppError('Erreur lors de la génération du QR WiFi', 500);
  }
}

module.exports = {
  generateQRCode,
  generateSimpleQRCode,
  generateTicketSignature,
  verifyTicketSignature,
  decodeTicketQR,
  generateTicketVerificationQR,
  generateEventQRCode,
  generateWiFiQRCode
};