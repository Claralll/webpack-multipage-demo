var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var smushit = require('gulp-smushit');
var cache = require('gulp-cache');

gulp.task('autoprefixer', function() {
	gulp.src('dist/css/*.css')
		.pipe(autoprefixer())
		.pipe(gulp.dest('dist/css'));
});

// 打包前先清空dist文件
gulp.task('clean', function() {
	gulp.src('dist')
		.pipe(clean({
			force: true
		}));
});

gulp.task('smushit', function() {
	gulp.src('dist/img/*.{jpg,png}')
		.pipe(cache(smushit({
			verbose: true
		})))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('default', ['autoprefixer', 'smushit']);