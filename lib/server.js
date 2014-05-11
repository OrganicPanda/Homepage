var fs = require('fs')
  , proc = require('child_process')
  , server, cmd, args, options
  , pidfile = 'server.pid';

var start = function(cb) {
  kill(function() {
    server = proc.spawn(cmd, args);

    server.stdout.on('data', function(data) {
      if (!!/Listening on port/.exec(data)) {
        console.log('Server started (pid: ' + server.pid + '). ' + data);
        fs.writeFileSync(pidfile, server.pid);

        if (cb) cb();
      }
    });

    server.stderr.on('data', function(data) {
      if (!!/EADDRINUSE/.exec(data)) {
        console.log('Server address already in use!');
      }
    });
  });
};

var kill = function(cb) {
  fs.readFile(pidfile, { encoding: 'utf8' }, function(err, pid) {
    if (!err && pid) {
      proc.spawn('kill', [pid]);
      fs.unlinkSync(pidfile);
      console.log('Server stopped (pid: ' + pid + ')');
    }
    server = null;
    if (cb) cb();
  });
};

module.exports = function(userCmd, userArgs, userOptions) {
  if (!userCmd) throw "cmd required";
  cmd = userCmd;
  args = userArgs || [];
  options = Object.create({}, userOptions);

  return {
    start: start,
    restart: start,
    stop: kill,
    kill: kill
  };
};