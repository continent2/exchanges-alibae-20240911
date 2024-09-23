/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mlm_referral_reward', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    conditionId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'mlm_referral_condition',
        },
        key: 'id'
      }
    },
    referrerId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'user',
        },
        key: 'id'
      }
    },
    reward: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    isClaimed: {
      type: DataTypes.INTEGER(1),
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
    tableName: 'mlm_referral_reward'
  });
};
