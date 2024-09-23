/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notification_template', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true
    },
    subject: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    emailBody: {
      type: 'LONGTEXT',
      allowNull: true
    },
    smsBody: {
      type: 'LONGTEXT',
      allowNull: true
    },
    pushBody: {
      type: 'LONGTEXT',
      allowNull: true
    },
    shortCodes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 0
    },
    sms: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 0
    },
    push: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'notification_template'
  });
};
