/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mailwizard_template', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    content: {
      type: 'LONGTEXT',
      allowNull: false
    },
    design: {
      type: 'LONGTEXT',
      allowNull: false
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
    tableName: 'mailwizard_template'
  });
};
