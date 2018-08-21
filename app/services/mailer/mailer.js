const config = require('../../../config');
const nodemailer = require('nodemailer');
const stubTransport = require('nodemailer-stub-transport');

exports.send = (to, content, stub = false) => {
  const transporter = stub
    ? nodemailer.createTransport(stubTransport())
    : nodemailer.createTransport(config.common.mailer);

  return transporter.sendMail({
    from: `"Wolox Training 👤" <${config.common.mailer.auth.user}>`,
    to,
    subject: content.subject,
    html: `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title></title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body style="margin: 0 !important; padding: 0; !important background-color: #ffffff;" bgcolor="#ffffff">
      <div>${content.body}</div>
    </body>
    </html>`
  });
};
