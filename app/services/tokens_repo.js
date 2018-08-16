const tokensRepo = [];

exports.numberOfTokens = () => tokensRepo.length;

exports.store = token => {
  tokensRepo.push({
    token,
    active: true
  });
};

exports.isActive = token => {
  const foundToken = tokensRepo.find(record => record.token === token);
  const active = foundToken ? foundToken.active : false;
  return active;
};
