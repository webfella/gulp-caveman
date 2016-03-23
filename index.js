'use strict';

var path = require('path');

var Caveman = require('caveman'),
    Concat = require('concat-with-sourcemaps'),
    gutil = require('gulp-util'),
    through = require('through2');

var File = gutil.File;

module.exports = function () {
    var concatenated, lastFile, latestMod;

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-caveman', 'Streaming not supported'));
            return;
        }

        if (!latestMod || file.stat && file.stat.mtime > latestMod) {
            lastFile = file;
            latestMod = file.stat && file.stat.mtime;
        }

        var filename = path.basename(file.path, '.html');

        if (!concatenated) {
            concatenated = new Concat(false, filename, gutil.linefeed);
        }

        try {
            concatenated.add(file.relative, compileTemplate(filename, file.contents.toString(), cb));
        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-caveman', err, {fileName: file.path}));
        }

        cb();
    }, function (cb) {
        if (!lastFile || !concatenated) {
            cb();
            return;
        }

        var file = new File(lastFile);

        file.contents = concatenated.content;

        this.push(file);
        cb();
    });
};

function compileTemplate (fileName, fileContents, cb) {
    var template = '';

    try {
        let compiled = Caveman.compile(fileContents);
        template = `Caveman.register("${fileName}", function(Caveman, d) { ${compiled} });`;
    } catch (err) {
        cb(new gutil.PluginError('gulp-caveman', 'Error compiling Caveman template ' + fileName));
    }

    return new Buffer(template);
}
