'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      // Un paiement appartient à une commande
      Payment.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order'
      });
      
      // Un paiement appartient à un utilisateur
      Payment.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }

    // Méthode pour vérifier si le paiement est réussi
    isSuccessful() {
      return this.status === 'completed';
    }

    // Méthode pour vérifier si le paiement peut être remboursé
    canBeRefunded() {
      return this.status === 'completed' && !this.refunded_at;
    }

    // Méthode pour marquer comme remboursé
    async markAsRefunded(refundAmount, refundReason) {
      if (!this.canBeRefunded()) {
        throw new Error('Ce paiement ne peut pas être remboursé');
      }
      
      this.status = 'refunded';
      this.refunded_at = new Date();
      this.refund_amount = refundAmount || this.amount;
      this.refund_reason = refundReason;
      
      await this.save();
      return true;
    }

    // Méthode pour générer un ID de transaction unique
    static generateTransactionId() {
      const timestamp = Date.now().toString();
      const random = Math.random().toString(36).substring(2, 10).toUpperCase();
      return `TXN-${timestamp.slice(-10)}-${random}`;
    }
  }

  Payment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    transaction_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'L\'ID de transaction est requis'
        }
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
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    payment_method: {
      type: DataTypes.ENUM(
        'orange_money',
        'mtn_money', 
        'wave',
        'credit_card',
        'debit_card',
        'bank_transfer',
        'paypal',
        'stripe',
        'cash',
        'other'
      ),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La méthode de paiement est requise'
        }
      }
    },
    payment_provider: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Fournisseur de paiement (Orange, MTN, Wave, Stripe, etc.)'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: 0,
          msg: 'Le montant ne peut pas être négatif'
        },
        isDecimal: {
          msg: 'Le montant doit être un nombre décimal valide'
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
    status: {
      type: DataTypes.ENUM(
        'pending',     // En attente
        'processing',  // En cours de traitement
        'completed',   // Complété avec succès
        'failed',      // Échoué
        'cancelled',   // Annulé
        'expired',     // Expiré
        'refunded',    // Remboursé
        'partially_refunded' // Partiellement remboursé
      ),
      defaultValue: 'pending',
      allowNull: false
    },
    gateway_transaction_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'ID de transaction du fournisseur de paiement'
    },
    gateway_response: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Réponse complète du fournisseur de paiement'
    },
    payment_details: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Détails spécifiques au mode de paiement (numéro de téléphone, etc.)'
    },
    fees: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: {
          args: 0,
          msg: 'Les frais ne peuvent pas être négatifs'
        }
      },
      comment: 'Frais de transaction'
    },
    net_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Montant net après déduction des frais'
    },
    processed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date et heure de traitement du paiement'
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date et heure de finalisation du paiement'
    },
    failed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date et heure d\'échec du paiement'
    },
    refunded_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date et heure de remboursement'
    },
    refund_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: {
          args: 0,
          msg: 'Le montant de remboursement ne peut pas être négatif'
        }
      },
      comment: 'Montant remboursé'
    },
    refund_reason: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Raison du remboursement'
    },
    refund_transaction_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'ID de transaction de remboursement'
    },
    failure_reason: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Raison de l\'échec du paiement'
    },
    retry_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: {
          args: 0,
          msg: 'Le nombre de tentatives ne peut pas être négatif'
        }
      },
      comment: 'Nombre de tentatives de paiement'
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date d\'expiration du paiement'
    },
    webhook_received: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'Indique si le webhook de confirmation a été reçu'
    },
    webhook_data: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Données du webhook reçu'
    },
    ip_address: {
      type: DataTypes.INET,
      allowNull: true,
      comment: 'Adresse IP de l\'utilisateur lors du paiement'
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'User agent du navigateur'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Notes internes sur le paiement'
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      allowNull: true,
      comment: 'Métadonnées supplémentaires'
    }
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments',
    hooks: {
      beforeCreate: (payment) => {
        if (!payment.transaction_id) {
          payment.transaction_id = Payment.generateTransactionId();
        }
        
        // Calculer le montant net
        if (payment.amount && payment.fees) {
          payment.net_amount = payment.amount - payment.fees;
        }
      },
      beforeUpdate: (payment) => {
        // Mettre à jour les timestamps selon le statut
        if (payment.changed('status')) {
          const now = new Date();
          switch (payment.status) {
            case 'processing':
              if (!payment.processed_at) payment.processed_at = now;
              break;
            case 'completed':
              if (!payment.completed_at) payment.completed_at = now;
              break;
            case 'failed':
              if (!payment.failed_at) payment.failed_at = now;
              break;
            case 'refunded':
              if (!payment.refunded_at) payment.refunded_at = now;
              break;
          }
        }
        
        // Recalculer le montant net si nécessaire
        if (payment.changed('amount') || payment.changed('fees')) {
          payment.net_amount = payment.amount - (payment.fees || 0);
        }
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['transaction_id']
      },
      {
        fields: ['order_id']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['payment_method']
      },
      {
        fields: ['gateway_transaction_id']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['completed_at']
      },
      {
        fields: ['amount']
      }
    ]
  });

  return Payment;
};