const {merge} = require('webpack-merge');
const common = require('./webpack.common');
const path = require('path');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	output: {
		filename: 'cirsim.js',
		path: path.resolve(__dirname, 'dist')
	},
	devServer: {
		host: 'localhost',
		hot: true,
		static: {
			publicPath: path.resolve(__dirname, 'dist')
		}
	}
});
