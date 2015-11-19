var path = require('path');
var express = require('express');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.development');

var serverPort = 8506;
var serverHost = 'localhost';

var app = express();
var compiler = webpack(webpackConfig);

// Webpack bundle
app.use(require('webpack-dev-middleware')(compiler, {
	noInfo: true
}));

// Skins
app.use(express.static(path.resolve('lib')));

app.listen(serverPort, serverHost, function(err) {
	if (err) {
		console.log('Cannot start dev server', err);
	}
	else {
		console.log('Dev server is listening at http://' + serverHost + ':' + serverPort);
	}
});
