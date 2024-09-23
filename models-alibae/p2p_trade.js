/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('p2p_trade', {
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
    sellerId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'user',
        },
        key: 'id'
      }
    },
    offerId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'p2p_offer',
        },
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING','PAID','DISPUTE_OPEN','ESCROW_REVIEW','CANCELLED','COMPLETED','REFUNDED'),
      allowNull: false
    },
    messages: {
      type: 'LONGTEXT',
      allowNull: true
    },
    txHash: {
      type: DataTypes.STRING(191),
      allowNull: true
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
    tableName: 'p2p_trade'
  });
};
