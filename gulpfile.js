var gulp = require('gulp'),
    typescript = require('gulp-typescript'),
    typedoc = require('gulp-typedoc'),
    fs = require('fs'),
    merge = require('merge2'),

    typescriptProject = typescript.createProject({
        declaration: true
    });

function getPackageJson() {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
}

gulp.task('default', function () {
    console.log()  
});

gulp.task('scripts', function() {
    return gulp.src('src/main/json-spec.ts')
        .pipe(typescriptProject({
            target: 'es5',
            module: 'system',
            declaration: false,
            noImplicitAny: false,
            removeComments: true,
            noLib: false,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            sourceMap: true,
            listFiles: true,
            outFile: 'js-spec.js'
        }))
        .pipe(gulp.dest('build'));
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
