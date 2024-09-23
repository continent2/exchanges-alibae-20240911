/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaction', {
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
    walletId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'wallet',
        },
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('FAILED','DEPOSIT','WITHDRAW','OUTGOING_TRANSFER','INCOMING_TRANSFER','PAYMENT','REFUND','BINARY_ORDER','EXCHANGE_ORDER','INVESTMENT','INVESTMENT_ROI','AI_INVESTMENT','AI_INVESTMENT_ROI','INVOICE','FOREX_DEPOSIT','FOREX_WITHDRAW','FOREX_INVESTMENT','FOREX_INVESTMENT_ROI','ICO_CONTRIBUTION','REFERRAL_REWARD','STAKING','STAKING_REWARD','P2P_OFFER_TRANSFER','P2P_TRADE'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING','COMPLETED','FAILED','CANCELLED','EXPIRED','REJECTED','REFUNDED','TIMEOUT'),
      allowNull: false,
      defaultValue: "PENDING"
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    fee: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    referenceId: {
      type: DataTypes.STRING(191),
      allowNull: true,
      unique: true
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
    tableName: 'transaction'
  });
};
