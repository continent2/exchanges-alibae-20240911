/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('faq_category', {
    id: {
      type: DataTypes.STRING(191),
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'faq_category'
  });
};
