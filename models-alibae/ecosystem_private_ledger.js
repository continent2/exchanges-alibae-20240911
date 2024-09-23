/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ecosystem_private_ledger', {
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
    index: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    chain: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    network: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "mainnet"
    },
    offchainDifference: {
      type: DataTypes.DOUBLE,
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
    tableName: 'ecosystem_private_ledger'
  });
};
