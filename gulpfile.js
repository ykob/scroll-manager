const gulp = require('gulp');
const requireDir = require('require-dir');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

const $ = require('./gulp/plugins');
const DIR = require('./gulp/conf').DIR;

requireDir('./gulp/tasks');

gulp.task('predefault', cb => {
  runSequence(
    'cleanDest',
    ['pug', 'sass', 'scripts', 'copyToDest'],
    'serve',
    cb
  );
});

gulp.task('default', ['predefault'], () => {
  $.watch(
    [`./${DIR.SRC}/**/*.{scss,sass}`],
    () => {
      gulp.start(['sass'])
    }
  ).on('change', reload);

  $.watch(
    [`./${DIR.SRC}/**/*.pug`]
  ).on('change', reload);

  $.watch(
    [
      `./${DIR.SRC}/**/*.js`,
    ],
    () => {
      gulp.start(['scripts'])
    }
  ).on('change', reload);

  $.watch(
    [
      `./${DIR.SRC}/img/**/*.*`,
      `./${DIR.SRC}/font/**/*.*`,
      `./${DIR.SRC}/json/**/*.*`,
    ],
    () => {
      gulp.start(['copyToDest'])
    }
  ).on('change', reload);
});

gulp.task('build', cb => {
  runSequence(
    'cleanDest',
    ['pug', 'sass', 'copyToDest'],
    'cleanBuild',
    'replaceHtml',
    'cleanCss',
    'scripts',
    'imagemin',
    'copyToBuild',
    cb
  );
});

gulp.task('buildHtml', cb => {
  runSequence(
    'pug',
    'replaceHtml',
    cb
  );
});

gulp.task('buildCss', cb => {
  runSequence(
    'sass',
    'cleanCss',
    cb
  );
});
