/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mlm_referral_condition', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('DEPOSIT','TRADE','INVESTENT','INVESTMENT','AI_INVESTMENT','FOREX_INVESTMENT','ICO_CONTRIBUTION','STAKING','ECOMMERCE_PURCHASE','P2P_TRADE'),
      allowNull: false
    },
    reward: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    rewardType: {
      type: DataTypes.ENUM('PERCENTAGE','FIXED'),
      allowNull: false
    },
    rewardWalletType: {
      type: DataTypes.ENUM('FIAT','SPOT','ECO'),
      allowNull: false
    },
    rewardCurrency: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    rewardChain: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 1
    },
    image: {
      type: DataTypes.STRING(191),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'mlm_referral_condition'
  });
};
