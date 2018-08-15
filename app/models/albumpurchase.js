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

  return AlbumPurchase;
};
