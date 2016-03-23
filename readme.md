# gulp-caveman [![Build Status](https://travis-ci.org/webfella/gulp-caveman.svg?branch=master)](https://travis-ci.org/webfella/gulp-caveman)

> Gulp Plugin for Caveman

Compile Caveman templates on the server-side using Gulp.

## Install

```
$ npm install gulp-caveman --save-dev
```

## Usage

```js
var gulp = require('gulp');
var gulpCaveman = require('gulp-caveman');

gulp.task('default', function () {
    return gulp.src('src/templates/*.html')
        .pipe(gulpCaveman())
        .pipe(gulp.dest('public'));
});
```

## License

MIT
