/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('frontend', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    section: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'frontend'
  });
};
