/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    emailVerified: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    roleId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: {
          tableName: 'role',
        },
        key: 'id'
      }
    },
    profile: {
      type: 'LONGTEXT',
      allowNull: true
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastFailedLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    failedLoginAttempts: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('ACTIVE','INACTIVE','SUSPENDED','BANNED'),
      allowNull: true,
      defaultValue: "ACTIVE"
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
    tableName: 'user'
  });
};
