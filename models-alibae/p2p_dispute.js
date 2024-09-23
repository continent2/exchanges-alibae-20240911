/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('p2p_dispute', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    tradeId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'p2p_trade',
        },
        key: 'id'
      }
    },
    raisedById: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'user',
        },
        key: 'id'
      }
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING','OPEN','RESOLVED','CANCELLED'),
      allowNull: false
    },
    resolution: {
      type: DataTypes.TEXT,
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
    tableName: 'p2p_dispute'
  });
};
