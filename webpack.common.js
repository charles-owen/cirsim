const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: './src/app.modules.js'
    },
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        // new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Cirsim',
            filename: 'index.html',
            template: 'src/html/index.html',
            inject: 'head'
        }),
        new HtmlWebpackPlugin({
            title: 'Cirsim SingleSave demo',
            filename: 'single.html',
            template: 'src/html/single.html',
            inject: 'head'
        }),
        new HtmlWebpackPlugin({
            title: 'Cirsim Inline demo',
            filename: 'inline.html',
            template: 'src/html/inline.html',
            inject: 'head'
        }),
        new HtmlWebpackPlugin({
            title: 'Cirsim No-window mode demo',
            filename: 'nowindow.html',
            template: 'src/html/nowindow.html',
            inject: 'head'
        }),
        /*  new HtmlWebpackIncludeAssetsPlugin({
            assets: ['https://code.jquery.com/jquery-3.3.1.slim.min.js'],
            append: false
        }), */
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery'",
            "window.$": "jquery"
        }),
        new CopyWebpackPlugin([
            {
                from: 'src/img/*.png',
                to: 'img',
                flatten: true
            },
            {
                from: 'src/img/*.ico',
                to: 'img',
                flatten: true
            },
            {
                from: 'src/help',
                to: 'help',
                flatten: false
            }
        ])
    ], module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                loader:"file-loader",
                query:{
                    name:'[name].[ext]',
                    outputPath:'img/'
                }
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'resolve-url-loader',
                    'sass-loader?sourceMap'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            // {
            //     test: /\.(png|svg|jpg|gif)$/,
            //     use: [
            //         'file-loader'
            //     ]
            // }
        ]
    } /*,
    externals: {
        jquery : {
            commonjs: "jquery",
            commonjs2: "jquery",
            amd: "jquery",
            root: "$" // indicates global variable
        }
    } */
};
