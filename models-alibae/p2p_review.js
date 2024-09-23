/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('p2p_review', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    reviewerId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'user',
        },
        key: 'id'
      }
    },
    reviewedId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'user',
        },
        key: 'id'
      }
    },
    offerId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: {
          tableName: 'p2p_offer',
        },
        key: 'id'
      }
    },
    rating: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
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
    tableName: 'p2p_review'
  });
};
