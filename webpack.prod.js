const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    performance: {
        maxEntrypointSize: 500000,
        maxAssetSize: 500000
    },
    output: {
        filename: 'cirsim.min.js',
        path: path.resolve(__dirname, 'dist')
    },
});
