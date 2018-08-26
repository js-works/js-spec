const
  path = require('path'),
  CompressionPlugin = require('compression-webpack-plugin');

function createBuildConfig(moduleFormat, environment, devOnly) {
  const productive = environment === 'production'

  return {
    mode: environment,
    entry: devOnly ? './src/main/js-spec.dev-only.ts' : './src/main/js-spec.ts',
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
                  ...(!devOnly ? { declaration: true, declarationDir: 'types' } : {}),
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
      filename: devOnly
        ? `js-spec.dev-only.${moduleFormat}.${environment}.js`
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
    for (const devOnly of [false, true]) {
      buildConfigs.push(createBuildConfig(moduleFormat, environment, devOnly));
    }
  }
}

module.exports = buildConfigs;
