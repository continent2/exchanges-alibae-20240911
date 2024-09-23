/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('exchange_market', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    pair: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    isTrending: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 0
    },
    isHot: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 0
    },
    metadata: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 1
    },
    currency: {
      type: DataTypes.STRING(191),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'exchange_market'
  });
};
