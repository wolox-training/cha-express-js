'use strict';

module.exports = (sequelize, DataTypes) => {
  const Tokens = sequelize.define(
    'Tokens',
    {
      token: DataTypes.TEXT
    },
    {}
  );

  return Tokens;
};
