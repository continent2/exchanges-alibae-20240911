/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('wallet', {
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
    type: {
      type: DataTypes.ENUM('FIAT','SPOT','ECO','FUTURES'),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    balance: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    inOrder: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0
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
    },
    address: {
      type: 'LONGTEXT',
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'wallet'
  });
};
