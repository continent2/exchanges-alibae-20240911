/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('exchange', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 0
    },
    username: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    licenseStatus: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 0
    },
    version: {
      type: DataTypes.STRING(191),
      allowNull: true,
      defaultValue: "0.0.1"
    },
    productId: {
      type: DataTypes.STRING(191),
      allowNull: true,
      unique: true
    },
    type: {
      type: DataTypes.STRING(191),
      allowNull: true,
      defaultValue: "spot"
    }
  }, {
    sequelize,
    tableName: 'exchange'
  });
};
