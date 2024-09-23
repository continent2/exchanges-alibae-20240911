/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ecosystem_custodial_wallet', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    masterWalletId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'ecosystem_master_wallet',
        },
        key: 'id'
      }
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    chain: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    network: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "mainnet"
    },
    status: {
      type: DataTypes.ENUM('ACTIVE','INACTIVE','SUSPENDED'),
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
    }
  }, {
    sequelize,
    tableName: 'ecosystem_custodial_wallet'
  });
};
