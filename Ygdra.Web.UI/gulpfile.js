/// <binding AfterBuild='build' />
var gulp = require('gulp');
var path = require('path');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var open = require('gulp-open');
const minify = require("gulp-minify");
const del = require("del");

var source = require('vinyl-source-stream');
var rollupStream = require('@rollup/stream');
var rollup = require('rollup-stream');

var resolve = require('@rollup/plugin-node-resolve');
var terser = require('rollup-plugin-terser');
var commonjs = require('@rollup/plugin-commonjs');
var uglify = require("rollup-plugin-uglify");

var Paths = {
    HERE: './',
    DIST: 'dist/',
    CSS: './wwwroot/css/',
    SCRIPTS: './wwwroot/scripts/',
    JS: './wwwroot/js/',
    IMG: './wwwroot/images/',
    SCSS: './ClientSrc/scss/**/**',
    ROLLUP: './ClientSrc/index.es.js'
};

function compileScss() {
    return gulp.src(Paths.SCSS)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write(Paths.HERE))
        .pipe(gulp.dest(Paths.CSS));
};

function rollupSrc() {

    const options = {
        input: './ClientSrc/index.js',
        output: {
            format: 'es',
            sourcemap: true
        },
        plugins: [
            resolve.nodeResolve(),
            commonjs(),
            //terser.terser()
        ]
    }
    return rollupStream(options)
        .pipe(source('index.es.js'))
        .pipe(gulp.dest(Paths.JS));
}

const build = gulp.parallel(compileScss, rollupSrc);

function watch() {
    //gulp.watch(Paths.SCSS, compileScss);
    gulp.watch('./ClientSrc/**/**', build)
}


exports.scss = compileScss;
exports.build = build;
exports.rollup = rollupSrc;
exports.watch = watch;
//function minifyJs() {
//    return gulp.src('./assets/js/**/**', { allowEmpty: true })
//        .pipe(minify({ noSource: true }))
//        .pipe(gulp.dest(Paths.JS));
//}

//function copyCss() {
//    return gulp.src('./assets/css/**/**')
//        .pipe(gulp.dest(Paths.CSS));
//};

//function copyScripts() {
//    return gulp.src('./assets/scripts/**/**')
//        .pipe(gulp.dest(Paths.SCRIPTS));
//}

//function copyJs() {
//    return gulp.src('./assets/js/**/**')
//        .pipe(gulp.dest(Paths.JS));
//}

//function copyImages() {
//    return gulp.src('./assets/img/**/**')
//        .pipe(gulp.dest(Paths.IMG));
//}

//function copyIco() {
//    return gulp.src('./assets/favicon.ico')
//        .pipe(gulp.dest('./wwwroot/'));
//}


//// Clean assets
//function clean() {
//    return del(["./wwwroot/"]);
//}

