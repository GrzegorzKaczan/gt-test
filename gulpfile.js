var gulp = require('gulp');
var ts = require('gulp-typescript');
var fs = require('fs');
var mkdirp = require('mkdirp');

var mkdirSync = function (path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
}

var tsProject = ts.createProject({
  module: "amd",
  target: "es5",
  jsx: "react",
  sortOutput: false,
  declaration: false,
  noEmitHelpers: true,
  removeComments: false,
  noExternalResolve: true,
  experimentalDecorators: true,
  typescript: require('typescript')
});

var testComponent = "\
export default class NAME {\
  private someFunc = () => {\
    return true;\
  };\
  render() {\
    let s = this.someFunc();\
    return null;\
  }\
}";

gulp.task('build', function () {
  mkdirp('test');
  mkdirp('out');

  for(var i = 0; i < 10000; i++) {
    var name = "Component" + i;
    fs.writeFileSync('test/' + name + '.tsx', testComponent.replace("NAME", name));
  }
});

gulp.task('compile', ['build'], function() {
    var tsResult = gulp.src('test/*.tsx')
                  .pipe(ts(tsProject));

    return tsResult.js.pipe(gulp.dest('out'));
});

gulp.task('default', ['compile']);

