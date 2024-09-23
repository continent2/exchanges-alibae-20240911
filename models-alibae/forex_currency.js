/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('forex_currency', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    currency: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 1
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
    tableName: 'forex_currency'
  });
};
