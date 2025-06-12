const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;
const QRCode = require('qrcode');
const { formatAmount } = require('./payment');

// Configuration du transporteur email
let transporter;

if (process.env.NODE_ENV === 'production') {
  // Configuration pour la production (ex: SendGrid, Mailgun, etc.)
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
} else {
  // Configuration pour le développement (Ethereal Email)
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
      pass: process.env.EMAIL_PASSWORD || 'ethereal.pass'
    }
  });
}

/**
 * Envoyer un email de base
 */
async function sendEmail({ to, subject, html, text, attachments = [] }) {
  try {
    const mailOptions = {
      from: `${process.env.APP_NAME || 'Ticketing Platform'} <${process.env.EMAIL_FROM || 'noreply@ticketing.com'}>`,
      to,
      subject,
      html,
      text,
      attachments
    };

    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email envoyé:', nodemailer.getTestMessageUrl(info));
    }
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Générer le template HTML de base
 */
function generateEmailTemplate({ title, content, buttonText, buttonUrl, footerText }) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #4f46e5;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f9fafb;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .button {
          display: inline-block;
          background-color: #4f46e5;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .ticket-info {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
        }
        .qr-code {
          text-align: center;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${process.env.APP_NAME || 'Ticketing Platform'}</h1>
      </div>
      <div class="content">
        <h2>${title}</h2>
        ${content}
        ${buttonText && buttonUrl ? `<div style="text-align: center;"><a href="${buttonUrl}" class="button">${buttonText}</a></div>` : ''}
      </div>
      <div class="footer">
        ${footerText || `© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Ticketing Platform'}. Tous droits réservés.`}
      </div>
    </body>
    </html>
  `;
}

/**
 * Envoyer un email de vérification
 */
async function sendVerificationEmail(user, verificationToken) {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  
  const content = `
    <p>Bonjour ${user.first_name},</p>
    <p>Merci de vous être inscrit sur notre plateforme ! Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
    <p>Ce lien expirera dans 24 heures.</p>
    <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
  `;
  
  const html = generateEmailTemplate({
    title: 'Vérifiez votre adresse email',
    content,
    buttonText: 'Vérifier mon email',
    buttonUrl: verificationUrl
  });
  
  return await sendEmail({
    to: user.email,
    subject: 'Vérifiez votre adresse email',
    html,
    text: `Bonjour ${user.first_name}, veuillez vérifier votre email en visitant: ${verificationUrl}`
  });
}

/**
 * Envoyer un email de réinitialisation de mot de passe
 */
async function sendPasswordResetEmail(user, resetToken) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const content = `
    <p>Bonjour ${user.first_name},</p>
    <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
    <p>Ce lien expirera dans 1 heure.</p>
    <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
  `;
  
  const html = generateEmailTemplate({
    title: 'Réinitialisation de votre mot de passe',
    content,
    buttonText: 'Réinitialiser mon mot de passe',
    buttonUrl: resetUrl
  });
  
  return await sendEmail({
    to: user.email,
    subject: 'Réinitialisation de votre mot de passe',
    html,
    text: `Bonjour ${user.first_name}, réinitialisez votre mot de passe en visitant: ${resetUrl}`
  });
}

/**
 * Envoyer un email de confirmation de commande
 */
async function sendOrderConfirmationEmail(order, user, event, tickets) {
  const orderUrl = `${process.env.FRONTEND_URL}/orders/${order.id}`;
  
  const ticketsHtml = tickets.map(ticket => `
    <div class="ticket-info">
      <h4>Billet #${ticket.ticket_number}</h4>
      <p><strong>Type:</strong> ${ticket.ticket_type.name}</p>
      <p><strong>Prix:</strong> ${formatAmount(ticket.price_paid, ticket.currency)}</p>
      <p><strong>Nom:</strong> ${ticket.attendee_name || user.first_name + ' ' + user.last_name}</p>
      ${ticket.seat_info ? `<p><strong>Siège:</strong> ${ticket.seat_info}</p>` : ''}
    </div>
  `).join('');
  
  const content = `
    <p>Bonjour ${user.first_name},</p>
    <p>Votre commande a été confirmée avec succès !</p>
    
    <div class="ticket-info">
      <h3>Détails de la commande</h3>
      <p><strong>Numéro de commande:</strong> ${order.order_number}</p>
      <p><strong>Événement:</strong> ${event.title}</p>
      <p><strong>Date:</strong> ${new Date(event.start_date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>
      <p><strong>Lieu:</strong> ${event.venue_name}, ${event.venue_address}</p>
      <p><strong>Total payé:</strong> ${formatAmount(order.total_amount, order.currency)}</p>
    </div>
    
    <h3>Vos billets</h3>
    ${ticketsHtml}
    
    <p>Vous recevrez vos billets par email séparément. Vous pouvez également les consulter dans votre espace personnel.</p>
  `;
  
  const html = generateEmailTemplate({
    title: 'Confirmation de votre commande',
    content,
    buttonText: 'Voir ma commande',
    buttonUrl: orderUrl
  });
  
  return await sendEmail({
    to: user.email,
    subject: `Confirmation de commande - ${event.title}`,
    html,
    text: `Votre commande ${order.order_number} pour ${event.title} a été confirmée.`
  });
}

/**
 * Envoyer un billet par email
 */
async function sendTicketEmail(ticket, user, event) {
  try {
    // Générer le QR code
    const qrCodeDataUrl = await QRCode.toDataURL(ticket.qr_code, {
      width: 200,
      margin: 2
    });
    
    const eventDate = new Date(event.start_date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const content = `
      <p>Bonjour ${user.first_name},</p>
      <p>Voici votre billet pour l'événement <strong>${event.title}</strong>.</p>
      
      <div class="ticket-info">
        <h3>Informations du billet</h3>
        <p><strong>Numéro de billet:</strong> ${ticket.ticket_number}</p>
        <p><strong>Type:</strong> ${ticket.ticket_type.name}</p>
        <p><strong>Événement:</strong> ${event.title}</p>
        <p><strong>Date:</strong> ${eventDate}</p>
        <p><strong>Lieu:</strong> ${event.venue_name}</p>
        <p><strong>Adresse:</strong> ${event.venue_address}</p>
        ${ticket.seat_info ? `<p><strong>Siège:</strong> ${ticket.seat_info}</p>` : ''}
        <p><strong>Nom du participant:</strong> ${ticket.attendee_name || user.first_name + ' ' + user.last_name}</p>
        
        <div class="qr-code">
          <h4>Code QR pour l'entrée</h4>
          <img src="${qrCodeDataUrl}" alt="QR Code" style="max-width: 200px;" />
          <p><small>Présentez ce code QR à l'entrée</small></p>
        </div>
      </div>
      
      <p><strong>Instructions importantes :</strong></p>
      <ul>
        <li>Présentez ce billet (version numérique ou imprimée) à l'entrée</li>
        <li>Arrivez 30 minutes avant le début de l'événement</li>
        <li>Une pièce d'identité peut être demandée</li>
        <li>Ce billet est personnel et non transférable</li>
      </ul>
    `;
    
    const html = generateEmailTemplate({
      title: `Votre billet - ${event.title}`,
      content
    });
    
    return await sendEmail({
      to: user.email,
      subject: `Votre billet - ${event.title}`,
      html,
      text: `Votre billet pour ${event.title} - Numéro: ${ticket.ticket_number}`
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du billet:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Envoyer un email de transfert de billet
 */
async function sendTicketTransferEmail(ticket, fromUser, toEmail, event) {
  const acceptUrl = `${process.env.FRONTEND_URL}/tickets/transfer/accept?token=${ticket.transfer_token}`;
  
  const content = `
    <p>Bonjour,</p>
    <p>${fromUser.first_name} ${fromUser.last_name} vous a transféré un billet pour l'événement <strong>${event.title}</strong>.</p>
    
    <div class="ticket-info">
      <h3>Détails du billet</h3>
      <p><strong>Événement:</strong> ${event.title}</p>
      <p><strong>Type de billet:</strong> ${ticket.ticket_type.name}</p>
      <p><strong>Date:</strong> ${new Date(event.start_date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>
      <p><strong>Lieu:</strong> ${event.venue_name}</p>
    </div>
    
    <p>Pour accepter ce transfert et recevoir votre billet, cliquez sur le bouton ci-dessous :</p>
    <p><small>Ce lien expirera dans 48 heures.</small></p>
  `;
  
  const html = generateEmailTemplate({
    title: 'Transfert de billet',
    content,
    buttonText: 'Accepter le transfert',
    buttonUrl: acceptUrl
  });
  
  return await sendEmail({
    to: toEmail,
    subject: `Transfert de billet - ${event.title}`,
    html,
    text: `${fromUser.first_name} vous a transféré un billet pour ${event.title}. Acceptez le transfert: ${acceptUrl}`
  });
}

/**
 * Envoyer un email de rappel d'événement
 */
async function sendEventReminderEmail(user, event, ticket) {
  const eventDate = new Date(event.start_date);
  const now = new Date();
  const hoursUntilEvent = Math.round((eventDate - now) / (1000 * 60 * 60));
  
  const content = `
    <p>Bonjour ${user.first_name},</p>
    <p>Nous vous rappelons que l'événement <strong>${event.title}</strong> aura lieu dans ${hoursUntilEvent} heures !</p>
    
    <div class="ticket-info">
      <h3>Détails de l'événement</h3>
      <p><strong>Date et heure:</strong> ${eventDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>
      <p><strong>Lieu:</strong> ${event.venue_name}</p>
      <p><strong>Adresse:</strong> ${event.venue_address}</p>
      <p><strong>Votre billet:</strong> ${ticket.ticket_number}</p>
    </div>
    
    <p><strong>N'oubliez pas :</strong></p>
    <ul>
      <li>D'arriver 30 minutes avant le début</li>
      <li>D'apporter votre billet (numérique ou imprimé)</li>
      <li>Une pièce d'identité peut être demandée</li>
    </ul>
  `;
  
  const html = generateEmailTemplate({
    title: `Rappel - ${event.title}`,
    content,
    buttonText: 'Voir mon billet',
    buttonUrl: `${process.env.FRONTEND_URL}/tickets/${ticket.id}`
  });
  
  return await sendEmail({
    to: user.email,
    subject: `Rappel - ${event.title} dans ${hoursUntilEvent}h`,
    html,
    text: `Rappel: ${event.title} aura lieu dans ${hoursUntilEvent} heures.`
  });
}

/**
 * Envoyer un email de notification d'annulation
 */
async function sendCancellationEmail(user, event, order, refundAmount) {
  const content = `
    <p>Bonjour ${user.first_name},</p>
    <p>Nous sommes désolés de vous informer que l'événement <strong>${event.title}</strong> a été annulé.</p>
    
    <div class="ticket-info">
      <h3>Détails de l'annulation</h3>
      <p><strong>Événement:</strong> ${event.title}</p>
      <p><strong>Date prévue:</strong> ${new Date(event.start_date).toLocaleDateString('fr-FR')}</p>
      <p><strong>Votre commande:</strong> ${order.order_number}</p>
      ${refundAmount ? `<p><strong>Montant remboursé:</strong> ${formatAmount(refundAmount, order.currency)}</p>` : ''}
    </div>
    
    ${refundAmount ? 
      '<p>Le remboursement sera traité dans les 5-10 jours ouvrables et apparaîtra sur votre relevé bancaire.</p>' :
      '<p>Nous vous contacterons prochainement concernant le remboursement.</p>'
    }
    
    <p>Nous nous excusons pour tout inconvénient causé.</p>
  `;
  
  const html = generateEmailTemplate({
    title: `Annulation - ${event.title}`,
    content
  });
  
  return await sendEmail({
    to: user.email,
    subject: `Annulation - ${event.title}`,
    html,
    text: `L'événement ${event.title} a été annulé. Commande: ${order.order_number}`
  });
}

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendTicketEmail,
  sendTicketTransferEmail,
  sendEventReminderEmail,
  sendCancellationEmail
};