var gulp = require('gulp'),
    typedoc = require('gulp-typedoc'),
    fs = require('fs');

function getPackageJson() {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
}

gulp.task('default', function () {
    console.log()  
});

gulp.task('typedoc', function () {
    var pkg = getPackageJson();

    return gulp
        .src(['src/main/api/*.ts'])
        .pipe(typedoc({
            module: 'commonjs',
            target: 'es6',
            includeDeclarations: true,
            mode: 'file',
            //entryPoint: 'js-spec',
            out: './dist/doc/api',
            name: 'js-spec ' + pkg.version,
            excludePrivates: true,
            excludeExternals: false,
            exclude: '**/internal/**',
            ignoreCompilerErrors: true,
            version: true,
            hideGenerator: true,
            theme: 'default'
        }));
});
