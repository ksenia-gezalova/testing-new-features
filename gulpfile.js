var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglifyjs'),
    cssnano     = require('gulp-cssnano'),
    rename      = require('gulp-rename'),
    del         = require('del'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    //cache       = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    pug         = require('gulp-pug');


gulp.task('pug', function() {
    return gulp.src('app/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('app'))
});

gulp.task('sass', function() {
    return gulp.src('app/sass/**/*.sass') // если установить !, то файл исключается
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('app/css')) 
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function() {
    return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

gulp.task('css-libs',['sass'], function() {
    return gulp.src('app/css/libs.css')
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('clean', function() {
   return del.sync ('dist');
});


//очистить кэш
/*gulp.task('clear', function() {
   return cache.clearAll();
});*/

gulp.task('img', function() {
    return gulp.src('app/img/**/*')
    .pipe(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        une: [pngquant()]
    }))
    .pipe(gulp.dest('dist/img'));
});

//при включенном кэше конструкция такая 
/* ...
    .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        une: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'));
});
*/

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts', 'pug'], function() {
    gulp.watch('app/pug/**/*.pug', ['pug']);
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {
  var buildCss = gulp.src([
      'app/css/main.css',
      'app/css/libs.min.css'
  ])  
  .pipe(gulp.dest('dist/css'));
    
  var buildFonts = gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'));
    
  var buildJs = gulp.src('app/js/**/*')
  .pipe(gulp.dest('dist/js'));
    
  var buildHtml = gulp.src('app/*.html')
  .pipe(gulp.dest('dist'));
});
