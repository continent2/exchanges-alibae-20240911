/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('faq', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    faqCategoryId: {
      type: DataTypes.STRING(191),
      allowNull: false,
      references: {
        model: {
          tableName: 'faq_category',
        },
        key: 'id'
      }
    },
    question: {
      type: 'LONGTEXT',
      allowNull: false
    },
    answer: {
      type: 'LONGTEXT',
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
    tableName: 'faq'
  });
};
