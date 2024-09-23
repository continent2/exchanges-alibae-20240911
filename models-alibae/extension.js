/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('extension', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    productId: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    link: {
      type: DataTypes.STRING(191),
      allowNull: true
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
    image: {
      type: DataTypes.STRING(1000),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'extension'
  });
};
