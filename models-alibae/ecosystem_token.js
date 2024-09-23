/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ecosystem_token', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    chain: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    network: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    contract: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    contractType: {
      type: DataTypes.ENUM('PERMIT','NO_PERMIT','NATIVE'),
      allowNull: false,
      defaultValue: "PERMIT"
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    decimals: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 1
    },
    precision: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 8
    },
    limits: {
      type: 'LONGTEXT',
      allowNull: true
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
    },
    fee: {
      type: 'LONGTEXT',
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ecosystem_token'
  });
};
