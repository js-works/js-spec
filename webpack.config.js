const
  path = require('path'),
  CompressionPlugin = require('compression-webpack-plugin');

function createBuildConfig(moduleFormat, environment) {
  return {
    mode: environment,
    entry: './src/main/js-spec',
    devtool: environment === 'production' ? false : 'inline-source-map',
    module: {
      unknownContextCritical: false,
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.ts']
    },
    output: {
      filename: (moduleFormat === 'umd' ? '' : `${moduleFormat}/`) + `js-spec.${environment}.js`,
      path: path.resolve(__dirname, 'dist'),
      library: 'jsSpec',
      libraryTarget: moduleFormat === 'cjs' ? 'commonjs2' : moduleFormat
    },
    plugins: [ 
      ...environment === 'production' ? [new CompressionPlugin()] : []
    ]
  };
}

const buildConfigs = [];

for (const moduleFormat of ['umd', 'cjs', 'amd']) {
  for (const environment of ['development', 'production']) {
    buildConfigs.push(createBuildConfig(moduleFormat, environment));
  }
}

module.exports = buildConfigs;
