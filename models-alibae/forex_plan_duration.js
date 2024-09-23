/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('forex_plan_duration', {
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
          tableName: 'forex_plan',
        },
        key: 'id'
      }
    },
    durationId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'forex_duration',
        },
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'forex_plan_duration'
  });
};
