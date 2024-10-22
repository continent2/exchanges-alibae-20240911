/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('holdings', {
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
    username: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    asset: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    amountchar: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    amountint: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    amountfloat: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    lockedchar: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    lockedint: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    lockedfloat: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    availchar: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    availint: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    availfloat: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    uid: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    useruuid: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nettype: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    cryptoaccountsid: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: 1
    },
    decimals: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    assetnetype: {
      type: DataTypes.STRING(40),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'holdings'
  });
};
