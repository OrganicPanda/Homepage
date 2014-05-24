var ejs = require('ejs')
  , marked = require('marked')
  , path = require('path');

var getConfig = function(file) {
	try {
		return require(path.join(path.dirname(file), 'config.js'));
	} catch (e) {
	 	return {};
	}
}

var renderChild = function(file, options, done) {
	// TODO: something smart with file ext
	ejs.renderFile(file, options, function(err, str) {
    done(err, marked(str).trim());
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