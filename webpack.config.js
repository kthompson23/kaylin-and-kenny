const path = require('path');

module.exports = {
    entry: {
        js: './app/client/viewer.js',
    },
    output: {
        path: path.resolve(__dirname, './app/static/javascript'),
        filename: 'webpack.bundle.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            }
        ]
    },
    resolve: {
        modules: ['node_modules', './client/src'],
        extensions: ['.js', '.jsx'],
    },
};
