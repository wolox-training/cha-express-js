const tokensRepo = [];

exports.numberOfTokens = () => tokensRepo.length;

exports.store = token => {
  tokensRepo.push(token);
};

exports.isActive = token => {
  return new Promise((res, rej) => {
    const foundToken = tokensRepo.find(storedToken => storedToken === token);
    res(foundToken !== undefined);
  });
};

exports.disableAll = () => {
  return new Promise((res, rej) => {
    let numberOfTokens = 0;
    while (tokensRepo.length > 0) {
      tokensRepo.pop();
      numberOfTokens++;
    }
    res(numberOfTokens);
  });
};
