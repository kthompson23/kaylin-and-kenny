const path = require('path');

module.exports = {
  entry: {
    js: './app/client/viewer.js',
  },
  output: {
    path: path.resolve(__dirname, './app/static/javascript'),
    filename: 'webpack.bundle.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
    ],
  },
  resolve: {
    modules: ['node_modules', './client/src'],
    extensions: ['.js', '.jsx'],
  },
};
