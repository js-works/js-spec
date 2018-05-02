const
  path = require('path'),
  CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/main/js-spec.ts',
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
    extensions: [ '.ts' ]
  },
  output: {
    filename: 'js-spec.production.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'jsSpec',
    libraryTarget: 'umd'
  },
  plugins: [
    new CompressionPlugin()
  ]
};
