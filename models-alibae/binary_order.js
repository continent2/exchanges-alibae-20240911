/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('binary_order', {
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
    symbol: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    profit: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    side: {
      type: DataTypes.ENUM('RISE','FALL'),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('RISE_FALL'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING','WIN','LOSS','DRAW','CANCELED'),
      allowNull: false
    },
    isDemo: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0
    },
    closedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    closePrice: {
      type: DataTypes.DOUBLE,
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
    tableName: 'binary_order'
  });
};
