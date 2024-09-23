/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('provider_user', {
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
    providerUserId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    provider: {
      type: DataTypes.ENUM('GOOGLE','WALLET'),
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
    tableName: 'provider_user'
  });
};
