/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ai_investment_plan', {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 1
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
    minAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    maxAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    trending: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 0
    },
    defaultProfit: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    defaultResult: {
      type: DataTypes.ENUM('WIN','LOSS','DRAW'),
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
    tableName: 'ai_investment_plan'
  });
};
