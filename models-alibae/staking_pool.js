/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('staking_pool', {
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
      type: DataTypes.TEXT,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    chain: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('FIAT','SPOT','ECO'),
      allowNull: false,
      defaultValue: "SPOT"
    },
    minStake: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    maxStake: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ACTIVE','INACTIVE','COMPLETED'),
      allowNull: false,
      defaultValue: "ACTIVE"
    },
    icon: {
      type: DataTypes.STRING(1000),
      allowNull: true
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
    tableName: 'staking_pool'
  });
};
