/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('exchange_order', {
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
    referenceId: {
      type: DataTypes.STRING(191),
      allowNull: true,
      unique: true
    },
    status: {
      type: DataTypes.ENUM('OPEN','CLOSED','CANCELED','EXPIRED','REJECTED'),
      allowNull: false
    },
    symbol: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('MARKET','LIMIT'),
      allowNull: false
    },
    timeInForce: {
      type: DataTypes.ENUM('GTC','IOC','FOK','PO'),
      allowNull: false
    },
    side: {
      type: DataTypes.ENUM('BUY','SELL'),
      allowNull: false
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    average: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    filled: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    remaining: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    cost: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    trades: {
      type: 'LONGTEXT',
      allowNull: true
    },
    fee: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    feeCurrency: {
      type: DataTypes.STRING(191),
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
    tableName: 'exchange_order'
  });
};
