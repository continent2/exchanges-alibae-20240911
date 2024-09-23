/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ecommerce_shipping', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    loadId: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    loadStatus: {
      type: DataTypes.ENUM('PENDING','TRANSIT','DELIVERED','CANCELLED'),
      allowNull: false
    },
    shipper: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    transporter: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    goodsType: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    volume: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    vehicle: {
      type: DataTypes.STRING(255),
      allowNull: false
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
    cost: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    tax: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    deliveryDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ecommerce_shipping'
  });
};
