'use strict';
// ./node_modules/.bin:
// main dependency
const gulp = require('gulp');
const del  = require('del');
const notify = require("gulp-notify");


const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');

const pug  = require('gulp-pug');

const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');



//.. browser-sync
const browserSync = require('browser-sync').create();


gulp.task('default', function (callback) {
	console.log('done gulp');
	callback();
});

gulp.task('clean', function (callback) {
	del('source/public');
	callback();
});

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
// ..задачи подгрузки бибилиотек из bower
// .. add lib from bower

// ..... jquery
/* DISABLE
gulp.task('addlib:jquery', function () {
	return gulp.assets('bower_components/jquery/dist/jquery.min.js')
		.pipe(gulp.dest('./public/libs'));
});
*/


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
// .. build frontend's files here
gulp.task('htmlCreate', function () {
	return gulp.src('source/frontend_source/pug/**/*.{jade,pug}')
		.pipe(pug())
		.on('error', notify.onError(function (err) {
			return {
				title : 'Pug Create',
				message : err.message
			};
		}))
		.pipe(gulp.dest('source/public'));
});

gulp.task('cssCreate', function () {
	return gulp.src('source/assets/less/**/*.less')
		.pipe(less())
		.on('error', notify.onError(function (err) {
			return {
				title : 'Less Create',
				message : err.message
			};
		}))
		//.pipe(autoprefixer())
		.pipe(gulp.dest('source/public/style'));
        //.pipe(notify({ message: 'crea', wait: false }));
});

//disable image
//gulp.task('imgCreate', function () {
//	return gulp.assets('frontend/img/**/*.{jpg,png}',{since: gulp.lastRun('imgCreate')})
//		.pipe(newer('public/img/**/*.{jpg,png}'))
//		.pipe(imagemin())
//		.pipe(gulp.dest('./public/img'));
//});


gulp.task('jsCreate', function () {
	return gulp.src('source/assets/js/**/*.js')
		.pipe(gulp.dest('source/public/js'));
});

// build frontend
// task buildFrontend
gulp.task('buildFrontend', gulp.series(
	'clean',
	gulp.parallel('htmlCreate', 'cssCreate','jsCreate'))
);



///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
// browser-sync tasks
// task serve:start
gulp.task('server:start', function () {
	browserSync.init({
		server: 'source/public'
	});

	browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
// Watchers
gulp.task('watch:code', function(){
	// .. watch pug teamplate
	gulp.watch('source/frontend_source/pug/**/*.{jade,pug}', gulp.series('htmlCreate'));

	// .. watch less style
	gulp.watch('source/assets/less/**/*.less', gulp.series('cssCreate'));

	//gulp.watch('frontend/img/**/*.{png,jpg}', gulp.series('imgCreate'));

	gulp.watch('source/assets/js/**/*.js', gulp.series('jsCreate'))
});


// task devnow
// build + watch
gulp.task('devnow', gulp.series('buildFrontend', gulp.parallel('watch:code','server:start')));


gulp.task('qdev', gulp.series(gulp.parallel('watch:code','server:start')));

gulp.task("click", function () {
    return gulp.src("some/glob/**")
        .pipe(notify({ message: 'Click or wait', wait: true }));
});