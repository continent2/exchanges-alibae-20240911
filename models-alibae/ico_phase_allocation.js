/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ico_phase_allocation', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    allocationId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'ico_allocation',
        },
        key: 'id'
      }
    },
    phaseId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'ico_phase',
        },
        key: 'id'
      }
    },
    percentage: {
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
    tableName: 'ico_phase_allocation'
  });
};
