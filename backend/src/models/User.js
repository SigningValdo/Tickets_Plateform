'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Un utilisateur peut avoir plusieurs commandes
      User.hasMany(models.Order, {
        foreignKey: 'user_id',
        as: 'orders'
      });
      
      // Un utilisateur peut avoir plusieurs tickets
      User.hasMany(models.Ticket, {
        foreignKey: 'user_id',
        as: 'tickets'
      });
      
      // Un utilisateur peut créer plusieurs événements (organisateur)
      User.hasMany(models.Event, {
        foreignKey: 'organizer_id',
        as: 'organizedEvents'
      });
    }

    // Méthode pour vérifier le mot de passe
    async validatePassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    // Méthode pour hacher le mot de passe
    async hashPassword() {
      if (this.password) {
        this.password = await bcrypt.hash(this.password, 12);
      }
    }

    // Méthode pour obtenir les données publiques de l'utilisateur
    toJSON() {
      const values = Object.assign({}, this.get());
      delete values.password;
      delete values.reset_password_token;
      delete values.reset_password_expires;
      return values;
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le prénom est requis'
        },
        len: {
          args: [2, 50],
          msg: 'Le prénom doit contenir entre 2 et 50 caractères'
        }
      }
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le nom est requis'
        },
        len: {
          args: [2, 50],
          msg: 'Le nom doit contenir entre 2 et 50 caractères'
        }
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: 'Cette adresse email est déjà utilisée'
      },
      validate: {
        isEmail: {
          msg: 'Veuillez fournir une adresse email valide'
        },
        notEmpty: {
          msg: 'L\'email est requis'
        }
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: {
          args: /^[+]?[0-9\s\-()]+$/,
          msg: 'Veuillez fournir un numéro de téléphone valide'
        }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Le mot de passe est requis'
        },
        len: {
          args: [8, 255],
          msg: 'Le mot de passe doit contenir au moins 8 caractères'
        }
      }
    },
    role: {
      type: DataTypes.ENUM('user', 'organizer', 'admin'),
      defaultValue: 'user',
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'Veuillez fournir une date de naissance valide'
        },
        isBefore: {
          args: new Date().toISOString().split('T')[0],
          msg: 'La date de naissance doit être antérieure à aujourd\'hui'
        }
      }
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    is_email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    email_verification_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email_verification_expires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    reset_password_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    reset_password_expires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    preferences: {
      type: DataTypes.JSONB,
      defaultValue: {
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        language: 'fr',
        currency: 'XOF'
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        await user.hashPassword();
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          await user.hashPassword();
        }
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['role']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['created_at']
      }
    ]
  });

  return User;
};