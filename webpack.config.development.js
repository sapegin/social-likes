var webpack = require('webpack');
var BannerPlugin = require('webpack/lib/BannerPlugin');
var baseConfig = require('./webpack.config.base');

var config = Object.create(baseConfig);
config.plugins = [
	new webpack.optimize.OccurenceOrderPlugin(),
	new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify('development')
	}),
	new BannerPlugin(config._banner)
];

module.exports = config;
