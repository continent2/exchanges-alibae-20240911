/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('exchange_currency', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    currency: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    precision: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 1
    },
    fee: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'exchange_currency'
  });
};
