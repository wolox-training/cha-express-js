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
        allowNull: false,
        default: 'regular'
      }
    },
    {}
  );

  User.createUser = user => {
    user.role = 'regular';
    return User.create(user);
  };

  User.createAdmin = admin => {
    admin.role = 'admin';
    return User.find({
      where: {
        email: admin.email
      }
    }).then(foundUser => {
      if (foundUser && foundUser.role === 'regular') {
        return foundUser.update({ role: admin.role });
      } else {
        return User.create(admin);
      }
    });
  };

  return User;
};
