/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ecommerce_order', {
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
      }
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
    },
    shippingId: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: {
          tableName: 'ecommerce_shipping',
        },
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: {
          tableName: 'ecommerce_product',
        },
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'ecommerce_order'
  });
};
