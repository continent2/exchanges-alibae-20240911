/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('settings', {
    key: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    value: {
      type: 'LONGTEXT',
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'settings'
  });
};
