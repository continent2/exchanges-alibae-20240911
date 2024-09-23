/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ecommerce_product', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('DOWNLOADABLE','PHYSICAL'),
      allowNull: false
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'ecommerce_category',
        },
        key: 'id'
      }
    },
    inventoryQuantity: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 1
    },
    image: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(191),
      allowNull: false,
      defaultValue: "USD"
    },
    walletType: {
      type: DataTypes.ENUM('FIAT','SPOT','ECO'),
      allowNull: false,
      defaultValue: "SPOT"
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
    tableName: 'ecommerce_product'
  });
};
