'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
        validate: {
          notEmpty: false
        }
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
        validate: {
          notEmpty: false
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
        unique: true,
        validate: {
          isEmail: { args: true, msg: 'not a valid email' },
          notEmpty: false,
          len: { args: [0, 100], msg: 'email cant be bigger than 100 characters' }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
        validate: {
          notEmpty: false
        }
      }
    },
    {}
  );

  User.isPwdLengthGreater = (user, length) => {
    return user.password && user.password.length >= length;
  };

  User.createModel = user => {
    return User.create(user);
  };
  return User;
};
