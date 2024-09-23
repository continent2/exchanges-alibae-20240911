/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ai_investment', {
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
    planId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'ai_investment_plan',
        },
        key: 'id'
      }
    },
    durationId: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: {
          tableName: 'ai_investment_duration',
        },
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    profit: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    result: {
      type: DataTypes.ENUM('WIN','LOSS','DRAW'),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('ACTIVE','COMPLETED','CANCELLED','REJECTED'),
      allowNull: false,
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
    },
    symbol: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('SPOT','ECO'),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ai_investment'
  });
};
