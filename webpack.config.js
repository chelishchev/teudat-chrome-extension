const path = require('path');

module.exports = {
	entry: {
		popup: './src/popup/index.js',
		'page-worker': './src/page-worker/index.js',
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [],
};
