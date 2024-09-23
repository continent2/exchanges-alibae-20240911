/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ai_investment_plan_duration', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
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
      allowNull: false,
      references: {
        model: {
          tableName: 'ai_investment_duration',
        },
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'ai_investment_plan_duration'
  });
};
