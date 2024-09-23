/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('post_tag', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    postId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'post',
        },
        key: 'id'
      }
    },
    tagId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'tag',
        },
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'post_tag'
  });
};
