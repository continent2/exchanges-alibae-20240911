/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sessionkeys', {
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
      type: DataTypes.STRING(200),
      allowNull: true
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ipaddress: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    useragent: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: 1
    },
    lastactive: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    useruuid: {
      type: DataTypes.STRING(80),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sessionkeys'
  });
};
