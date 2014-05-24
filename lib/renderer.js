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

var renderEjsString = function(str, options) {
	return ejs.render(str, options);
};

var renderMdString = function(str, options) {
	return marked(str).trim();
};

// (String, Object) => String
var renderers = {
  'ejs': renderEjsString,
  'md': renderMdString
};

var inverted = true;

var renderChild = function(file, options, done) {
	var exts = path.basename(file).split('.').splice(1)
	  , reduce = inverted ? 'reduce' : 'reduceRight';

	fs.readFile(file, function(err, data) {
		if (!err) {
			// Call each renderer and pass the results to the next one
			data = exts[reduce](function(previous, current) {
			  return renderers[current](previous, options);
			}, String(data));
		}

		done(err, data);
	});
};

/**
 * Render EJS then Markdown and call `done` when done
 * @param  {string}   file
 * @param  {object}   options
 * @param  {Function} done
 */
var render = function(file, options, done) {
	var config = getConfig(file);

	renderChild(file, options, function(err, renderedChild) {
		if (!err && config.extend) {
			options.body = renderedChild;

			render(
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