'use strict';

module.exports = (sequelize, DataTypes) => {
  const AlbumPurchase = sequelize.define(
    'AlbumPurchase',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, unique: 'purchase_unique' },
      albumId: { type: DataTypes.INTEGER, unique: 'purchase_unique' }
    },
    {}
  );

  AlbumPurchase.make = (userId, albumId) => {
    return AlbumPurchase.create({
      userId,
      albumId
    }).catch(err => {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return Promise.reject(new Error('You cannot buy the same album twice'));
      }
      return Promise.reject(err.name);
    });
  };

  return AlbumPurchase;
};
