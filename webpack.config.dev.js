const
  path = require('path'),
  CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/main/js-spec.ts',
  devtool: 'inline-source-map',
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
    filename: 'js-spec.development.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'jsSpec',
    libraryTarget: 'umd'
  },
  plugins: [
    new CompressionPlugin()
  ]
};
