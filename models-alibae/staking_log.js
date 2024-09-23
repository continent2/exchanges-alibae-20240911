/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('staking_log', {
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
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ACTIVE','RELEASED','COLLECTED'),
      allowNull: false,
      defaultValue: "ACTIVE"
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
    durationId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'staking_duration',
        },
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'staking_log'
  });
};
