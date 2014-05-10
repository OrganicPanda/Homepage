var ejs = require('ejs')
  , marked = require('marked');

/**
 * Render EJS then Markdown and call `fn` when done
 * @param  {string}   path
 * @param  {object}   options
 * @param  {Function} fn
 */
var renderer = function(path, options, fn) {
  ejs.renderFile(path, options, function(err, str) {
    fn(err, marked(str).trim());
  });
};

module.exports = renderer;