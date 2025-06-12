'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Une commande appartient à un utilisateur
      Order.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      
      // Une commande appartient à un événement
      Order.belongsTo(models.Event, {
        foreignKey: 'event_id',
        as: 'event'
      });
      
      // Une commande peut avoir plusieurs tickets
      Order.hasMany(models.Ticket, {
        foreignKey: 'order_id',
        as: 'tickets'
      });
      
      // Une commande peut avoir plusieurs paiements
      Order.hasMany(models.Payment, {
        foreignKey: 'order_id',
        as: 'payments'
      });
    }

    // Méthode pour calculer le total de la commande
    calculateTotal() {
      let total = 0;
      if (this.items && Array.isArray(this.items)) {
        this.items.forEach(item => {
          total += parseFloat(item.price) * parseInt(item.quantity);
        });
      }
      return total;
    }

    // Méthode pour vérifier si la commande est expirée
    isExpired() {
      if (!this.expires_at) return false;
      return new Date() > new Date(this.expires_at);
    }

    // Méthode pour vérifier si la commande peut être annulée
    canBeCancelled() {
      return ['pending', 'reserved'].includes(this.status) && !this.isExpired();
    }

    // Méthode pour vérifier si la commande peut être remboursée
    canBeRefunded() {
      return this.status === 'completed' && this.refund_deadline && 
             new Date() <= new Date(this.refund_deadline);
    }

    // Méthode pour générer un numéro de commande unique
    static generateOrderNumber() {
      const timestamp = Date.now().toString();
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      return `ORD-${timestamp.slice(-8)}-${random}`;
    }
  }

  Order.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    order_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Le numéro de commande est requis'
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
    status: {
      type: DataTypes.ENUM(
        'pending',     // En attente de paiement
        'reserved',    // Réservé temporairement
        'processing',  // En cours de traitement
        'completed',   // Complétée et payée
        'cancelled',   // Annulée
        'refunded',    // Remboursée
        'expired'      // Expirée
      ),
      defaultValue: 'pending',
      allowNull: false
    },
    items: {
      type: DataTypes.JSONB,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Les articles de la commande sont requis'
        },
        isValidItems(value) {
          if (!Array.isArray(value) || value.length === 0) {
            throw new Error('Les articles doivent être un tableau non vide');
          }
          
          value.forEach((item, index) => {
            if (!item.ticket_type_id || !item.quantity || !item.price) {
              throw new Error(`Article ${index + 1}: ticket_type_id, quantity et price sont requis`);
            }
            if (parseInt(item.quantity) <= 0) {
              throw new Error(`Article ${index + 1}: la quantité doit être positive`);
            }
            if (parseFloat(item.price) < 0) {
              throw new Error(`Article ${index + 1}: le prix ne peut pas être négatif`);
            }
          });
        }
      },
      comment: 'Tableau des articles: [{ticket_type_id, quantity, price, name}]'
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: 0,
          msg: 'Le sous-total ne peut pas être négatif'
        }
      }
    },
    tax_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: {
          args: 0,
          msg: 'Le montant des taxes ne peut pas être négatif'
        }
      }
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: {
          args: 0,
          msg: 'Le montant de la remise ne peut pas être négatif'
        }
      }
    },
    service_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: {
          args: 0,
          msg: 'Les frais de service ne peuvent pas être négatifs'
        }
      }
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: 0,
          msg: 'Le montant total ne peut pas être négatif'
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
    payment_method: {
      type: DataTypes.ENUM(
        'orange_money', 'mtn_money', 'wave', 
        'credit_card', 'bank_transfer', 'cash'
      ),
      allowNull: true
    },
    payment_status: {
      type: DataTypes.ENUM(
        'pending',     // En attente
        'processing',  // En cours
        'completed',   // Complété
        'failed',      // Échoué
        'cancelled',   // Annulé
        'refunded'     // Remboursé
      ),
      defaultValue: 'pending',
      allowNull: false
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date d\'expiration de la réservation'
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date de finalisation de la commande'
    },
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date d\'annulation de la commande'
    },
    refunded_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date de remboursement'
    },
    refund_deadline: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date limite pour demander un remboursement'
    },
    customer_info: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Informations supplémentaires du client pour cette commande'
    },
    billing_address: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Adresse de facturation'
    },
    discount_code: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Code de réduction appliqué'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Notes internes sur la commande'
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      allowNull: true,
      comment: 'Métadonnées supplémentaires'
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    hooks: {
      beforeCreate: (order) => {
        if (!order.order_number) {
          order.order_number = Order.generateOrderNumber();
        }
        
        // Calculer le total si pas défini
        if (!order.total_amount) {
          order.total_amount = order.subtotal + order.tax_amount + order.service_fee - order.discount_amount;
        }
      },
      beforeUpdate: (order) => {
        // Recalculer le total si les composants ont changé
        if (order.changed('subtotal') || order.changed('tax_amount') || 
            order.changed('service_fee') || order.changed('discount_amount')) {
          order.total_amount = order.subtotal + order.tax_amount + order.service_fee - order.discount_amount;
        }
        
        // Mettre à jour les timestamps selon le statut
        if (order.changed('status')) {
          const now = new Date();
          switch (order.status) {
            case 'completed':
              if (!order.completed_at) order.completed_at = now;
              break;
            case 'cancelled':
              if (!order.cancelled_at) order.cancelled_at = now;
              break;
            case 'refunded':
              if (!order.refunded_at) order.refunded_at = now;
              break;
          }
        }
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['order_number']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['event_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['payment_status']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['expires_at']
      },
      {
        fields: ['completed_at']
      }
    ]
  });

  return Order;
};