/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('author', {
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
      },
      unique: true
    },
    status: {
      type: DataTypes.ENUM('PENDING','APPROVED','REJECTED'),
      allowNull: false,
      defaultValue: "PENDING"
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'author'
  });
};
