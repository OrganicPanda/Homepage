var express = require('express')
  , logfmt = require('logfmt')
  , renderer = require('./lib/renderer')
  , app = express()
  , port = Number(process.env.PORT || 5000);

// De-junk
app.disable('x-powered-by');

// Enable Logging
app.use(logfmt.requestLogger());

// Inject the custom renderer
app.engine('.md', renderer);

// Mark certain directories as static
app.use('/views/test', express.static(__dirname + '/views/test'));

app.get('/post/:name', function(req, res) {
  res.render('post/' + req.params.name + '/index.ejs.md');
});

app.get('/', function(req, res) {
  res.render('home', {});
});

app.listen(port, function() {
  console.log('Listening on port', port);
});