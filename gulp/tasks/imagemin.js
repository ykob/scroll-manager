const gulp = require('gulp');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');

const $ = require('../plugins');
const conf = require('../conf').imagemin;

gulp.task('imagemin', () => {
  return gulp.src(conf.src)
    .pipe($.imagemin(
      [
        pngquant(),
        mozjpeg()
      ],
      {
        progressive: true,
        svgoPlugins: [{removeViewBox: false}]
      }
    ))
    .pipe($.rename(path => {
      path.dirname = path.dirname.replace('img', '.');
    }))
    .pipe(gulp.dest(conf.dest));
});
