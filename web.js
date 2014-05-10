var express = require('express')
  , logfmt = require('logfmt')
  , app = express()
  , port = Number(process.env.PORT || 5000);

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.listen(port, function() {
  console.log('Listening on ' + port);
});