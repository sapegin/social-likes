var webpack = require('webpack');
var BannerPlugin = require('webpack/lib/BannerPlugin');
var baseConfig = require('./webpack.config.base');

var config = Object.create(baseConfig);
config.plugins = [
	new webpack.optimize.OccurenceOrderPlugin(),
	new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify('production')
	}),
	new webpack.optimize.UglifyJsPlugin({
		compressor: {
			screw_ie8: true,
			warnings: false
		}
	}),
	new BannerPlugin(config._banner)
];

module.exports = config;
