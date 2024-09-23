/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('wallet_data', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
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
    currency: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    chain: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    balance: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    index: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'wallet_data'
  });
};
