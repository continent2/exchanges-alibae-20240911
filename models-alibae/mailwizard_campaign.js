/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mailwizard_campaign', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    templateId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'mailwizard_template',
        },
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING','PAUSED','ACTIVE','STOPPED','COMPLETED','CANCELLED'),
      allowNull: false,
      defaultValue: "PENDING"
    },
    speed: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 1
    },
    targets: {
      type: 'LONGTEXT',
      allowNull: true
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
    tableName: 'mailwizard_campaign'
  });
};
