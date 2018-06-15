const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', 'index.js'],
    plugins: [
        new CleanWebpackPlugin(['dist']),
    ],
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, '../dist'),
        hashDigestLength: 8
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }
        ]
    }
};