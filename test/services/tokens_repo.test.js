const chai = require('chai');
const chaiThings = require('chai-things');

const should = chai.should();
chai.use(chaiThings);

const TokensRepoService = require('../../app/services/tokens_repo');

describe('TokensRepoService', () => {
  describe('store', () => {
    it('Should store a token', done => {
      const numberOfTokensBefore = TokensRepoService.numberOfTokens();
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InJlZ3VsYXIiLCJleHAiOjE1MzQ0NDU5MTcsImlhdCI6MTUzNDQ0NTg1N30.xwBZB6ioUZ-Blp08tV_zLrXvAy8kGlQGfo_OrwrUFhU';
      TokensRepoService.store(token);
      const numberOfTokensAfter = TokensRepoService.numberOfTokens();
      numberOfTokensAfter.should.equal(numberOfTokensBefore + 1);
      done();
    });
  });
});
