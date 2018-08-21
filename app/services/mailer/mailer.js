const config = require('../../../config');
const nodemailer = require('nodemailer');
const stubTransport = require('nodemailer-stub-transport');

exports.send = (to, template, stub = false) => {
  const transporter = stub
    ? nodemailer.createTransport(stubTransport())
    : nodemailer.createTransport(config.common.mailer);

  return transporter.sendMail({
    from: template.from,
    to,
    subject: template.subject,
    html: template.body
  });
};
