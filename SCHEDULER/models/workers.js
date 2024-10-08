/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('workers', {
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
    name: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    uuid: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: sequelize.fn('uuid')
    },
    lastpingtimestamp: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    lastpingtimestr: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    lastacttimestamp: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'workers'
  });
};
