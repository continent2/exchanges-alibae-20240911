/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ico_token', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    projectId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'ico_project',
        },
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    chain: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    purchaseCurrency: {
      type: DataTypes.STRING(191),
      allowNull: false,
      defaultValue: "ETH"
    },
    purchaseWalletType: {
      type: DataTypes.ENUM('FIAT','SPOT','ECO'),
      allowNull: false,
      defaultValue: "SPOT"
    },
    address: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    totalSupply: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    description: {
      type: 'LONGTEXT',
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING','ACTIVE','COMPLETED','REJECTED','CANCELLED'),
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
    tableName: 'ico_token'
  });
};
