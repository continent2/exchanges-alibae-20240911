/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kyc_template', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true
    },
    options: {
      type: 'LONGTEXT',
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 0
    },
    customOptions: {
      type: 'LONGTEXT',
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'kyc_template'
  });
};
