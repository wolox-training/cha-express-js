'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable(
        'AlbumPurchases',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          userId: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          albumId: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          }
        },
        {}
      )
      .then(() => {
        return queryInterface.addConstraint('AlbumPurchases', ['userId', 'albumId'], {
          type: 'unique',
          name: 'purchase_unique'
        });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('AlbumPurchases');
  }
};
