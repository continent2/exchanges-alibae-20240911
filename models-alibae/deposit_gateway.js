/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('deposit_gateway', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    alias: {
      type: DataTypes.STRING(191),
      allowNull: true,
      unique: true
    },
    currencies: {
      type: 'LONGTEXT',
      allowNull: true
    },
    fixedFee: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0
    },
    percentageFee: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0
    },
    minAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0
    },
    maxAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('FIAT','CRYPTO'),
      allowNull: false,
      defaultValue: "FIAT"
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 1
    },
    version: {
      type: DataTypes.STRING(191),
      allowNull: true,
      defaultValue: "0.0.1"
    },
    productId: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      unique: true
    }
  }, {
    sequelize,
    tableName: 'deposit_gateway'
  });
};
