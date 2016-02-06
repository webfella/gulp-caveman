'use strict';

var assert = require('assert'),
    gutil = require('gulp-util'),
    gulpCaveman = require('./');

describe('gulp caveman', function() {
    var contents = 'function test(){}';

    it("doesn't edit the file when no templates are present", function (cb) {
        var stream = gulpCaveman();

        stream.on('data', function (file) {
            assert.equal(file.contents.toString(), 'function test(){}');
            cb();
        });

        stream.write(new gutil.File({
            contents: new Buffer(contents)
        }));
    });

    it('renders a template passed in as a string', function (cb) {
        var stream = gulpCaveman('fixtures/template-1.html');

        stream.on('data', function (file) {
            assert.equal(
                file.contents.toString(),
                mockCavemanOutput('template-1', '<div>template 1</div>') + contents
            );
            cb();
        });

        stream.write(new gutil.File({
            contents: new Buffer(contents)
        }));
    });

    it('renders all templates matched in a glob', function (cb) {
        var stream = gulpCaveman('fixtures/*.html');

        stream.on('data', function (file) {
            assert.equal(
                file.contents.toString(),
                mockCavemanOutput('template-1', '<div>template 1</div>') +
                mockCavemanOutput('template-2', '<div>template 2</div>') +
                contents
            );
            cb();
        });

        stream.write(new gutil.File({
            contents: new Buffer(contents)
        }));
    });

    it('renders all templates passed in as an array', function (cb) {
        var stream = gulpCaveman(['fixtures/template-2.html', 'fixtures/template-1.html']);

        stream.on('data', function (file) {
            assert.equal(
                file.contents.toString(),
                mockCavemanOutput('template-2', '<div>template 2</div>') +
                mockCavemanOutput('template-1', '<div>template 1</div>') +
                contents
            );
            cb();
        });

        stream.write(new gutil.File({
            contents: new Buffer(contents)
        }));
    });
});

function mockCavemanOutput (name, contents) {
  return `Caveman.register("${name}", function(Caveman, d) { var _CfS = Caveman.forceStr; var str = '';str += '${contents}';return str; });\n`;
}
