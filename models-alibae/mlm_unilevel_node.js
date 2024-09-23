/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mlm_unilevel_node', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    referralId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'mlm_referral',
        },
        key: 'id'
      },
      unique: true
    },
    parentId: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: {
          tableName: 'mlm_unilevel_node',
        },
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'mlm_unilevel_node'
  });
};
