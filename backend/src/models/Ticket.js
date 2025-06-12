'use strict';
const { Model } = require('sequelize');
const QRCode = require('qrcode');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    static associate(models) {
      // Un ticket appartient à un utilisateur
      Ticket.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      
      // Un ticket appartient à un événement
      Ticket.belongsTo(models.Event, {
        foreignKey: 'event_id',
        as: 'event'
      });
      
      // Un ticket appartient à un type de ticket
      Ticket.belongsTo(models.TicketType, {
        foreignKey: 'ticket_type_id',
        as: 'ticketType'
      });
      
      // Un ticket appartient à une commande
      Ticket.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order'
      });
    }

    // Méthode pour générer un code QR
    async generateQRCode() {
      try {
        const qrData = {
          ticketId: this.id,
          ticketNumber: this.ticket_number,
          eventId: this.event_id,
          userId: this.user_id,
          validationCode: this.validation_code
        };
        
        const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
          errorCorrectionLevel: 'M',
          type: 'image/png',
          quality: 0.92,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          width: parseInt(process.env.QR_CODE_SIZE) || 200
        });
        
        this.qr_code = qrCodeDataURL;
        await this.save();
        
        return qrCodeDataURL;
      } catch (error) {
        console.error('Erreur lors de la génération du QR code:', error);
        throw error;
      }
    }

    // Méthode pour valider le ticket
    async validateTicket(validationCode) {
      if (this.status !== 'active') {
        throw new Error('Ce ticket n\'est pas actif');
      }
      
      if (this.validation_code !== validationCode) {
        throw new Error('Code de validation incorrect');
      }
      
      if (this.used_at) {
        throw new Error('Ce ticket a déjà été utilisé');
      }
      
      // Vérifier si l'événement a commencé
      const event = await this.getEvent();
      if (new Date() < new Date(event.start_date)) {
        throw new Error('L\'événement n\'a pas encore commencé');
      }
      
      // Marquer le ticket comme utilisé
      this.status = 'used';
      this.used_at = new Date();
      await this.save();
      
      return true;
    }

    // Méthode pour transférer le ticket
    async transferTo(newUserId, transferredBy) {
      if (this.status !== 'active') {
        throw new Error('Seuls les tickets actifs peuvent être transférés');
      }
      
      if (!this.is_transferable) {
        throw new Error('Ce ticket n\'est pas transférable');
      }
      
      const oldUserId = this.user_id;
      this.user_id = newUserId;
      this.transfer_history = this.transfer_history || [];
      this.transfer_history.push({
        from_user_id: oldUserId,
        to_user_id: newUserId,
        transferred_by: transferredBy,
        transferred_at: new Date()
      });
      
      await this.save();
      return true;
    }

    // Méthode pour générer un numéro de ticket unique
    static generateTicketNumber() {
      const timestamp = Date.now().toString();
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      return `TKT-${timestamp.slice(-8)}-${random}`;
    }

    // Méthode pour générer un code de validation
    static generateValidationCode() {
      return crypto.randomBytes(16).toString('hex').toUpperCase();
    }
  }

  Ticket.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    ticket_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Le numéro de ticket est requis'
        }
      }
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    event_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id'
      }
    },
    ticket_type_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ticket_types',
        key: 'id'
      }
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM(
        'active',      // Actif et utilisable
        'used',        // Utilisé lors de l'événement
        'cancelled',   // Annulé
        'refunded',    // Remboursé
        'transferred', // Transféré (ancien statut)
        'expired'      // Expiré
      ),
      defaultValue: 'active',
      allowNull: false
    },
    price_paid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: 0,
          msg: 'Le prix payé ne peut pas être négatif'
        }
      }
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'XOF',
      allowNull: false,
      validate: {
        len: {
          args: [3, 3],
          msg: 'La devise doit être un code à 3 lettres'
        }
      }
    },
    validation_code: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
      comment: 'Code unique pour valider le ticket à l\'entrée'
    },
    qr_code: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'QR code en base64 pour la validation'
    },
    seat_info: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Informations sur le siège (section, rangée, numéro)'
    },
    attendee_info: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Informations sur le participant (nom, email, etc.)'
    },
    used_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date et heure d\'utilisation du ticket'
    },
    validated_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'ID de l\'utilisateur qui a validé le ticket'
    },
    is_transferable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: 'Indique si le ticket peut être transféré'
    },
    transfer_history: {
      type: DataTypes.JSONB,
      defaultValue: [],
      allowNull: true,
      comment: 'Historique des transferts du ticket'
    },
    special_requirements: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Exigences spéciales (régime alimentaire, accessibilité, etc.)'
    },
    check_in_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Heure d\'arrivée à l\'événement'
    },
    check_out_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Heure de départ de l\'événement'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Notes supplémentaires sur le ticket'
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      allowNull: true,
      comment: 'Métadonnées supplémentaires'
    }
  }, {
    sequelize,
    modelName: 'Ticket',
    tableName: 'tickets',
    hooks: {
      beforeCreate: (ticket) => {
        if (!ticket.ticket_number) {
          ticket.ticket_number = Ticket.generateTicketNumber();
        }
        if (!ticket.validation_code) {
          ticket.validation_code = Ticket.generateValidationCode();
        }
      },
      afterCreate: async (ticket) => {
        // Générer le QR code après création
        try {
          await ticket.generateQRCode();
        } catch (error) {
          console.error('Erreur lors de la génération du QR code:', error);
        }
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['ticket_number']
      },
      {
        unique: true,
        fields: ['validation_code']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['event_id']
      },
      {
        fields: ['ticket_type_id']
      },
      {
        fields: ['order_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['used_at']
      }
    ]
  });

  return Ticket;
};