var ejs = require('ejs')
  , marked = require('marked')
  , path = require('path')
  , fs = require('fs');

var getConfig = function(file) {
  try {
    return require(path.join(path.dirname(file), 'config.js'));
  } catch (e) {
    return {};
  }
}

// (String, Object) => String
var renderers = {
  'ejs': ejs.render,
  'md': function(str, options) {
    return marked(str).trim();
  }
};

var inverted = true;

var renderChild = function(file, options, done) {
  var reduce = inverted ? 'reduce' : 'reduceRight'
    , exts = path.basename(file)
        .split('.')
        .splice(1)
        .map(function(ext) {  
          return renderers[ext];
        })
        .filter(function(ext) {
          return !!ext;
        });

  fs.readFile(file, function(err, data) {
    if (!err) {
      // Call each renderer and pass the results to the next one
      data = exts[reduce](function(previous, current) {
        return current(previous, options);
      }, String(data));
    }

    done(err, data);
  });
};

// Merge b in to a
// Missing keys are copied (no references are saved)
// Arrays will be merged `b` first, then unique entries in `a` concatenated
var mergeConfig = function(a, b) {
  a = JSON.parse(JSON.stringify(a));
  b = JSON.parse(JSON.stringify(b));

  Object.keys(b).forEach(function(key) {
    if (typeof a[key] === 'undefined') { 
      a[key] = b[key];
    } else if (a[key] instanceof Array && b[key] instanceof Array) {
      var newKeys = a[key].filter(function(item) {
        return b[key].indexOf(item) === -1;
      });

      a[key] = b[key].concat(newKeys);
    }
  });

  return a;
};

/**
 * Render EJS then Markdown and call `done` when done
 * @param  {string}   file
 * @param  {object}   options
 * @param  {Function} done
 */
var render = function(file, options, done) {
  options.page = {};
  doRender(file, options, done);
};

var doRender = function(file, options, done) {
  var config = getConfig(file);

  options.page = mergeConfig(options.page, config);

  renderChild(file, options, function(err, renderedChild) {
    if (!err && config.extend) {
      options.page.body = renderedChild;

      doRender(
        path.resolve(path.dirname(file), config.extend),
        options,
        done
      );
    } else {
      done(err, renderedChild);
    }
  });
};

module.exports = render;