/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('p2p_commission', {
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
      },
      unique: true
    },
    amount: {
      type: DataTypes.DOUBLE,
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
    tableName: 'p2p_commission'
  });
};
