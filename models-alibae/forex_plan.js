/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('forex_plan', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    minProfit: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    maxProfit: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    minAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0
    },
    maxAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    invested: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    profitPercentage: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 0
    },
    defaultProfit: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    defaultResult: {
      type: DataTypes.ENUM('WIN','LOSS','DRAW'),
      allowNull: false
    },
    trending: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 0
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
    currency: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    walletType: {
      type: DataTypes.STRING(191),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'forex_plan'
  });
};
