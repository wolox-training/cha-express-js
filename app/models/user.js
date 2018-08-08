'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
      },
      role: {
        type: DataTypes.STRING,
        default: 'regular'
      }
    },
    {}
  );

  return User;
};
