/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ecommerce_order_item', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'ecommerce_order',
        },
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'ecommerce_product',
        },
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    key: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    filePath: {
      type: DataTypes.STRING(191),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ecommerce_order_item'
  });
};
