/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('forex_account_signal', {
    forexAccountId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: {
          tableName: 'forex_account',
        },
        key: 'id'
      }
    },
    forexSignalId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: {
          tableName: 'forex_signal',
        },
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'forex_account_signal'
  });
};
