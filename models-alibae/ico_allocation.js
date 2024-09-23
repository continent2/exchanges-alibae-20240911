/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ico_allocation', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    percentage: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    tokenId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'ico_token',
        },
        key: 'id'
      },
      unique: true
    },
    status: {
      type: DataTypes.ENUM('PENDING','COMPLETED','CANCELLED','REJECTED'),
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
    tableName: 'ico_allocation'
  });
};
