const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        filename: 'cirsim.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'Cirsim',
        libraryTarget: 'umd',
        libraryExport: "default",
        publicPath: ''
    },
    devServer: {
        host: 'cirsim.localhost',
        proxy: [{
                context: ['/api-demo/'],
                target: 'http://cirsim.localhost',
                secure: false,
                changeOrigin: false,
                cookieDomainRewrite: "http://cirsim.localhost",
                headers: {origin: 'http://cirsim.localhost'}
        }]

    }
});
