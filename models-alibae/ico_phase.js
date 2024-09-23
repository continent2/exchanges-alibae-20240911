/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ico_phase', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING','ACTIVE','COMPLETED','REJECTED','CANCELLED'),
      allowNull: false,
      defaultValue: "PENDING"
    },
    tokenId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'ico_token',
        },
        key: 'id'
      }
    },
    minPurchase: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    maxPurchase: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
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
    tableName: 'ico_phase'
  });
};
