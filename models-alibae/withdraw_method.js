/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('withdraw_method', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    processingTime: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    fixedFee: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    percentageFee: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    minAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    maxAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    customFields: {
      type: 'LONGTEXT',
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 1
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
    tableName: 'withdraw_method'
  });
};
