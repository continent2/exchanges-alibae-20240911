/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('forex_signal', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(191),
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
    tableName: 'forex_signal'
  });
};
