/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('forex_account', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: {
          tableName: 'user',
        },
        key: 'id'
      }
    },
    accountId: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    broker: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    mt: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    balance: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0
    },
    leverage: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 1
    },
    type: {
      type: DataTypes.ENUM('DEMO','LIVE'),
      allowNull: false,
      defaultValue: "DEMO"
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 1
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
    tableName: 'forex_account'
  });
};
