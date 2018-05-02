const
  path = require('path'),
  CompressionPlugin = require('compression-webpack-plugin');

module.exports = env => {
  const
    { mode, type } = env || {},
    modeName = mode === 'production' ? 'production' : 'development',
    typeName = ['cjs', 'amd'].includes(type) ? type : 'umd';

  return {
    mode: modeName,
    entry: './src/main/js-spec.ts',
    devtool: modeName === 'production' ? false : 'inline-source-map',
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
      filename: (typeName === 'umd' ? '' : `${typeName}/`) + `js-spec.${modeName}.js`,
      path: path.resolve(__dirname, 'dist'),
      library: 'jsSpec',
      libraryTarget: typeName === 'cjs' ? 'commonjs2' : typeName
    },
    plugins: [
      new CompressionPlugin()
    ]
  };
};
