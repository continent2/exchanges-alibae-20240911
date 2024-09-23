/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('role_permission', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    roleId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: {
          tableName: 'role',
        },
        key: 'id'
      }
    },
    permissionId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: {
          tableName: 'permission',
        },
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'role_permission'
  });
};
