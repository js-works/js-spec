const
  path = require('path'),
  CompressionPlugin = require('compression-webpack-plugin');

function createBuildConfig(moduleFormat, environment, noop) {
  return {
    mode: environment,
    entry: noop ? './src/main/js-spec.noop.ts' : './src/main/js-spec.ts',
    devtool: environment === 'production' ? false : 'inline-source-map',
    module: {
      unknownContextCritical: false,
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                compilerOptions: {
                  ...(!noop ? { declaration: true, declarationDir: 'types' } : {}),
                }
              }
            }
          ],
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.ts']
    },
    output: {
      filename: noop
        ? `js-spec.noop.${moduleFormat}.${environment}.js`
        : `js-spec.${moduleFormat}.${environment}.js`,
      path: path.resolve(__dirname, 'dist'),
      library: 'jsSpec',
      libraryTarget: moduleFormat === 'cjs' ? 'commonjs2' : moduleFormat
    },
    plugins: [ 
      new CompressionPlugin({
        test: /production.*\.js/,
      })
    ]
  };
}

const buildConfigs = [];

for (const moduleFormat of ['umd', 'cjs', 'amd']) {
  for (const environment of ['development', 'production']) {
    buildConfigs.push(createBuildConfig(moduleFormat, environment, false));
  }

  buildConfigs.push(createBuildConfig(moduleFormat, 'production', true));
}


module.exports = buildConfigs;
