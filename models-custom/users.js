/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
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
      allowNull: true,
      unique: true
    },
    isstaked: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: 0
    },
    txhash: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: 1
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pw: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    referer: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    myreferercode: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    profileimageurl: {
      type: DataTypes.STRING(800),
      allowNull: true
    },
    emailauth: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 0
    },
    address: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    stakeamount: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    uuid: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cumulcounttxs: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ipaddress: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    phonenumber: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    nation: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    lastordertime: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    nettype: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    istest: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    phonecountrycode2letter: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    phonelocalnumber: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    pwhash: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users'
  });
};
