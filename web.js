var express = require('express')
  , logfmt = require('logfmt')
  , renderer = require('./lib/renderer')
  , app = express()
  , port = Number(process.env.PORT || 5000);

app.set('views', __dirname + '/views');
app.set('view engine', 'md');
app.engine('.md', renderer);
app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.render('home', {});
});

app.listen(port, function() {
  console.log('Listening on port', port);
});