/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('investment_plan', {
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
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    minAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    maxAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false
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
    minProfit: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    maxProfit: {
      type: DataTypes.DOUBLE,
      allowNull: false
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
    walletType: {
      type: DataTypes.STRING(191),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'investment_plan'
  });
};
