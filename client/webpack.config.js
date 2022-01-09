const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';
console.log('webpack mode', isDev ? 'development' : 'production');
module.exports = {
    context: path.resolve(__dirname, 'src'),
    devtool: isDev ? 'inline-source-map': undefined,
    entry: './game.ts',
    mode: isDev ? 'development': 'production',
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