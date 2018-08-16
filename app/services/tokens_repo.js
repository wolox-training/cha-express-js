const tokensRepo = [];

exports.numberOfTokens = () => tokensRepo.length;

exports.store = token => tokensRepo.push(token);
