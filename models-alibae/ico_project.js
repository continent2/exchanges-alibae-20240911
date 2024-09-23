/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ico_project', {
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
      type: 'LONGTEXT',
      allowNull: false
    },
    website: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    whitepaper: {
      type: 'LONGTEXT',
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING','ACTIVE','COMPLETED','REJECTED','CANCELLED'),
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
    }
  }, {
    sequelize,
    tableName: 'ico_project'
  });
};
