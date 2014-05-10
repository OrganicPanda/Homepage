var renderer = require('../lib/renderer')
  , fixtureDir = __dirname + '/fixtures';

describe('Renderer', function() {
  it('can render simple Markdown', function(done) {
    renderer(fixtureDir + '/markdown.md', {}, function(err, str) {
      expect(err).toBe(null);
      expect(str).toMatch(
        /<h1 id="title">Title<\/h1>\s<p>Paragraph of text\.<\/p>/
      );
      done();
    });
  });

  it('can render an ejs include', function(done) {
    renderer(fixtureDir + '/includer.md', {}, function(err, str) {
      expect(err).toBe(null);
      expect(str).toBe('<p>Foo(included)Bar</p>');
      done();
    });
  });

  it('can trim', function(done) {
    renderer(fixtureDir + '/trim.md', {}, function(err, str) {
      expect(err).toBe(null);
      expect(str).toBe('<p>Hi!</p>');
      done();
    });
  });
});