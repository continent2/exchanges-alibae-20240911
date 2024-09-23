/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ecosystem_utxo', {
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
    transactionId: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    index: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    script: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0
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
    tableName: 'ecosystem_utxo'
  });
};
