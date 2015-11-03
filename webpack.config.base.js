var path = require('path');
var webpack = require('webpack');
var version = require('./package.json').version;

module.exports = {
	_banner: 'Social Likes v' + version + ' by Artem Sapegin - https://github.com/sapegin/social-likes - MIT License',
	module: {
		loaders: [
			{
				test: /\.js$/,
				loaders: ['babel'],
				include: path.join(__dirname, 'src'),
			}
		]
	},
	output: {
		library: 'SocialLikes',
		libraryTarget: 'umd'
	},
	resolve: {
		extensions: ['', '.js']
	}
};
