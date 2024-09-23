/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('one_time_token', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    tokenId: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true
    },
    tokenType: {
      type: DataTypes.ENUM('RESET'),
      allowNull: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'one_time_token'
  });
};
