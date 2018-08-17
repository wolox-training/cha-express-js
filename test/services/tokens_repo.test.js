const chai = require('chai');
const chaiThings = require('chai-things');

const should = chai.should();
chai.use(chaiThings);

const TokensRepoService = require('../../app/services/tokens_repo');

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InJlZ3VsYXIiLCJleHAiOjE1MzQ0NDU5MTcsImlhdCI6MTUzNDQ0NTg1N30.xwBZB6ioUZ-Blp08tV_zLrXvAy8kGlQGfo_OrwrUFhU';

describe('TokensRepoService', () => {
  describe('store', () => {
    it('Should store a token', done => {
      TokensRepoService.numberOfTokens().then(countBefore => {
        TokensRepoService.store(token).then(() => {
          TokensRepoService.numberOfTokens().then(countAfter => {
            countAfter.should.equal(countBefore + 1);
            done();
          });
        });
      });
    });

    it('Should stored token be active', done => {
      TokensRepoService.store(token).then(() => {
        TokensRepoService.isActive(token).then(active => {
          active.should.equal(true);
          done();
        });
      });
    });
  });

  describe('disableAll', () => {
    it('Should disable all stored tokens', done => {
      TokensRepoService.store(token).then(() => {
        TokensRepoService.isActive(token).then(activeBefore => {
          activeBefore.should.equal(true);
          TokensRepoService.disableAll().then(() => {
            TokensRepoService.isActive(token).then(activeAfter => {
              activeAfter.should.equal(false);
              done();
            });
          });
        });
      });
    });
  });
});
