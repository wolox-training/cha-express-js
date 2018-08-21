exports.html = content => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8"/>
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title></title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body style="margin: 0 !important; padding: 0; !important background-color: #ffffff;" bgcolor="#ffffff">
      <div>${content}</div>
    </body>
  </html>`;
};
