const gulp = require("gulp");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const htmlmin = require("gulp-htmlmin");
const ngAnnotate = require("gulp-ng-annotate");
// const rename = require("gulp-rename");
const del = require("del");

// Tarea para limpiar la carpeta dist
gulp.task("clean", function (done) {
  // Verificamos si del es una función o tiene deleteSync (según versión)
  const deleter = typeof del.deleteSync === "function" ? del.deleteSync : del;
  deleter(["dist/**/*", "!dist"]);
  done();
});

gulp.task("build-core", function () {
  return gulp
    .src(["app/*.js"])
    .pipe(ngAnnotate())
    .pipe(uglify())
    // .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/app"));
});

gulp.task("build-components", function () {
  return gulp
    .src("app/components/**/*.js")
    .pipe(ngAnnotate())
    .pipe(uglify())
    // .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/app/components"));
});

gulp.task("build-services", function () {
  return gulp
    .src("app/services/**/*.js")
    .pipe(ngAnnotate())
    .pipe(uglify())
    // .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/app/services"));
});

gulp.task("build-html", function () {
  return gulp
    .src("app/components/**/*.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true, // Elimina espacios en blanco
        removeComments: true, // Elimina comentarios de HTML
        removeRedundantAttributes: true, // Elimina atributos como type="text/javascript"
      })
    )
    .pipe(gulp.dest("dist/app/components"));
});

gulp.task("build-views", function () {
  return gulp
    .src("app/views/**/*.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true, // Elimina espacios en blanco
        removeComments: true, // Elimina comentarios de HTML
        removeRedundantAttributes: true, // Elimina atributos como type="text/javascript"
      })
    )
    .pipe(gulp.dest("dist/app/views"));
});

gulp.task("build-index", function () {
  return gulp
    .src("index.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        ignoreCustomFragments: [/<\?[\s\S]*?\?>/], // IMPORTANTE: No tocar código PHP
      })
    )
    .pipe(gulp.dest("dist/"));
});

gulp.task("build-css", function () {
  return gulp
    .src("assets/css/*.css")
    .pipe(cleanCSS())
    // .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/assets/css"));
});

// Tarea principal
gulp.task("build", gulp.series("clean", gulp.parallel("build-core", "build-index", "build-components", "build-services", "build-html", "build-views", "build-css")));
