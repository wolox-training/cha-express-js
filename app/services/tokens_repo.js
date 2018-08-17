const Tokens = require('../models').Tokens;

exports.numberOfTokens = () => Tokens.count();

exports.store = aToken => {
  return Tokens.create({
    token: aToken
  });
};

exports.isActive = aToken => {
  return Tokens.findOne({
    where: {
      token: aToken
    }
  }).then(foundToken => {
    return foundToken !== null;
  });
};

exports.disableAll = () => {
  return Tokens.destroy({ where: {} });
};
