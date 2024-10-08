/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tradevolumes', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('current_timestamp')
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: true
    },
    symbol: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    price: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    volumeinquote: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    volumeinbase: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    refex: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'default null=>binance, designate in this field if any other'
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    symbolref: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tradevolumes'
  });
};
