const path = require('path');

const NODE_ENV = process.env.NODE_ENV;
const isDev = NODE_ENV === 'development';
const isProd = NODE_ENV === 'production';

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
          { loader: 'css-loader',
            query: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              minimize: isProd,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ['node_modules', './client/src'],
    extensions: ['.js', '.jsx'],
  },
};
