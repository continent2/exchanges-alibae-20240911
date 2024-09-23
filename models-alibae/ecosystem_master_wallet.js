/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ecosystem_master_wallet', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    chain: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    balance: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 1
    },
    lastIndex: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'ecosystem_master_wallet'
  });
};
