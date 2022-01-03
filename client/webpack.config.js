const path = require('path');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    devtool: 'inline-source-map',
    entry: './game.ts',
    mode: 'development',
    module: {
        rules: [{
            test: /\.ts?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    output: {
        filename: 'game.js',
        path: path.resolve(__dirname, 'lib')
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
};