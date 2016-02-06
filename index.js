'use strict';

var fs = require('fs'),
    path = require('path');

var Caveman = require('caveman'),
    glob = require('glob'),
    gutil = require('gulp-util'),
    through = require('through2');

module.exports = function (templates) {
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-caveman', 'Streaming not supported'));
            return;
        }

        try {
            file.contents = compileTemplates(file.contents, templates, cb);
            this.push(file);
        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-caveman', err, {fileName: file.path}));
        }

        cb();
    });
};

function compileTemplates (contents, templates, cb) {
    if (!templates) {
        return contents;
    }

    if (typeof templates === 'string') {
        templates = [templates];
    }

    var templateCount = 0;
    var compiled = templates.map(function (pattern) {
      var templateFiles = glob.sync(pattern);
      templateCount = templateCount + templateFiles.length;

      return templateFiles.reduce(function (previous, current) {
          var name = path.basename(current, path.extname(current)),
              template = '';

          try {
              let compiled = Caveman.compile(fs.readFileSync(current).toString());
              template = `Caveman.register("${name}", function(Caveman, d) { ${compiled} });\n`;
          } catch (err) {
              cb(new gutil.PluginError('gulp-caveman', 'Error compiling Caveman template ' + name));
          }

          return previous + template;
      }, '');
    });

    if (templateCount) {
      let templateMsg = templateCount === 1 ? 'template saved.' : 'templates saved.'
      gutil.log(templateCount, templateMsg);
    }

    return new Buffer(compiled.join('') + contents.toString());
}
