/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tradepairs', {
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
      type: DataTypes.STRING(50),
      allowNull: true
    },
    base: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    quote: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    pair: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    metadata: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isenabled: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      comment: '0: disabled ,1:enabled, the rest: disabled'
    }
  }, {
    sequelize,
    tableName: 'tradepairs'
  });
};
