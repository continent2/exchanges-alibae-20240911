/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('currency', {
    id: {
      type: DataTypes.STRING(191),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    symbol: {
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
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'currency'
  });
};
