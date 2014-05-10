var shell = require('shelljs')
  , command = [
      './node_modules/jasmine-node/bin/jasmine-node',
      'specs/',
      '--color',
      '--verbose'
    ].join(' ')
  , result = shell.exec(command);

process.exit(result.code);