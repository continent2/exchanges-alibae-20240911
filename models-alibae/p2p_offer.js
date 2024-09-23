/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('p2p_offer', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'user',
        },
        key: 'id'
      }
    },
    paymentMethodId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'p2p_payment_method',
        },
        key: 'id'
      }
    },
    walletType: {
      type: DataTypes.ENUM('FIAT','SPOT','ECO'),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    chain: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    minAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    maxAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    inOrder: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING','ACTIVE','COMPLETED','CANCELLED'),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'p2p_offer'
  });
};
