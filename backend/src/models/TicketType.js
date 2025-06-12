'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TicketType extends Model {
    static associate(models) {
      // Un type de ticket appartient à un événement
      TicketType.belongsTo(models.Event, {
        foreignKey: 'event_id',
        as: 'event'
      });
      
      // Un type de ticket peut avoir plusieurs tickets vendus
      TicketType.hasMany(models.Ticket, {
        foreignKey: 'ticket_type_id',
        as: 'tickets'
      });
    }

    // Méthode pour vérifier si des tickets sont encore disponibles
    async isAvailable() {
      if (!this.quantity_available) return true; // Quantité illimitée
      
      const { Ticket } = sequelize.models;
      const soldCount = await Ticket.count({
        where: {
          ticket_type_id: this.id,
          status: ['active', 'used']
        }
      });
      
      return soldCount < this.quantity_available;
    }

    // Méthode pour obtenir le nombre de tickets vendus
    async getSoldCount() {
      const { Ticket } = sequelize.models;
      return await Ticket.count({
        where: {
          ticket_type_id: this.id,
          status: ['active', 'used']
        }
      });
    }

    // Méthode pour obtenir le nombre de tickets restants
    async getRemainingCount() {
      if (!this.quantity_available) return null; // Quantité illimitée
      
      const soldCount = await this.getSoldCount();
      return Math.max(0, this.quantity_available - soldCount);
    }

    // Méthode pour vérifier si les ventes sont ouvertes pour ce type
    isSaleOpen() {
      const now = new Date();
      const saleStart = this.sale_start_date || this.event?.sale_start_date;
      const saleEnd = this.sale_end_date || this.event?.sale_end_date;
      
      return this.is_active && 
             new Date(saleStart) <= now && 
             new Date(saleEnd) >= now;
    }
  }

  TicketType.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    event_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le nom du type de ticket est requis'
        },
        len: {
          args: [2, 100],
          msg: 'Le nom doit contenir entre 2 et 100 caractères'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'La description ne peut pas dépasser 1000 caractères'
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: 0,
          msg: 'Le prix ne peut pas être négatif'
        },
        isDecimal: {
          msg: 'Le prix doit être un nombre décimal valide'
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
    quantity_available: {
      type: DataTypes.INTEGER,
      allowNull: true, // null = quantité illimitée
      validate: {
        min: {
          args: 0,
          msg: 'La quantité disponible ne peut pas être négative'
        }
      }
    },
    min_quantity_per_order: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: 'La quantité minimum par commande doit être au moins 1'
        }
      }
    },
    max_quantity_per_order: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      allowNull: true,
      validate: {
        min: {
          args: 1,
          msg: 'La quantité maximum par commande doit être au moins 1'
        },
        isGreaterThanMin(value) {
          if (value && value < this.min_quantity_per_order) {
            throw new Error('La quantité maximum doit être supérieure ou égale à la quantité minimum');
          }
        }
      }
    },
    sale_start_date: {
      type: DataTypes.DATE,
      allowNull: true, // Si null, utilise la date de l'événement
      validate: {
        isDate: {
          msg: 'Veuillez fournir une date de début des ventes valide'
        }
      }
    },
    sale_end_date: {
      type: DataTypes.DATE,
      allowNull: true, // Si null, utilise la date de l'événement
      validate: {
        isDate: {
          msg: 'Veuillez fournir une date de fin des ventes valide'
        },
        isAfterSaleStart(value) {
          if (value && this.sale_start_date && value <= this.sale_start_date) {
            throw new Error('La date de fin des ventes doit être postérieure à la date de début');
          }
        }
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    benefits: {
      type: DataTypes.JSONB,
      defaultValue: [],
      allowNull: true,
      comment: 'Liste des avantages inclus avec ce type de ticket'
    },
    restrictions: {
      type: DataTypes.JSONB,
      defaultValue: [],
      allowNull: true,
      comment: 'Liste des restrictions pour ce type de ticket'
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: true,
      validate: {
        is: {
          args: /^#[0-9A-F]{6}$/i,
          msg: 'La couleur doit être un code hexadécimal valide (ex: #FF0000)'
        }
      }
    },
    is_transferable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: 'Indique si ce type de ticket peut être transféré'
    },
    is_refundable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'Indique si ce type de ticket peut être remboursé'
    },
    refund_deadline: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date limite pour demander un remboursement'
    },
    early_bird_discount: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: {
          args: 0,
          msg: 'La remise early bird ne peut pas être négative'
        },
        max: {
          args: 100,
          msg: 'La remise early bird ne peut pas dépasser 100%'
        }
      },
      comment: 'Pourcentage de remise pour les achats anticipés'
    },
    early_bird_deadline: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date limite pour bénéficier de la remise early bird'
    }
  }, {
    sequelize,
    modelName: 'TicketType',
    tableName: 'ticket_types',
    indexes: [
      {
        fields: ['event_id']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['sort_order']
      },
      {
        fields: ['sale_start_date', 'sale_end_date']
      },
      {
        fields: ['price']
      }
    ]
  });

  return TicketType;
};