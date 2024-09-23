/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('exchange_watchlist', {
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
    }
  }, {
    sequelize,
    tableName: 'exchange_watchlist'
  });
};
