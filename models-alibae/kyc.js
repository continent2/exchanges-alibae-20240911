/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kyc', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'user',
        },
        key: 'id'
      },
      unique: true
    },
    templateId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'kyc_template',
        },
        key: 'id'
      }
    },
    data: {
      type: 'LONGTEXT',
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('PENDING','APPROVED','REJECTED'),
      allowNull: false,
      defaultValue: "PENDING"
    },
    level: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    notes: {
      type: DataTypes.TEXT,
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
    tableName: 'kyc'
  });
};
