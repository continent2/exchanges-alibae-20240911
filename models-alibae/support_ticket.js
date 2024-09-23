/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('support_ticket', {
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
      }
    },
    subject: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    importance: {
      type: DataTypes.ENUM('LOW','MEDIUM','HIGH'),
      allowNull: false,
      defaultValue: "LOW"
    },
    status: {
      type: DataTypes.ENUM('PENDING','OPEN','REPLIED','CLOSED'),
      allowNull: false,
      defaultValue: "PENDING"
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
    },
    agentId: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: {
          tableName: 'user',
        },
        key: 'id'
      }
    },
    messages: {
      type: 'LONGTEXT',
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'support_ticket'
  });
};
