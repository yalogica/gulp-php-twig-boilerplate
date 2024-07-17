'use strict';

import gulp from 'gulp';
import rimraf from 'gulp-rimraf';
import cached from 'gulp-cached';
import debug from 'gulp-debug';
import autoprefixer from 'gulp-autoprefixer';
import * as sass from 'sass'
import gsass from 'gulp-sass';
import {pathExistsSync} from 'path-exists';
import connectphp from 'gulp-connect-php';
import browserSync from 'browser-sync';

const config = {
    build: 'build',
    routes: {
        scss: {
            src: ['src/**/*.scss'],
            watch: ['src/**/*.scss']
        },
        js: {
            src: ['src/**/*.js'],
            watch: ['src/**/*.js']
        },
        php: {
            src: ['src/**/*.php', '!src/vendor/**/*'],
            watch: ['src/**/*.php', '!src/vendor/**/*']
        },
        twig: {
            src: ['src/views/**/*.twig'],
            watch: ['src/views/**/*.twig']
        },
        vendor: {
            src: ['src/vendor/**/*']   
        }
    },
    php: {
        bin: 'C:/php/php-8.2.5-Win32-vs16-x64/php.exe',
        ini: 'C:/php/php-8.2.5-Win32-vs16-x64/php.ini'
    }
}

const do_clean = (done) => {
    if(pathExistsSync(config.build)) {
        return gulp.src([config.build + '/*'], { read: false }).pipe(rimraf({ force: true }));
    }
    done();
}

const do_browserSync = (done) => {
    connectphp.server({
        base: config.build,
        bin: config.php.bin,
        ini: config.php.ini,
        port: 8000,
        keepalive: true
    }, () => {
        browserSync({
            proxy: "127.0.0.1:8000",
            port: 8080,
            open: true
        });
    });
    done();
}

const do_reload = (done) => {
    browserSync.reload();
    done();
}

const do_scss = () => {
    return gulp.src(config.routes.scss.src, { base: 'src' })
    .pipe(cached('cache_scss'))
    .pipe(debug())
    .pipe(gsass(sass)())
    .pipe(autoprefixer())
    .pipe(gulp.dest(config.build));
}

const do_js = () => {
    return gulp.src(config.routes.js.src, { base: 'src' })
    .pipe(cached('cache_js'))
    .pipe(debug())
    .pipe(gulp.dest(config.build));
}

const do_php = () => {
    return gulp.src(config.routes.php.src, { base: 'src' })
    .pipe(cached('cache_php'))
    .pipe(debug())
    .pipe(gulp.dest(config.build))
}

const do_twig = () => {
    return gulp.src(config.routes.twig.src, { base: 'src' })
    .pipe(cached('cache_twig'))
    .pipe(debug())
    .pipe(gulp.dest(config.build))
}

const do_vendor = () => {
    return gulp.src(config.routes.vendor.src, { base: 'src' })
    .pipe(cached('cache_vendor'))
    .pipe(debug())
    .pipe(gulp.dest(config.build))
}

const do_watch = (done) => {
    gulp.watch(config.routes.scss.watch, gulp.series(do_scss, do_reload));
    gulp.watch(config.routes.js.watch, gulp.series(do_js, do_reload));
    gulp.watch(config.routes.php.watch, gulp.series(do_php, do_reload));
    gulp.watch(config.routes.twig.watch, gulp.series(do_twig, do_reload));
    done();
}

const build = gulp.series(
    do_clean,
    do_scss,
    do_js,
    do_php,
    do_twig,
    do_vendor,
    do_watch,
    do_browserSync
)

export default build;