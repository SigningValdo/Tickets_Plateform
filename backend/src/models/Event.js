'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      // Un événement appartient à un organisateur (User)
      Event.belongsTo(models.User, {
        foreignKey: 'organizer_id',
        as: 'organizer'
      });
      
      // Un événement peut avoir plusieurs types de tickets
      Event.hasMany(models.TicketType, {
        foreignKey: 'event_id',
        as: 'ticketTypes'
      });
      
      // Un événement peut avoir plusieurs commandes
      Event.hasMany(models.Order, {
        foreignKey: 'event_id',
        as: 'orders'
      });
      
      // Un événement peut avoir plusieurs tickets vendus
      Event.hasMany(models.Ticket, {
        foreignKey: 'event_id',
        as: 'tickets'
      });
    }

    // Méthode pour vérifier si l'événement est actif
    isActive() {
      return this.status === 'published' && new Date() < new Date(this.end_date);
    }

    // Méthode pour vérifier si les ventes sont ouvertes
    isSaleOpen() {
      const now = new Date();
      return this.isActive() && 
             new Date(this.sale_start_date) <= now && 
             new Date(this.sale_end_date) >= now;
    }

    // Méthode pour calculer le nombre total de tickets vendus
    async getTotalTicketsSold() {
      const { Ticket } = sequelize.models;
      const count = await Ticket.count({
        where: {
          event_id: this.id,
          status: ['active', 'used']
        }
      });
      return count;
    }
  }

  Event.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le titre de l\'événement est requis'
        },
        len: {
          args: [3, 200],
          msg: 'Le titre doit contenir entre 3 et 200 caractères'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La description est requise'
        },
        len: {
          args: [10, 5000],
          msg: 'La description doit contenir entre 10 et 5000 caractères'
        }
      }
    },
    short_description: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: 'La description courte ne peut pas dépasser 500 caractères'
        }
      }
    },
    category: {
      type: DataTypes.ENUM(
        'concert', 'conference', 'workshop', 'festival', 
        'theater', 'sport', 'exhibition', 'networking', 
        'party', 'other'
      ),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La catégorie est requise'
        }
      }
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La date de début est requise'
        },
        isDate: {
          msg: 'Veuillez fournir une date de début valide'
        },
        isAfter: {
          args: new Date().toISOString(),
          msg: 'La date de début doit être dans le futur'
        }
      }
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La date de fin est requise'
        },
        isDate: {
          msg: 'Veuillez fournir une date de fin valide'
        },
        isAfterStartDate(value) {
          if (value <= this.start_date) {
            throw new Error('La date de fin doit être postérieure à la date de début');
          }
        }
      }
    },
    venue_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le nom du lieu est requis'
        },
        len: {
          args: [2, 200],
          msg: 'Le nom du lieu doit contenir entre 2 et 200 caractères'
        }
      }
    },
    venue_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'L\'adresse du lieu est requise'
        }
      }
    },
    venue_city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La ville est requise'
        }
      }
    },
    venue_country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Sénégal'
    },
    venue_coordinates: {
      type: DataTypes.JSONB,
      allowNull: true,
      validate: {
        isValidCoordinates(value) {
          if (value && (!value.lat || !value.lng)) {
            throw new Error('Les coordonnées doivent contenir lat et lng');
          }
        }
      }
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Veuillez fournir une URL d\'image valide'
        }
      }
    },
    images: {
      type: DataTypes.JSONB,
      defaultValue: [],
      allowNull: true
    },
    organizer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    max_attendees: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: 1,
          msg: 'Le nombre maximum de participants doit être au moins 1'
        }
      }
    },
    sale_start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La date de début des ventes est requise'
        },
        isDate: {
          msg: 'Veuillez fournir une date de début des ventes valide'
        }
      }
    },
    sale_end_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La date de fin des ventes est requise'
        },
        isDate: {
          msg: 'Veuillez fournir une date de fin des ventes valide'
        },
        isBeforeEventStart(value) {
          if (value > this.start_date) {
            throw new Error('La date de fin des ventes doit être antérieure au début de l\'événement');
          }
        }
      }
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'cancelled', 'completed'),
      defaultValue: 'draft',
      allowNull: false
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    tags: {
      type: DataTypes.JSONB,
      defaultValue: [],
      allowNull: true
    },
    additional_info: {
      type: DataTypes.JSONB,
      defaultValue: {},
      allowNull: true
    },
    age_restriction: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: 0,
          msg: 'La restriction d\'âge ne peut pas être négative'
        },
        max: {
          args: 99,
          msg: 'La restriction d\'âge ne peut pas dépasser 99 ans'
        }
      }
    },
    dress_code: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    contact_email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Veuillez fournir une adresse email de contact valide'
        }
      }
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    website_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Veuillez fournir une URL de site web valide'
        }
      }
    },
    social_links: {
      type: DataTypes.JSONB,
      defaultValue: {},
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    indexes: [
      {
        fields: ['organizer_id']
      },
      {
        fields: ['category']
      },
      {
        fields: ['status']
      },
      {
        fields: ['start_date']
      },
      {
        fields: ['venue_city']
      },
      {
        fields: ['is_featured']
      },
      {
        fields: ['sale_start_date', 'sale_end_date']
      }
    ]
  });

  return Event;
};