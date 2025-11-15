const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 8080,
    host: '0.0.0.0',
    hot: true,
    allowedHosts: 'all',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '' }
      ],
    }),
  ],
  resolve: {
    extensions: ['.js'],
  },
};
