/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('staking_duration', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    poolId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'staking_pool',
        },
        key: 'id'
      }
    },
    duration: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    interestRate: {
      type: DataTypes.DOUBLE,
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
    }
  }, {
    sequelize,
    tableName: 'staking_duration'
  });
};
