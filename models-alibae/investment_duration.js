/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('investment_duration', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    duration: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    timeframe: {
      type: DataTypes.ENUM('HOUR','DAY','WEEK','MONTH'),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'investment_duration'
  });
};
