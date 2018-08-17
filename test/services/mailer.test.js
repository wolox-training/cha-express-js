const chai = require('chai');
const chaiThings = require('chai-things');
const MailerService = require('../../app/services/mailer/mailer');

const should = chai.should();
chai.use(chaiThings);

describe('MailerService', () => {
  describe('send', () => {
    it('Should send an email', done => {
      MailerService.send('test@wolox.com.ar', {
        subject: 'Test email',
        body: '<h1>Test Email</h1>'
      })
        .then(() => done())
        .catch(err => done(new Error(`Email could not be sent: ${err.message}`)));
    });
  });
});
